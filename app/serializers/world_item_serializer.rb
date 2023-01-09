class WorldItemSerializer < ActiveModel::Serializer
  attributes :id
  has_one :worldmap_id
  has_one :item_id
end
