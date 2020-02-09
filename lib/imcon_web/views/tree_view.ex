defmodule ImconWeb.TreeView do
  use ImconWeb, :view

  def render("index.json", %{owned_tree: owned_tree, invited_tree: invited_tree}) do
    %{owned_tree: owned_tree, invited_tree: invited_tree}
  end

  def render("show.json", %{tree: tree}) do
    %{
      id: tree |> Imcon.Thorn.slug_id,
      name: tree.name,
      user_id: tree.user_id
    }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      %{} |> Map.put(field, detail)
    end)

    %{
      errors: errors
    }
  end
end
