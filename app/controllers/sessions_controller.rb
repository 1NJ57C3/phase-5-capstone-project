class SessionsController < ApplicationController
    skip_before_action :authorize, only: [:create]

    def create
        u = User.find_by(username: params[:username])
        if u&.authenticate(params[:password])
            session[:user_id] = u.id
            render json: u, status: 201
        else
            render json: { errors: ["Username or Password invalid"] }, status: 401
        end
    end

    def destroy
        session.delete :user_id
        head 204
    end

    private

    def auth_params
        params.permit(:username, :password)
    end

end