# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Imcon.Repo.insert!(%Imcon.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Imcon.{Auth, Repo}

Repo.insert!(Auth.create_user(%Auth.User{}, %{
    first_name: "John",
    last_name: "Doe",
    email: "john@caix.ru",
    role: "admin",
    password: "12345678"
}))
