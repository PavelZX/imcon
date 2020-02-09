defmodule ImconWeb.CurrentUserController do
  use ImconWeb, :controller

  action_fallback ImconWeb.FallbackController

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)
  end
end
