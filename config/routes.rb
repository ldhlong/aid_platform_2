Rails.application.routes.draw do
  mount ActionCable.server => "/cable"
 
  # Messages routes
  resources :messages, only: [:index, :create, :update, :destroy]
  get 'messages/:conversation_id', to: 'messages#show_by_conversation', as: 'show_by_conversation'

  # Conversations routes
  get 'conversations', to: 'conversations#index'
  get 'conversations/:conversation_id/user_id', to: 'conversations#user_id'

 # HelpRequests routes
 resources :help_requests, only: [:index, :show]  # Add :show to fetch specific help request
 patch 'help_requests/:request_count/complete', to: 'help_requests#mark_complete', as: 'mark_complete_help_request'
 patch 'help_requests/:request_count/republish', to: 'help_requests#republish', as: 'republish_help_request'
 post '/submit_request', to: 'help_requests#create'
 patch 'help_requests/:request_count', to: 'help_requests#update'
 get 'api/completed_requests_count', to: 'help_requests#completed_requests_count'
 
  # Other routes
  get 'current_user', to: 'current_user#index'

  # Devise routes with custom path names
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Root and other custom routes
  root 'home#index'
  post '/submit_request', to: 'help_requests#create'
  get '/success', to: 'help_requests#success', as: 'success'

end
