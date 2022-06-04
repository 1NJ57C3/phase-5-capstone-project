class DropSerializer < ActiveModel::Serializer
  attributes :id, :name, :description
  # has_many :worldmaps
  # has_many :gamesaves
end
