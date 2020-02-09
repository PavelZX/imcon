defmodule Imcon.Repo.Migrations.CreateBranch do
  use Ecto.Migration

  def change do
    create table(:branch) do
      add :name, :string, null: false
      add :position, :integer, defaul: 0
      add :tree_id, references(:tree, on_delete: :delete_all)

      timestamps()
    end

    create index(:branch, [:tree_id])
  end
end
