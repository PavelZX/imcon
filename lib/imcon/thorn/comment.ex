defmodule Imcon.Thorn.Comment do

  use Ecto.Schema
  alias Imcon.Thorn.Leaflet
  alias Imcon.Auth.User

  @derive {Poison.Encoder, only: [:id, :user, :leaflet_id, :text, :inserted_at]}
  
  schema "comment" do
    field :text, :string

    belongs_to :user, User
    belongs_to :leaflet, Leaflet

    timestamps()
  end

end
