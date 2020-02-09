defmodule Imcon.Auth do

  import Ecto.Changeset
  import Ecto.Query, warn: false
  import Plug.Conn

  alias Argon2
  alias Imcon.Repo
  alias Imcon.Auth.User
  alias ImconWeb.Guardian

    # ... User

  @email ~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/

#  def get_user(id), do: Repo.get!(User, id)

  def get_user(id) do
    User
    |> Repo.get(id)
  end
  
  def email(%{email: email} = _user) do
    String.split(email, "@") |> List.first
  end

  def list_users do
    Repo.all(User)
  end

  def email_pass(conn, email, pass, opts) do
    repo = Keyword.fetch!(opts, :repo)
    user = repo.get_by(User, email: email)

    cond do
      user && Bcrypt.verify_pass(pass, user.encrypted_password) ->
        {:ok, user}
      user ->
        {:error, :unauthorized, conn}
      true ->
        Bcrypt.no_user_verify()
        {:error, :not_found, conn}
    end
  end

  def login(conn, user) do
    conn
    |> Guardian.Plug.sign_in(user)
    |> assign(:current_user, user)
    |> put_user_token(user)
  end

  def load_current_user(conn) do
    conn
    |> assign(:current_user, Guardian.Plug.current_resource(conn))
    |> put_user_token(Guardian.Plug.current_resource(conn))
  end

  defp put_user_token(conn, user) do
    token = Phoenix.Token.sign(conn, "user socket", user.id)

    conn
    |> assign(:user_token, token)
  end

  def logout(conn) do
    conn
    |> Guardian.Plug.sign_out()
  end

  def authenticate_user(%{"email" => email, "password" => password}) do
    query = from u in User, where: u.email == ^email
    case Repo.one(query) do
      nil ->
        Argon2.no_user_verify()
        {:error, :invalid_credentials}
      user ->
        if Argon2.verify_pass(password, user.password) do
          {:ok, user}
        else
          {:error, :invalid_credentials}
        end
    end
  end

  def authenticate(%{"email" => email, "password" => password}) do
    user = Repo.get_by(User, email: String.downcase(email))

    case check_password(user, password) do
      true -> {:ok, user}
      _ -> :error
    end
  end

  defp check_password(user, password) do
    case user do
      nil -> Bcrypt.no_user_verify()
      _ -> Bcrypt.verify_pass(password, user.encrypted_password)
    end
  end

  @required_fields ~w(first_name last_name email role password)a
  @optional_fields ~w(encrypted_password)a

  def create_user(user, attrs) do
    user
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_format(:email, @email)
    |> validate_length(:password, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end

  def changeset_role(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:role])
    |> validate_inclusion(:role, ~w(user admin))
  end

  def update_user(%User{} = user, attrs) do
    user
    |> cast(attrs, [:first_name, :last_name, :email], [:password])
    |> validate_required([:first_name, :email])
    |> generate_encrypted_password
    |> unique_constraint(:email)
  end

  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:email, :password])
    |> validate_required([:email, :password])
    |> put_password_hash()
  end

  defp put_password_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, password: Argon2.hash_pwd_salt(password))
  end

  defp put_password_hash(changeset), do: changeset

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Bcrypt.hash_pwd_salt(password))
      _ ->
        current_changeset
    end
  end
end
