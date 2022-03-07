class GamesaveSerializer < ActiveModel::Serializer
  attributes :id, :x, :y
  has_one :user
end
