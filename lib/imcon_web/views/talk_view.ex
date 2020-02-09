defmodule ImconWeb.TalkView do
  use ImconWeb, :view

  def render("index.json", %{talks: talks, joined_status: joined_status}) do
    Enum.map(talks, fn talk ->
      render(__MODULE__, "talk.json", talk: talk, joined: joined_status[talk.id])
    end)
  end

  def render("show.json", %{talk: talk, joined: joined}) do
    render(__MODULE__, "talk.json", talk: talk, joined: joined)
  end

  def render("talk.json", %{talk: talk, joined: joined}) do
    %{id: talk.id,
      name: talk.name,
      joined: !!joined}
  end
end
