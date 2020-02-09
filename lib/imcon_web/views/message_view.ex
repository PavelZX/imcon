defmodule ImconWeb.MessageView do
  use ImconWeb, :view

  # should use `count + 1` to get messages, length of messages and count will
  # be compared to get `has_more`
  def render("index.json", %{messages: messages, count: count}) do
    %{has_more: length(messages) > count,
      messages: render_many(Enum.take(messages, count), ImconWeb.MessageView, "message.json")}
  end

  def render(type = "message.json", %{message: message}) do
    build(type, message, user: message.user)
  end

  def build("message.json", message, user: user) do
    %{text: message.text,
      talk_id: message.talk_id,
      ts: Imcon.Chat.ts(message),
      user: %{
        id: user.id,
        username: Imcon.Auth.username(user),
        email: user.email
      }
    }
  end
end
