class Api::EntitiesController < ApplicationController

  def index
    render json: Entity.all
  end

  def show
    render json: Entity.find_by!(entity_params)
  end

  private

  def entity_params
    params.permit(:id, :type, :name, :description)
  end
end
