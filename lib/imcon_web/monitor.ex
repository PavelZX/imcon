defmodule ImconWeb.Monitor do
  @moduledoc """
  tree monitor that keeps track of connected users.
  """

  use GenServer

  #####
  # External API

  def create(tree_id) do
    case GenServer.whereis(ref(tree_id)) do
      nil ->
        Supervisor.start_child(ImconWeb.Supervisor, [tree_id])
      _tree ->
        {:error, :tree_already_exists}
    end
  end

  def start_link(tree_id) do
    GenServer.start_link(__MODULE__, [], name: ref(tree_id))
  end

  def user_joined(tree_id, un_user) do
   try_call tree_id, {:user_joined, un_user}
  end

  def user_in_tree(tree_id) do
   try_call tree_id, {:user_in_tree}
  end

  def user_left(tree_id, un_user) do
    try_call tree_id, {:user_left, un_user}
  end

  #####
  # GenServer implementation
  
  @impl true
  def init(monitor) do
    {:ok, monitor}
  end

  @impl true
  def handle_call({:user_joined, un_user}, _from, user) do
    user = [un_user] ++ user
      |> Enum.uniq

    {:reply, user, user}
  end

  @impl true
  def handle_call({:user_in_tree}, _from, user) do
    { :reply, user, user }
  end

  @impl true
  def handle_call({:user_left, un_user}, _from, user) do
    user = List.delete(user, un_user)
    { :reply, user, user }
  end

  defp ref(tree_id) do
    {:global, {:tree, tree_id}}
  end

  defp try_call(tree_id, call_function) do
    case GenServer.whereis(ref(tree_id)) do
      nil ->
        {:error, :invalid_tree}
      tree ->
        GenServer.call(tree, call_function)
    end
  end
end
