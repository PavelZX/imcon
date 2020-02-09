defmodule Imcon.Repo.Migrations.CreateTalkUser do
  use Ecto.Migration

  def change do
    create table(:talk_user) do
      add :joined_at, :utc_datetime
      add :talk_id, references(:talk, on_delete: :nilify_all)
      add :user_id, references(:user, on_delete: :nilify_all)

      timestamps()
    end

    create index(:talk_user, [:talk_id, :user_id], unique: true)

  end
end
