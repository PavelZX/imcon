defmodule Imcon.Repo.Migrations.CreateUserTree do
  use Ecto.Migration

  def change do
    create table(:user_tree) do
      add :user_id, references(:user, on_delete: :delete_all), null: false
      add :tree_id, references(:tree, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:user_tree, [:user_id])
    create index(:user_tree, [:tree_id])
    create unique_index(:user_tree, [:user_id, :tree_id])
  end
end
