class GameDrop < ApplicationRecord
  belongs_to :gamesave
  belongs_to :drop
end
