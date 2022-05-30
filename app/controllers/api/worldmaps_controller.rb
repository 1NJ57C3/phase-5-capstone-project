class Api::WorldmapsController < ApplicationController

    def index
        render json: Worldmap.all
    end

    def show
        render json: Worldmap.find_by!(worldmap_search_params)
    end

    private

    def worldmap_search_params
        params.permit(:id, :x, :y)
    end

    def worldmap_params
        params.permit(:id, :x, :y, :name, :description, :north, :east, :south, :west)
    end

end
