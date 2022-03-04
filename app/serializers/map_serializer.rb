class MapSerializer < ActiveModel::Serializer
  attributes :id, :pos_x, :pos_y, :name, :description, :north, :east, :south, :west
end
