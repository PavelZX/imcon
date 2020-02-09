defmodule ImconWeb.BranchChannel do
  use ImconWeb, :channel

  #def join("branch::" <> branch_id, _params, socket) do
  #    {:ok, socket}
  #  else
  #    {:error, %{reason: "unauthorized"}}
  #end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  #def handle_in("ping", payload, socket) do
  #  {:reply, {:ok, payload}, socket}
  #end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (branch:lobby).
  #def handle_in("shout", payload, socket) do
  #  broadcast socket, "shout", payload
  #  {:noreply, socket}
  #end

  # Add authorization logic here as required.
  #defp authorized?(_payload) do
  #  true
  #end
end
