defmodule Imcon.Thorn.LeafletMember do

  use Ecto.Schema
  alias Imcon.Thorn.{Leaflet, UserTree}

  schema "leaflet_member" do
    belongs_to :leaflet, Leaflet
    belongs_to :user_tree, UserTree
    has_one :user, through: [:user_tree, :user]

    timestamps()
  end

end
