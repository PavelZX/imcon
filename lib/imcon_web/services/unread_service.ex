defmodule ImconWeb.UnreadService do
  use ImconWeb, :service

  alias Imcon.Time
  alias Imcon.Chat
  alias Imcon.Chat.{UserReadMessage, Message}

  def unread_count(user, talk) do
    latest_read_time = fetch_latest_time(user, talk)
    if latest_read_time do
      Chat.message_count_after(talk, latest_read_time) |> Repo.one
    else
      # to prevent no UserReadMessage created for user and talk
      0
    end
  end

  defp fetch_latest_time(user, talk) do
    struct = Chat.latest_ts_of(user, talk) |> Repo.one
    if struct, do: struct.latest_ts
  end

  def mark_read(user, talk, ts) do
    time = Time.to_datetime(ts)
    message = Repo.one(from Message, where: [inserted_at: ^time])

    read_message = case Repo.get_by(UserReadMessage, user_id: user.id, talk_id: talk.id) do
      nil -> %UserReadMessage{user_id: user.id, talk_id: talk.id}
      user_read_message -> user_read_message
    end
    if !read_message.id || ts > Time.to_timestamp(read_message.latest_ts) do
      read_message
      |> Chat.user_read_changeset(%{latest_ts: time, message_id: message.id})
      |> Repo.insert_or_update
    else
      {:error, "Вы прочитали сообщение"}
    end
  end

end
