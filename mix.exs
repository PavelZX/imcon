defmodule Imcon.Mixfile do
  use Mix.Project

  def project do
    [
      app: :imcon,
      version: "0.1.1",
      elixir: "~> 1.7",
      elixirc_paths: elixirc_paths(Mix.env),
      compilers: [:phoenix, :gettext] ++ Mix.compilers,
      start_permanent: Mix.env == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Imcon.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_),     do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.4.12"},
      {:phoenix_pubsub, "~> 1.1.2"},
      {:phoenix_ecto, "~> 4.1.0"},
      {:ecto, ">= 3.3.2"},
      {:ecto_sql, "~> 3.3.3"},
      {:postgrex, ">= 0.0.0"},
      {:poison, "~> 4.0.1"},
      {:phoenix_html, "~> 2.14.0"},
      {:phoenix_live_reload, "~> 1.2.1", only: :dev},
      {:gettext, "~> 0.17.4"},
      {:cowboy, "~> 2.7.0"},
      {:plug_cowboy, "~> 2.1.2"},
      {:comeonin, "~> 5.2.0"},
      {:bcrypt_elixir, "~> 2.1.0"},
      {:credo, "~> 1.2.2", only: [:dev, :test]},
      {:ex_machina, "~> 2.3.0"},
      {:exactor, "~> 2.2.4"},
      {:jason, "~> 1.1.2"},
      {:hound, "~> 1.1.0"},
      {:mix_test_watch, "~> 1.0.2", only: :dev},
      {:poolboy, "~> 1.5.2"},
      {:guardian, "~> 2.0.0"},
      {:guardian_phoenix, "~> 2.0.1"},
      {:argon2_elixir, "~> 2.2.1"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
    ]
  end
end
