defmodule ImconWeb.LeafletController do
  use ImconWeb, :controller

  action_fallback ImconWeb.FallbackController

  def show(conn, %{"tree_id" => tree_id, "id" => leaflet_id}) do
    leaflet = Imcon.Thorn.Leaflet
        
     |> Imcon.Thorn.get_by_user_and_tree(leaflet_id, Guardian.Plug.current_resource(conn), tree_id)
     |> Imcon.Repo.one!

    render(conn, "show.json", leaflet: leaflet)
  end
end
