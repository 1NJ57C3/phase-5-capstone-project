class Api::GameDropsController < ApplicationController
    def index
        render json: GameDrop.all
    end

    def create
        pos = @current_user.gamesaves.find_by!(gamesave_id: pos_params[:gamesave_id]).game_drops.create!(pos_params)
        render json: pos, status: 201
    end

    def destroy
        @current_user.game_drops.find(pos_params[:id]).destroy!
        head 204
    end

    private

    def pos_params
        params.permit(:id, :gamesave_id, :drop_id)
    end
end
