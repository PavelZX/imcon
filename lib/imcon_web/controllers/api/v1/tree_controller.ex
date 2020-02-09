defmodule ImconWeb.TreeController do
  use ImconWeb, :controller
  
  import Imcon.Thorn
  alias Imcon.Repo
  alias Imcon.Auth

  action_fallback ImconWeb.FallbackController

  def index(conn, _params) do

    current_user = Guardian.Plug.current_resource(conn)
    IO.inspect(current_user)
    owned_tree = current_user
      |> tree_preload_all
      |> assoc(:owned_tree)
      |> Repo.all

    invited_tree = current_user
      |> assoc(:tree)
      |> not_owned_by(owned_tree.id)
      |> tree_preload_all
      |> Repo.all

    render(conn, "index.json", owned_tree: owned_tree, invited_tree: invited_tree)
  end

  def create(conn, %{"tree" => tree_params}) do

    changeset = Guardian.Plug.current_resource(conn)
      |> build_assoc(:owned_tree)
      |> tree_changeset(tree_params)

    if changeset.valid? do
      tree = Repo.insert!(changeset)

      tree
      |> build_assoc(:user_tree)
      |> user_tree_changeset(%{user_id: changeset.id})
      |> Repo.insert!

      conn
      |> put_status(:created)
      |> render("show.json", tree: tree)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render("error.json", changeset: changeset)
    end
  end
end
