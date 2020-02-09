defmodule ImconWeb.TalkUserService do
  use ImconWeb, :service

  alias Imcon.Time
  alias Imcon.Chat
  alias Imcon.Chat.{Talk, TalkUser, UserReadMessage}
  alias Imcon.Auth.User

  def insert_talk(params, user) do
    Repo.transaction(fn ->
      changeset = Chat.public_changeset(%Talk{}, params)
      case Repo.insert(changeset) do
        {:ok, talk} ->
          create_talk_user(talk, user)
          talk
        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end

  def joined_talk_status(user) do
    # TODO: only talk_user of joined talks are needed
    talk_user = Repo.all assoc(user, :talk_user)
    Enum.reduce(talk_user, %{}, fn(x, acc) -> Map.put(acc, x.talk_id, true) end)
  end

  def create_talk_user(talk, user, options \\ []) do
    joined_at = Keyword.get(options, :joined_at, Time.now_datetime)
    Repo.transaction(fn ->
      params = %{talk_id: talk.id, user_id: user.id}
      Repo.insert!(Chat.talk_user_changeset(%TalkUser{}, Map.put(params, :joined_at, joined_at)))
      # Use now datetime is OK, not necessary to use datetime of talk's latest message
      Repo.insert!(Chat.user_read_changeset(%UserReadMessage{}, Map.put(params, :latest_ts, Time.now_datetime)))
    end)
  end

  def join_default_talk(user) do
    names = Application.get_env(:imcon, Talk)[:default_talk]
    talks = Repo.all(from ch in Talk, where: ch.name in ^names)
    Enum.each talks, fn (talk) ->
      create_talk_user(talk, user)
    end
  end

  def rejoin_talk(%User{} = user, talk) do
    rejoin_talk(user.id, talk)
  end
  def rejoin_talk(user_id, talk) when is_integer(user_id) do
    talk_user = Repo.get_by TalkUser, user_id: user_id, talk_id: talk.id
    cond do
      talk_user && !talk_user.joined_at ->
        changeset = Ecto.Changeset.change(talk_user, joined_at: Time.now_datetime)
        Repo.update changeset
      talk_user && talk_user.joined_at ->
        {:ok, talk_user}
      !talk_user ->
        raise "Там нет никаких взаимоотношений #{inspect talk} user##{user_id}"
    end
  end

  def direct_talk_user(%User{id: user_id}) do
    result = Repo.all(from ch in Chat.direct, join: cu in TalkUser, on: ch.id == cu.talk_id,
                                        where: cu.user_id == ^user_id, select: {ch, cu})
    Enum.unzip(result)
  end

  def join_direct_talk(user, other_user) do
    name = Chat.direct_name(user.id, other_user.id)
    talk = Repo.get_by(Talk, name: name)
    # TODO: refactor
    if talk do
      case rejoin_talk(user, talk) do
        {:ok, _} -> {:ok, talk, :rejoin}
        other    -> other
      end
    else
      case create_direct_talk_for(user, other_user) do
        {:ok, talk} -> {:ok, talk, :new}
        other          -> other
      end
    end
  end

  def create_direct_talk_for(user, other_user) do
    talk_changeset = Chat.direct_changeset %Talk{}, %{name: Chat.direct_name(user.id, other_user.id)}
    Repo.transaction(fn ->
      talk = Repo.insert!(talk_changeset)
      create_talk_user(talk, user)
      create_talk_user(talk, other_user, joined_at: nil)
      talk
    end)
  end
end
