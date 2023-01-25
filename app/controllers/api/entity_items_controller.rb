class Api::EntityItemsController < ApplicationController
  def index
    render json: EntityItem.all
  end

  def show
    render json: EntityItem.find_by!(entity_item_params)
  end

  private

  def entity_item_params
    params.permit(:id, :entity_id, :item_id)
  end)
end
