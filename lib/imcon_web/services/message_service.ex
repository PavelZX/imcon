defmodule ImconWeb.MessageService do
  use ImconWeb, :service

  @default_history_count 100

  def load_messages(talk, max_ts, count \\ @default_history_count) do
    talk
      |> Imcon.Chat.message_before(max_ts, count + 1)
      |> Repo.all
      |> Enum.reverse
  end
end
