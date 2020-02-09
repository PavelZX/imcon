defmodule Imcon.Repo.Migrations.CreateLeaflet do
  use Ecto.Migration

  def change do
    create table(:leaflet) do
      add :name, :string, null: false
      add :position, :integer, default: 0
      add :branch_id, references(:branch, on_delete: :delete_all), null: false
      add :description, :text
      add :tag, {:array, :string}, default: []

      timestamps()
    end

    create index(:leaflet, [:branch_id])
    create index(:leaflet, [:tag])
  end
end
