class GameItem < ApplicationRecord
  belongs_to :gamesave
  belongs_to :item
end
