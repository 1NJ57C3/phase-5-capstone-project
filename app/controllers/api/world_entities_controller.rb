class Api::WorldEntitiesController < ApplicationController
  def index
    render json: WorldEntity.all
  end

  def show
    render json: WorldEntity.find_by!(world_entities_params)
  end

  private

  def world_entities_params
    params.permmit(:id, :worldmap_id, :entity_id)
  end
end
