class GamesaveSerializer < ActiveModel::Serializer
  attributes :id, :x, :y, :user_id
  # has_one :user
end
