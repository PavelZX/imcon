import Ecto.Query, only: [from: 2]

alias Imcon.Chat.{Talk, Message, UserReadMessage}
alias Imcon.Repo

users = Repo.all Imcon.Auth.User

general = Repo.get_by! Talk, name: "general"
random = Repo.get_by! Talk, name: "random"

default_data = Enum.map users, fn(user) ->
  [{user.id, general.id, user.inserted_at},
   {user.id, random.id, user.inserted_at}]
end

join_data = Repo.all(from m in Message, group_by: [m.user_id, m.talk_id],
                            select: {m.user_id, m.talk_id, min(m.inserted_at)})
read_data = Repo.all(from m in Message, group_by: [m.user_id, m.talk_id],
                            select: {m.user_id, m.talk_id, max(m.inserted_at)})

join_data = [default_data, join_data] |> List.flatten |> Enum.uniq_by(fn {uid, cid, _} -> {uid, cid} end)
read_data = [read_data, default_data] |> List.flatten |> Enum.uniq_by(fn {uid, cid, _} -> {uid, cid} end)

Enum.each(join_data, fn {user_id, talk_id, inserted_at}->
  record = Repo.get_by(TalkUser, user_id: user_id, talk_id: talk_id)
  if !record, do: Repo.insert! %TalkUser{user_id: user_id, talk_id: talk_id, joined_at: inserted_at}
end)
Enum.each(read_data, fn {user_id, talk_id, inserted_at}->
  record = Repo.get_by(UserReadMessage, user_id: user_id, talk_id: talk_id)
  if !record, do: Repo.insert! %UserReadMessage{user_id: user_id, talk_id: talk_id, latest_ts: inserted_at}
end)
