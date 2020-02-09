defmodule ImconWeb.Router do
  use ImconWeb, :router

  pipeline :browser do
    plug :accepts, ["html", "json"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json", "xml"]
  end

  pipeline :jwt_auth do
    plug ImconWeb.Guardian.Pipeline
  end

  scope "/api/v1", ImconWeb do
    pipe_through :api

    post "/registration", UserController, :create
    post "/session", SessionController, :create
    delete "/session", SessionController, :delete
  end

  scope "/api/v1", ImconWeb do
    pipe_through [:api, :jwt_auth]

    resources "/talks", TalkController, only: [:create, :index] do
      resources "/messages", MessageController, only: [:index]
      resources "/messages", MessageController, only: [], singleton: true do
        post "/read", TalkController, :read, singleton: true
      end
    end

    resources "/direct_talk", DirectTalkController, only: [:index]
    post "/direct_talk/join", DirectTalkController, :join

    resources "/channel_user", TalkUserController, only: [:create]

    get "/current_user", CurrentUserController, :show

    resources "/tree", TreeController, only: [:index, :create] do
      resources "/leaflet", LeafletController, only: [:show]
    end
  end

  scope "/", ImconWeb do\
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end
end
