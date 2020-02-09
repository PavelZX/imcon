defmodule ImconWeb.MessageController do
  use ImconWeb, :controller

  @default_history_count 100

  def index(conn, params = %{"talk_id" => talk_id}) do
    talk = Repo.get_by Imcon.Chat.Talk, id: talk_id
    messages = ImconWeb.MessageService.load_messages(talk, params["ts"] || Imcon.Time.now_ts) |> Repo.preload(:user)

    render(conn, "index.json", messages: messages, count: @default_history_count)
  end
end
