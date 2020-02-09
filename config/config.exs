# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :imcon,
  ecto_repos: [Imcon.Repo]

# config :phoenix, :json_library, Jason

config :imcon, ImconWeb.Guardian,
  issuer: "imcon",
  secret_key: "secret"

# Configures the endpoint
config :imcon, ImconWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "JUrqE7u4C3cSDZD8xwBv9uRfkigIQqeerlwJXUEpl0dc33U2EVlWd7FmbeM8KiQJ",
  render_errors: [view: ImconWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ImconWeb.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Start Hound for PhantomJs
config :hound, driver: "chrome_driver"

config :mime, :types, %{
      "application/json" => ["json"],
      "application/xml" => ["xml"]
    }
