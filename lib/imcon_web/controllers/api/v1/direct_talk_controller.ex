defmodule ImconWeb.DirectTalkController do
  use ImconWeb, :controller

  alias ImconWeb.{TalkUserService, DirectTalkView, EventChannel}
  alias Imcon.Auth.User

  def index(conn, _params) do
    {talks, talk_user} = TalkUserService.direct_talk_user(conn.assigns.current_user)
    render(conn, "index.json", talks: talks, talk_user: talk_user)
  end

  def join(conn, %{"user_id" => user_id}) do
    other_user = Repo.get_by(User, id: user_id)
    current_user = conn.assigns.current_user
    case TalkUserService.join_direct_talk(current_user, other_user) do
      {:ok, talk, state} ->
        push_to_other_user(state, current_user, other_user, talk)
        conn
        |> put_status(:created)
        |> render("talk.json", talk: talk, joined: true, user_id: user_id)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end

  defp push_to_other_user(:new, current_user, other_user, talk) do
    result = DirectTalkView.render("talk.json", %{talk: talk, joined: false, user_id: current_user.id})
    EventChannel.push_out(other_user.id, "dm_created", result)
  end
  defp push_to_other_user(_, _, _, _)

end
