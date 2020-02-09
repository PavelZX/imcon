defmodule Imcon.Thorn do
  @moduledoc """
  The boundary for the Thorn system.
  """
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  alias Imcon.Repo
  alias Imcon.Thorn.{UserTree, Tree, Leaflet, LeafletMember, Comment, Branch}

  # ... UserTree
  
  @required_fields ~w(user_id tree_id)
  @optional_fields ~w()

  def user_tree_changeset(user_tree, attrs \\ %{}) do
    user_tree
    |> cast(attrs, @required_fields, @optional_fields)
    |> unique_constraint(:user_id, name: :user_tree_user_id_tree_id_index)
  end

  def find_by_user_and_tree(query \\ %UserTree{}, user_id, tree_id) do
    from u in query,
    where: u.user_id == ^user_id and u.tree_id == ^tree_id
  end

  # ... Tree
  
  @required_fields ~w(name user_id)
  @optional_fields ~w(slug)

  def tree_changeset(%Tree{} = tree, attrs) do
    tree
    |> cast(attrs, @required_fields, @optional_fields)
    |> slugify_name()
  end

  def not_owned_by(query \\ %Tree{}, user_id) do
    from b in query,
    where: b.user_id != ^user_id
  end

  def tree_preload_all(query) do
    comment_query = from c in Comment, order_by: [desc: c.inserted_at], preload: :user
    leaflet_query = from c in Leaflet, order_by: c.position, preload: [[comment: ^comment_query], :member]
    branch_query = from l in Branch, order_by: l.position, preload: [leaflet: ^leaflet_query]

    from b in query, preload: [:user, :member, branch: ^branch_query]
  end

  def slug_id(tree) do
    "#{tree.id}-#{tree.slug}"
  end

  defp slugify_name(current_changeset) do
    if name = get_change(current_changeset, :name) do
      put_change(current_changeset, :slug, slugify(name))
    else
      current_changeset
    end
  end

  defp slugify(value) do
    value
    |> String.downcase()
    |> String.replace(~r/[^\w-]+/u, "-")
  end

  # ... Leaflet

  @required_fields ~w(name branch_id)
  @optional_fields ~w(description position tag)
  
  def leaflet_changeset(%Leaflet{} = leaflet, attrs) do
    leaflet
    |> cast(attrs, @required_fields, @optional_fields)
    |> leaflet_calculate_position()
  end

  def leaflet_update_changeset(leaflet, attrs \\ %{}) do
    leaflet
    |> cast(attrs, @required_fields, @optional_fields)
  end

  defp leaflet_calculate_position(current_changeset) do
    leaflet = current_changeset.data

    query = from(c in Leaflet,
            select: c.position,
            where: c.branch_id == ^(leaflet.branch_id),
            order_by: [desc: c.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end

  def leaflet_preload_all(query \\ %Leaflet{}) do
    comment_query = from c in Comment, order_by: [desc: c.inserted_at], preload: :user

    from c in query, preload: [:member, [comment: ^comment_query]]
  end

  def get_by_user_and_tree(query \\ %Leaflet{}, leaflet_id, user_id, tree_id) do
    from c in query,
      left_join: co in assoc(c, :comment),
      left_join: cu in assoc(co, :user),
      left_join: me in assoc(c, :member),
      join: l in assoc(c, :branch),
      join: b in assoc(l, :tree),
      join: ub in assoc(b, :user_tree),
      where: ub.user_id == ^user_id and b.id == ^tree_id and c.id == ^leaflet_id,
      preload: [comment: {co, user: cu }, member: me]
  end

  # ... LeafletMember
  
  @required_fields ~w(leaflet_id user_tree_id)
  @optional_fields ~w()

  def leaflet_member_changeset(%LeafletMember{} = leaflet_member, attrs) do
    leaflet_member
    |> cast(attrs, @required_fields, @optional_fields)
    |> unique_constraint(:user_tree_id, name: :leaflet_member_leaflet_id_user_tree_id_index)
  end

  def get_by_leaflet_and_user_tree(query \\ %LeafletMember{}, leaflet_id, user_tree_id) do
    from cm in query,
    where: cm.leaflet_id == ^leaflet_id and cm.user_tree_id == ^user_tree_id,
    limit: 1
  end

  # ... Comment

  @required_fields ~w(user_id leaflet_id text)
  @optional_fields ~w()

  def comment_changeset(comment, attrs \\ %{}) do
    comment
    |> cast(attrs, @required_fields, @optional_fields)
  end

  # ... Branch
  
  @required_fields ~w(name)
  @optional_fields ~w(position)

  def branch_changeset(%Branch{} = branch, attrs) do
    branch
    |> cast(attrs, @required_fields, @optional_fields)
    |> branch_calculate_position()
  end

  def branch_update_changeset(%Branch{} = branch, attrs) do
    branch
    |> cast(attrs, @required_fields, @optional_fields)
  end

  defp branch_calculate_position(current_changeset) do
    branch = current_changeset.data

    query = from(l in Branch,
            select: l.position,
            where: l.tree_id == ^(branch.tree_id),
            order_by: [desc: l.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end

end

defimpl Phoenix.Param, for: Imcon.Thorn do
  def to_param(%{slug: slug, id: id}) do
    "#{id}-#{slug}"
  end
end

defimpl Poison.Encoder, for: Any do
  def encode(%{__struct__: _} = struct, options) do
    map = struct
          |> Map.from_struct
          |> san_map
    Poison.Encoder.Map.encode(map, options)
  end

  defp san_map(map) do
    Map.drop(map, [:__meta__, :__struct__])
  end
end

defimpl Poison.Encoder, for: Imcon.Thorn.Tree do
  def encode(tree, options) do
    tree
    |> Map.take([:name, :branch, :user, :member,])
    |> Map.put(:id, Imcon.Thorn.slug_id(tree))
    |> Poison.Encoder.encode(options)
  end
end