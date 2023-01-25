class Api::GameItemsController < ApplicationController
    def index
        render json: GameItem.all
    end

    def create
        item = @current_user.gamesaves.find_by!(gamesave_id: item_params[:gamesave_id]).game_items.create!(item_params)
        render json: item, status: 201
    end

    def destroy
        @current_user.game_items.find(item_params[:id]).destroy!
        head 204
    end

    private

    def item_params
        params.permit(:id, :gamesave_id, :item_id)
    end
end
