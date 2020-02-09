defmodule ImconWeb.UserController do
  use ImconWeb, :controller

  alias ImconWeb.{ChangesetView, Guardian, TalkUserService, SessionView, UserView, EventChannel}
  alias Imcon.Auth.User

  action_fallback(ImconWeb.FallbackController)

  def create(conn, params = %{"email" => _, "password" => _}) do
    
    changeset = Imcon.Auth.login(conn, params)
    case Repo.insert(changeset) do
      {:ok, user} ->
         {:ok, _full_claims} = Guardian.encode_and_sign(user)

        notify_user_created(user)
        TalkUserService.join_default_talk(user)

        render(conn, SessionView, :create, token: conn.assigns[:auth_token])
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end

  def index(conn, %{}) do
    current_id = conn.assigns.current_user.id
    users = Repo.all(from u in User, where: u.id != ^current_id)
    render conn, "index.json", users: users
  end

  defp notify_user_created(user) do
    payload = UserView.render "user.json", user: user
    EventChannel.push_out "user_created", payload
  end

  def show(conn, %{"tree_id" => tree_id, "id" => leaflet_id}) do
    leaflet = Imcon.Thorn.Leaflet
     |> Imcon.Thorn.get_by_user_and_tree(leaflet_id, current_user(conn).id, tree_id)
     |> Imcon.Repo.one!

    render(conn, "show.json", leaflet: leaflet)
  end

  defp current_user(conn)  do
    Guardian.Plug.current_resource(conn)
  end

end
