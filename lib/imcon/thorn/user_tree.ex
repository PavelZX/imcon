defmodule Imcon.Thorn.UserTree do

  use Ecto.Schema
  alias Imcon.Thorn.Tree
  alias Imcon.Auth.User

  schema "user_tree" do
    belongs_to :user, User
    belongs_to :tree, Tree

    timestamps()
  end
  
end
