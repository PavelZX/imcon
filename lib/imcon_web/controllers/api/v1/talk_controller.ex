defmodule ImconWeb.TalkController do
  use ImconWeb, :controller

  alias ImconWeb.{TalkView, TalkUserService, UnreadService, EventChannel, ChangesetView}
  alias Imcon.Chat
  alias Imcon.Chat.Talk

  plug :scrub_params, "talk" when action in [:create, :update]

  def index(conn, _params) do

    talks = Repo.all(Chat.public)

    joined_status = TalkUserService.joined_talk_status(Guardian.Plug.current_resource(conn))
    render(conn, "index.json", talks: talks, joined_status: joined_status)
  end

  def create(conn, %{"talk" => talk_params}) do

    case TalkUserService.insert_talk(talk_params, Guardian.Plug.current_resource(conn)) do
      {:ok, talk} ->
        payload = TalkView.render("show.json", talk: talk, joined: false)
        notify_talk_created(payload)
        conn
        |> put_status(:created)
        |> json(Map.put(payload, :joined, true))
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end

  def read(conn, %{"talk_id" => talk_id, "ts" => ts}) do
    talk = Repo.get(Talk, talk_id)

    case UnreadService.mark_read(Guardian.Plug.current_resource(conn), talk, ts) do
      {:ok, _struct} ->
        conn
        |> put_status(:ok)
        |> json(%{})
      {:error, message} ->
        conn
        |> put_status(:bad_request)
        |> json(%{message: message})
    end
  end

  defp notify_talk_created(payload) do
    EventChannel.push_out("talk_created", payload)
  end
end
