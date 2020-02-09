defmodule ImconWeb.TalkUserController do

  use ImconWeb, :controller

  def create(conn, %{"talk_id" => talk_id}) do
    talk = Repo.get_by!(Imcon.Chat.Talk, id: talk_id)
    case ImconWeb.TalkUserService.create_talk_user(talk, Guardian.Plug.current_resource(conn)) do
      {:ok, _} ->
        conn
        |> put_status(:ok)
        |> json(%{message: "You've joined the talk!"})
      {:error, _} ->
        conn
        |> put_status(:bad_request)
        |> json(%{message: "You can't join the talk!"})
    end
  end
end
