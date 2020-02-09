defmodule ImconWeb.TreeChannel do
  @moduledoc """
  Tree channel
  """

  import Imcon.Thorn
  use ImconWeb, :channel

  alias Imcon.Repo
  alias Imcon.Thorn.{UserTree, Leaflet, LeafletMember}
  alias Imcon.Auth.User
  alias ImconWeb.Monitor

  def join("tree:" <> tree_id, _params, socket) do
    current_user = socket.assigns.current_user
    tree = get_current_tree(socket, tree_id)

    Monitor.create(tree_id)

    send(self(), {:after_join, Monitor.user_joined(tree_id, current_user.id)})

    {:ok, %{tree: tree}, assign(socket, :tree, tree)}
  end

  def handle_info({:after_join, connected_user}, socket) do
    broadcast! socket, "user:joined", %{user: connected_user}
    {:noreply, socket}
  end

  def handle_in("branch:create", %{"branch" => branch_params}, socket) do
    tree = socket.assigns.tree

    changeset = tree
      |> build_assoc(:branch)
      |> branch_changeset(branch_params)

    case Repo.insert(changeset) do
      {:ok, branch} ->
        branch = Repo.preload(branch, [:tree, :leaflet])

        broadcast! socket, "branch:created", %{branch: branch}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating branch"}}, socket}
    end
  end

  def handle_in("leaflet:create", %{"leaflet" => leaflet_params}, socket) do
    tree = socket.assigns.tree
    changeset = tree
      |> assoc(:branch)
      |> Repo.get!(leaflet_params["branch_id"])
      |> build_assoc(:leaflet)
      |> leaflet_changeset(leaflet_params)

    case Repo.insert(changeset) do
      {:ok, leaflet} ->
        leaflet = tree
          |> assoc(:leaflet)
          |> leaflet_preload_all
          |> Repo.get!(leaflet.id)

        broadcast! socket, "leaflet:created", %{leaflet: leaflet}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating leaflet"}}, socket}
    end
  end

  def handle_in("member:add", %{"email" => email}, socket) do
    try do
      tree = socket.assigns.tree
      user = User
        |> Repo.get_by(email: email)

      changeset = user
      |> build_assoc(:user_tree)
      |> user_tree_changeset(%{tree_id: tree.id})

      case Repo.insert(changeset) do
        {:ok, _tree_user} ->
          broadcast! socket, "member:added", %{user: user}

          ImconWeb.Endpoint.broadcast_from! self(), "user:#{user.id}", "tree:add", %{tree: tree}

          {:noreply, socket}
        {:error, _changeset} ->
          {:reply, {:error, %{error: "Error adding new member"}}, socket}
      end
    catch
      _, _-> {:reply, {:error, %{error: "User does not exist"}}, socket}
    end
  end

  def handle_in("leaflet:update", %{"leaflet" => leaflet_params}, socket) do
    leaflet = socket.assigns.tree
      |> assoc(:leaflet)
      |> Repo.get!(leaflet_params["id"])

    changeset = leaflet_update_changeset(leaflet, leaflet_params)

    case Repo.update(changeset) do
      {:ok, leaflet} ->
        tree = get_current_tree(socket)

        leaflet = Leaflet
        |> leaflet_preload_all
        |> Repo.get(leaflet.id)

        broadcast! socket, "leaflet:updated", %{tree: tree, leaflet: leaflet}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error updating leaflet"}}, socket}
    end
  end

  def handle_in("branch:update", %{"branch" => branch_params}, socket) do
    branch = socket.assigns.tree
      |> assoc(:branch)
      |> Repo.get!(branch_params["id"])

    changeset = branch_update_changeset(branch, branch_params)

    case Repo.update(changeset) do
      {:ok, _branch} ->
        tree = get_current_tree(socket)
        broadcast! socket, "branch:updated", %{tree: tree}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error updating branch"}}, socket}
    end
  end

  def handle_in("leaflet:add_comment", %{"leaflet_id" => leaflet_id, "text" => text}, socket) do
    current_user = socket.assigns.current_user

    comment = socket.assigns.tree
      |> assoc(:leaflet)
      |> Repo.get!(leaflet_id)
      |> build_assoc(:comment)

    changeset = comment_changeset(comment, %{text: text, user_id: current_user.id})

    case Repo.insert(changeset) do
      {:ok, _comment} ->
        leaflet = Leaflet
        |> leaflet_preload_all
        |> Repo.get(leaflet_id)

        broadcast! socket, "comment:created", %{tree: get_current_tree(socket), leaflet: leaflet}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating comment"}}, socket}
    end
  end

  def handle_in("leaflet:add_member", %{"leaflet_id" => leaflet_id, "user_id" => user_id}, socket) do
    try do
      current_tree = socket.assigns.tree

      leaflet_member = current_tree
        |> assoc(:leaflet)
        |> Repo.get!(leaflet_id)
        |> build_assoc(:leaflet_member)

      user_tree = UserTree
        |> find_by_user_and_tree(user_id, current_tree.id)
        |> Repo.one!()

      changeset = leaflet_member_changeset(leaflet_member, %{user_tree_id: user_tree.id})

      case Repo.insert(changeset) do
        {:ok, _} ->
          leaflet = Leaflet
          |> leaflet_preload_all
          |> Repo.get(leaflet_id)

          broadcast! socket, "leaflet:updated", %{tree: get_current_tree(socket), leaflet: leaflet}
          {:noreply, socket}
        {:error, _} ->
          {:reply, {:error, %{error: "Error adding new member"}}, socket}
      end
    catch
      _, _-> {:reply, {:error, %{error: "Member does not exist"}}, socket}
    end
  end

  def handle_in("leaflet:remove_member", %{"leaflet_id" => leaflet_id, "user_id" => user_id}, socket) do
    current_tree = socket.assigns.tree

    user_tree = UserTree
      |> find_by_user_and_tree(user_id, current_tree.id)
      |> Repo.one!

    leaflet_member = LeafletMember
      |> get_by_leaflet_and_user_tree(leaflet_id, user_tree.id)
      |> Repo.one!

    case Repo.delete(leaflet_member) do
      {:ok, _} ->
        leaflet = Leaflet
        |> leaflet_preload_all
        |> Repo.get(leaflet_id)

        broadcast! socket, "leaflet:updated", %{tree: get_current_tree(socket), leaflet: leaflet}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating comment"}}, socket}
    end
  end

  def terminate(_reason, socket) do
    tree_id = slug_id(socket.assigns.tree)
    user_id = socket.assigns.current_user.id

    broadcast! socket, "user:left", %{user: Monitor.user_left(tree_id, user_id)}

    :ok
  end

  defp get_current_tree(socket, tree_id) do
    socket.assigns.current_user
    |> assoc(:tree)
    |> tree_preload_all
    |> Repo.get(tree_id)
  end

  defp get_current_tree(socket), do: get_current_tree(socket, socket.assigns.tree.id)
end
