defmodule Imcon.Thorn.Leaflet do

  use Ecto.Schema
  alias Imcon.Thorn.{Branch, Comment, LeafletMember}

  @derive {Poison.Encoder, only: [:id, :branch_id, :name, :description, :position, :comment, :tag, :member]}

  schema "leaflet" do
    field :name, :string
    field :description, :string
    field :position, :integer
    field :tag, {:array, :string}

    belongs_to :branch, Branch
    has_many :comment, Comment
    has_many :leaflet_member, LeafletMember
    has_many :member, through: [:leaflet_member, :user]

    timestamps()
  end

end
