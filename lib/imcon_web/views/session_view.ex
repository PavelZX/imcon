defmodule ImconWeb.SessionView do
  use ImconWeb, :view
  
  def render("create.json", %{token: token}) do
    %{token: token}
  end

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: user
    }
  end

  def render("error.json", _) do
    %{error: "Неверный email или пароль!"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end

end
