defmodule Imcon.Thorn.Branch do

  use Ecto.Schema
  alias Imcon.Thorn.{Leaflet, Tree}

  @derive {Poison.Encoder, only: [:id, :tree_id, :name, :position, :leaflet]}

  schema "branch" do
    field :name, :string
    field :position, :integer

    belongs_to :tree, Tree
    has_many :leaflet, Leaflet

    timestamps()
  end
end
