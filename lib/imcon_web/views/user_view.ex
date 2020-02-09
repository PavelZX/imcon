defmodule ImconWeb.UserView do
  use ImconWeb, :view

  def render("index.json", %{user: user}) do
    Enum.map(user, fn user ->
      render(__MODULE__, "user.json", user: user)
    end)
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      username: Imcon.Auth.username(user),
      email: user.email}
  end
end
