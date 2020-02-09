defmodule Imcon.Repo.Migrations.CreateLeafletMember do
  use Ecto.Migration

  def change do
    create table(:leaflet_member) do
      add :leaflet_id, references(:leaflet, on_delete: :delete_all), null: false
      add :user_tree_id, references(:user_tree, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:leaflet_member, [:leaflet_id])
    create index(:leaflet_member, [:user_tree_id])
    create unique_index(:leaflet_member, [:leaflet_id, :user_tree_id])
  end
end
