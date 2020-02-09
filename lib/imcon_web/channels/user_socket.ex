defmodule ImconWeb.UserSocket do
  use Phoenix.Socket

  alias ImconWeb.{BranchChannel, TreeChannel, UserChannel, MessageChannel, EventChannel}
  
  # Channels
  channel "tree:*", TreeChannel
  channel "user:*", UserChannel
  channel "dialog:*", MessageChannel
  channel "event:*", EventChannel
  channel "branch:*", BranchChannel

  def connect(%{"token" => token}, socket) do
    case Guardian.Phoenix.Socket.authenticate(socket, ImconWeb.Guardian, token) do
      {:ok, authed_socket} ->
        {:ok, authed_socket}

      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, _socket), do: :error

  def id(socket), do: "user_socket:#{Guardian.Phoenix.Socket.current_resource(socket).id}"
end
