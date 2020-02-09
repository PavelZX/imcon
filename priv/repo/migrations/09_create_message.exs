defmodule Imcon.Repo.Migrations.CreateMessage do
  use Ecto.Migration

  def change do
    create table(:message) do
      add :text, :text, null: false
      add :talk_id, references(:talk), null: false
      add :user_id, references(:user), null: false

      timestamps()
    end
    create index(:message, [:talk_id, :user_id])

  end
end
