class EntityItemSerializer < ActiveModel::Serializer
  attributes :id
  has_one :entity
  has_one :item
end
