class WorldEntitySerializer < ActiveModel::Serializer
  attributes :id
  has_one :worldmap
  has_one :entities
end
