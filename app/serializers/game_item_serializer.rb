class GameItemSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :gamesave_id
  belongs_to :item_id
end
