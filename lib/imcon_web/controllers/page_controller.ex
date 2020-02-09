defmodule ImconWeb.PageController do
  use ImconWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
