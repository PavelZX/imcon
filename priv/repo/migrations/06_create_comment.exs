defmodule Imcon.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comment) do
      add :text, :string, null: false
      add :user_id, references(:user, on_delete: :delete_all)
      add :leaflet_id, references(:leaflet, on_delete: :delete_all)

      timestamps()
    end
    
    create index(:comment, [:user_id])
    create index(:comment, [:leaflet_id])
  end
end
