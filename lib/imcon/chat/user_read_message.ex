defmodule Imcon.Chat.UserReadMessage do

  use Ecto.Schema

  schema "user_read_message" do
    field :message_id, :integer
    field :latest_ts, :naive_datetime
    belongs_to :user, Imcon.Auth.User
    belongs_to :talk, Imcon.Chat.Talk

    timestamps()

  end

end
