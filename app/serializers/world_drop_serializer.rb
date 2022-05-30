class WorldDropSerializer < ActiveModel::Serializer
  attributes :id
  has_one :worldmap_id
  has_one :drop_id
end
