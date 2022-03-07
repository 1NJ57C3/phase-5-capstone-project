class GamesavesController < ApplicationController

    def index
        render json: @current_user.gamesaves.all
    end

    def show
        render json: @current_user.gamesaves.find_by!(user_id: params[:user_id])
    end

    def create
        gs = @current_user.gamesaves.create!(gs_params)
        render json: gs, status: 201
    end

    def update
        gs = @current_user.gamesaves.update!(gs_params)
        render json: gs, status: 201
    end

    def destroy
        @current_user.gamesaves.find_by!(user_id: params[:user_id]).destroy!
        head 204
    end

    private

    def gs_params
        params.permit(:x, :y, :user_id)
    end
end
