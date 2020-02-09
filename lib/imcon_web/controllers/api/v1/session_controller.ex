defmodule ImconWeb.SessionController do
  use ImconWeb, :controller

  alias ImconWeb.Guardian
  alias Imcon.Auth
  
  action_fallback ImconWeb.FallbackController

  def create(conn, %{"session" => session_params}) do
    case Imcon.Auth.authenticate_user(session_params) do
      {:ok, user} ->
        {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> render("show.json", jwt: jwt, user: user)

      :error ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def delete(conn, _) do

    conn
    |> Auth.logout()
    |> render("delete.json")
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(ImconWeb.SessionView, "forbidden.json", error: "Not Authenticated")
  end
end
