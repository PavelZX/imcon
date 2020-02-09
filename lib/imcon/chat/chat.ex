defmodule Imcon.Chat do
  @moduledoc """
  The boundary for the Chat system.
  """
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  alias Imcon.Chat.{Message, Talk}
  alias Imcon.Time, as: Extime

  # UserReadMessage
  
  @required_fields ~w(latest_ts talk_id user_id)a
  @optional_fields ~w(message_id)a
  @allowed_fields Enum.concat([@required_fields, @optional_fields])

  def user_read_changeset(user_read, params \\ %{}) do
    user_read
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
  end

  def latest_ts_of(user, talk) do
    from Talk, where: [user_id: ^user.id, talk_id: ^talk.id], select: [:latest_ts]
  end

  # TalkUser
  
  @u_allowed_fields ~w(joined_at talk_id user_id)a
  @u_required_fields ~w(talk_id user_id)a

  def talk_user_changeset(talk_user, params \\ %{}) do
    talk_user
    |> cast(params, @u_allowed_fields)
    |> validate_required(@u_required_fields)
  end

  # Talk
  
  @type_public 1
  @type_direct 2

  @ch_allowed_fields ~w(name type)a

  def public_changeset(talk, params \\ %{}) do
    changeset(talk, params)
    |> put_change(:type, @type_public)
    |> validate_required([:type])
    |> validate_format(:name, ~r/\A[\w\-]+\z/)
  end

  def direct_changeset(talk, params \\ %{}) do
    changeset(talk, params)
    |> put_change(:type, @type_direct)
    |> validate_required([:type])
  end

  defp changeset(talk, params) do
    talk
    |> cast(params, @ch_allowed_fields)
    |> validate_required([:name])
    |> unique_constraint(:name)
  end

  def public(query \\ Talk) do
    from query, where: [type: @type_public]
  end

  def direct(query \\ Talk) do
    from query, where: [type: @type_direct]
  end

  # Message
  
  @m_required_fields ~w(text talk_id user_id)a
  @m_allowed_fields @m_required_fields

  def message_changeset(message, params \\ %{}) do
    message
    |> cast(params, @m_allowed_fields)
    |> validate_required(@m_required_fields)
  end

  def ts(message) do
    message.inserted_at |> Extime.to_timestamp
  end

  def message_before(talk, ts, limit \\ 100)
  def message_before(talk, ts, limit) when is_number(ts) do
    time = Extime.to_datetime(ts)
    message_before(talk, time, limit)
  end
  def message_before(talk, time, limit) do
    from m in Message,
      where: m.talk_id == ^talk.id and m.inserted_at < ^time,
      limit: ^limit,
      order_by: [desc: m.inserted_at]
  end

  def message_count_after(talk, ts) when is_number(ts) do
    time = Extime.to_datetime(ts)
    message_count_after(talk, time)
  end
  def message_count_after(talk, time) do
    from m in Message,
      where: m.talk_id == ^talk.id and m.inserted_at > ^time,
      select: count(m.id)
  end

  # User
  def direct_name(user_id1, user_id2) do
    [user_id1, user_id2] |> Enum.sort |> Enum.join(",")
  end

  def direct_user_ids(talk) do
    case talk.type do
      @type_direct -> talk.name |> String.split(",") |> Enum.map(&String.to_integer/1)
      _            -> raise ArgumentError, message: "#{inspect talk} is not a direct talk!"
    end
  end

  def opposite_direct_user_id(talk, user_id) when is_integer(user_id) do
    talk
      |> direct_user_ids
      |> List.delete(user_id)
      |> List.first
  end

  def is_direct?(talk) do
    talk.type == @type_direct
  end

end