defmodule ImconWeb.LeafletView do
  use ImconWeb, :view

  def render("show.json", %{leaflet: leaflet}) do
    leaflet
  end
end
