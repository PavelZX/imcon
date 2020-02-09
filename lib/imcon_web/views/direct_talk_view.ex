defmodule ImconWeb.DirectTalkView do
  use ImconWeb, :view

  def render("index.json", %{talks: talks, talk_users: talk_users}) do
    indexed = Enum.reduce(talk_users, %{}, fn(cu, acc) -> Map.put(acc, cu.talk_id, cu) end)
    Enum.map(talks, fn talk ->
      talk_user = indexed[talk.id]
      other_id = Imcon.Chat.opposite_direct_user_id(talk, talk_user.user_id)
      render(__MODULE__, "talk.json", talk: talk, joined: talk_user.joined_at, user_id: other_id)
    end)
  end

  def render("talk.json", %{talk: talk, joined: joined, user_id: user_id}) do
    %{id: talk.id,
      name: talk.name,
      joined: !!joined,
      user_id: user_id}
  end
end
