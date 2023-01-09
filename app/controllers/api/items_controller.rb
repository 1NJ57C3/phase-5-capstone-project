class Api::ItemsController < ApplicationController
    def index
        render json: Item.all
    end

    def show
        render json: Item.find_by(i_params)
    end

    private

    def i_params
        params.permit(:id, :name, :description)
    end
end
