defmodule Imcon.Repo.Migrations.CreateUserReadMessage do
  use Ecto.Migration

  def change do
    create table(:user_read_message) do
      add :message_id, :integer
      add :latest_ts, :utc_datetime
      add :user_id, references(:user, on_delete: :nilify_all)
      add :talk_id, references(:talk, on_delete: :nilify_all)

      timestamps()
    end
    create unique_index(:user_read_message, [:user_id, :talk_id])

  end
end
