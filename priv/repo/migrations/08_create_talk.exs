defmodule Imcon.Repo.Migrations.CreateTalk do

  use Ecto.Migration

  def change do

    create table(:talk) do
      add :name, :string, null: false
      add :type, :integer

      timestamps()

    end

    create unique_index(:talk, [:name])

  end
end
