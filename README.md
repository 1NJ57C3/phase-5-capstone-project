## Introduction  
MUDengine is a full-stack web application built with a React front-end (client) and a Ruby on Rails back-end. It was inspired by the general concept of the game Zork (1977), a text-based Role-Playing Game, driven by strings of user input. As long as there are valid keywords in the user's input, the game progresses. MUDengine is still a work in progress -- As its sole writer/creator, I hope to eventually finish it and perhaps use it to bring a proper game to life.

## Starting Up the Application
If you wish to download and run this game locally, you will need to download this repo and open it with two instances (either windows or tabs) of your Command Line Interface (CLI); either the Command Prompt for Windows, Terminal for Mac, or any equivalent. In these instructions, we will be using the default `Bundler` that comes with `Ruby 3.1.1` and `NPM`.

## Requirements
- NPM 8.12.1
- React 17.0.2
- Ruby 3.1.1
- Rails 7.0.2.3

### Back-end (CLI Instance #1)
Once you have navigated to the appropriate folder in your CLI, type and submit either `bundle` or `bundle install` at the top level directory of this repo to install the back-end's dependencies. Then, use the command `rails db:create db:migrate db:seed` -- If you see "Seeding Complete!" then you have successfully installed the back-end. Finally, start the back end by using the command `rails server`.

### Front-end (CLi Instance #2)
Next, you must install the dependencies for the front-end client. To do so, use the command `npm install --prefix client` at the top level directory of this repo. Once that is complete, use the command `npm start --prefix client` to start up the client. Finally, open a browser window and navigae to `http://localhost:4000`, to start playing the game. If you prefer to automate this final step, open the `package.json` in the `client` folder and erase `BROWSER=none` in the `start` script.
