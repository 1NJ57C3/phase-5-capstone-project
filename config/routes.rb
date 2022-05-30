Rails.application.routes.draw do
  namespace :api do
    resources :gamesaves
    resources :worldmaps, only: [:index, :show]
    # resources :world_drops
    resources :game_drops, only: [:index, :create, :destroy]
    resources :drops, only: [:index, :show]
    # TODO resources :users, only: [:index] # * Included for development/testing purposes -- remember to remove
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
    # Defines the root path route ("/")
    # root "articles#index"
    
    post '/signup', to: 'users#create'
    get '/me', to: 'users#show'
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
  end

  # ! [DEPRECATED] - INITIAL SETUP TESTING
  # get '/hello', to: 'application#hello_world'

  get '*path', to: 'fallback#index', constraints: -> (req) { !req.xhr? && req.format.html? }

end
