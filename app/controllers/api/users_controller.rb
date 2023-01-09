class Api::UsersController < ApplicationController
    skip_before_action :authorize, only: [:create]

    # TODO Included for development/testing purposes -- remember to remove
    # def index
    #     render json: User.all
    # end

    def create
        u = User.create!(u_params)
        session[:user_id] = u.id
        render json: u, status: 201
    end

    def show
        render json: User.find_by!(id: session[:user_id]), include: "gamesaves.items", status: 201
    end

    private

    def u_params
        params.permit(:username, :password, :password_confirmation)
    end
end
