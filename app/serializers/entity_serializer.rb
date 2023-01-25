class EntitySerializer < ActiveModel::Serializer
  attributes :id, :group, :name, :description
  has_many :items
end
