source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.1"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.0.2", ">= 7.0.2.2"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", "~> 5.0"

# Use Active Model has_secure_password
gem "bcrypt", "~> 3.1"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", "~> 1.10", require: false

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem "rack-cors"

group :development do
  gem "listen", "~> 3.7"
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  gem "spring"
end

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  # gem "debug", platforms: %i[ mri mingw x64_mingw ]

  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  # gem "byebug", platforms: %i[ mri mingw x64_mingw ]
  
  # gem "pry", platforms: %i[ mri mingw x64_mingw ]
  gem "pry-byebug", platforms: %i[ mri mingw x64_mingw ]
end

# Serialize JSON output with ease!
gem "active_model_serializers", "~> 0.10.13"
