class MapsController < ApplicationController
  
  def index
    render json: Map.all, status: 200
  end

end
