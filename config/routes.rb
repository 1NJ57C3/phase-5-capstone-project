Rails.application.routes.draw do
  resources :gamesaves
  resources :maps
  # TODO resources :users, only: [:index] # * Included for development/testing purposes -- remember to remove
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  # ! [DEPRECATED] - INITIAL SETUP TESTING
  # get '/hello', to: 'application#hello_world'
  
  namespace :api do
  end

  post '/signup', to: 'users#create'
  get '/me', to: 'users#show'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
end
