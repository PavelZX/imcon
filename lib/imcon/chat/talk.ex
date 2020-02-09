defmodule Imcon.Chat.Talk do

  use Ecto.Schema

  schema "talk" do
    field :name, :string
    field :type, :integer
    has_many :message, Imcon.Chat.Message
    many_to_many :user, Imcon.Auth.User, join_through: Imcon.Chat.TalkUser

    timestamps usec: true
  end

end
