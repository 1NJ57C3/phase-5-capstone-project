class Api::DropsController < ApplicationController
    def index
        render json: Drop.all
    end

    def show
        render json: Drop.find_by(d_params)
    end

    private

    def d_params
        params.permit(:id, :name, :description)
    end
end
