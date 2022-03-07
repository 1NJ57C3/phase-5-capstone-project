class WorldmapsController < ApplicationController

    def index
        render json: Worldmap.all
    end

    def show
        render json: Worldmap.find_by(worldmap_params)
    end

    private

    def worldmap_params
        params.permit(:x, :y, :name, :description, :north, :east, :south, :west)
    end

end
