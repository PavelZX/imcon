defmodule Imcon.Chat.TalkUser do
  
  use Ecto.Schema

  schema "talk_user" do
    field :joined_at, :naive_datetime
    belongs_to :talk, Imcon.Chat.Talk
    belongs_to :user, Imcon.Auth.User

    timestamps()
  end

end
