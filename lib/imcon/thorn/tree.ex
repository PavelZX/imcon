defmodule Imcon.Thorn.Tree do

  use Ecto.Schema
  alias Imcon.Thorn.{Branch, UserTree}
  alias Imcon.Auth.User

  @primary_key {:id, ImconWeb.Permalink, autogenerate: true}

  schema "tree" do
    field :name, :string, null: false
    field :slug, :string, null: false

    belongs_to :user, User
    has_many :branch, Branch
    has_many :leaflet, through: [:branch, :leaflet]
    has_many :user_tree, UserTree
    has_many :member, through: [:user_tree, :user]

    timestamps()
  end
end
