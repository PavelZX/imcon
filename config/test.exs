use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :imcon, ImconWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :imcon, Imcon.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "pavelz",
  password: "bOOm757s#",
  database: "im_con",
  hostname: "82.146.44.66",
  pool: Ecto.Adapters.SQL.Sandbox
