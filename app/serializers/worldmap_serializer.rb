class WorldmapSerializer < ActiveModel::Serializer
  attributes :id, :x, :y, :name, :description, :north, :east, :south, :west
end
