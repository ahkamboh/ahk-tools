Rails.application.routes.draw do
  get 'recmnd_letter/index'
  get 'crud/practice'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root "home#index"
  get 'cv/index'
  get 'cv/edit'
  get 'cvmain', to:"cv#main"
  get 'temp1', to:"cv#temp1"
  get 'temp2', to:"cv#temp2"
  get 'easydoc', to:"easydoc#index"

  post '/generate_content', to: 'generative_language#generate_content'
end
