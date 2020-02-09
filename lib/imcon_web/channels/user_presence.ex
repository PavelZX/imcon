defmodule ImconWeb.UserPresence do
  use Phoenix.Presence, otp_app: :imcon,
                        pubsub_server: ImconWeb.PubSub
end
