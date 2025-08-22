source "https://rubygems.org"
ruby "3.1.0"

gem "rails", "~> 7.1.2"
gem "puma", ">= 5.0"
gem "sprockets-rails"
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "tailwindcss-rails"
gem "bootsnap", require: false
gem "tzinfo-data", platforms: %i[mswin mswin64 mingw x64_mingw jruby]

group :development, :test do
  gem "sqlite3", "~> 1.4"
  gem "dotenv-rails"        # only needed locally
  gem "debug", platforms: %i[mri mswin mswin64 mingw x64_mingw]
  gem "capybara"
  gem "selenium-webdriver"
end

group :development do
  gem "web-console"
  gem "error_highlight", ">= 0.4.0", platforms: [:ruby]
end

group :production do
  gem "pg", "~> 1.5"
  # gem "rails_12factor", "0.0.2"  # only if deploying to Heroku
end
