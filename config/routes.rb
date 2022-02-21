Rails.application.routes.draw do
  get 'saper/game'
  get 'saper/leaders'
  post 'saper/addresult'
  get 'session/login'
  post 'session/create'
  get 'session/logout'
  root 'saper#game'
  resources :users
end
