defmodule ImconWeb.MessageChannel do
  use ImconWeb, :channel
  
  alias Imcon.Chat
  alias Imcon.Chat.{Message, Talk}
  alias ImconWeb.{MessageService, MessageView, UnreadService, EventChannel, TalkUserService}

  @default_history_count 100

  # TODO: Authorization should be added, users can only join some talks
  def join("dialog:" <> _dialog_id, _auth_msg, socket) do
    talk = talk_from_topic(socket.topic)
    messages = MessageService.load_messages(talk, Extime.now_ts) |> Repo.preload(:user)
    unread_count = UnreadService.unread_count(socket.assigns.user, talk)

    resp = MessageView.render("index.json", %{messages: messages, count: @default_history_count})
            |> Map.put(:unread_count, unread_count)

    {:ok, resp, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "Unauthorized!"}}
  end

  def handle_in(event, params, socket) do
    user = socket.assigns.user
    if user do
      handle_in(event, params, user, socket)
    else
      {:reply, :error, socket}
    end
  end
  def handle_in("new_message", %{"text" => _text} = params, user, socket) do
    talk = talk_from_topic(socket.topic)
    if talk do
      changeset = Chat.message_changeset(%Message{}, message_params(params, talk, user))
      case Repo.insert(changeset) do
        {:ok, message} ->
          data = MessageView.build("message.json", message, user: user)
          notify_dm_open(user, talk)
          broadcast! socket, "new_message", data
          {:reply, :ok, socket}
        {:error, _changeset} ->
          {:reply, :error, socket}
      end
    else
      {:reply, :error, socket}
    end
  end

  defp talk_from_topic(topic) do
    talk_id = String.replace(topic, ~r/.*:#?/, "")
    Repo.get_by Talk, id: talk_id
  end

  defp message_params(%{"text" => text}, talk, user) do
    Map.merge(%{text: text}, %{talk_id: talk.id, user_id: user.id})
  end

  defp notify_dm_open(user, talk) do
    if Chat.is_direct?(talk) do
      talk_user = ensure_opposite_user_joined(user, talk)
      if Extime.now_ts - Extime.to_timestamp(talk_user.joined_at) < 1 do
        EventChannel.push_out(talk_user.user_id, "dm_open", %{talk_id: talk.id})
      end
    end
  end

  defp ensure_opposite_user_joined(user, talk) do
    opposite_id = Chat.opposite_direct_user_id(talk, user.id)
    {:ok, talk_user} = TalkUserService.rejoin_talk(opposite_id, talk)
    talk_user
  end

end
