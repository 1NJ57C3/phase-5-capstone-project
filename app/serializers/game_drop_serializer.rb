class GameDropSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :gamesave_id
  belongs_to :drop_id
end
