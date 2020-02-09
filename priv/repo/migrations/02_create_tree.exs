defmodule Imcon.Repo.Migrations.CreateTree do
  use Ecto.Migration

  def change do
    create table(:tree) do
      add :name, :string, null: false
      add :slug, :string, null: false
      add :user_id, references(:user, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:tree, [:user_id])
  end
end
