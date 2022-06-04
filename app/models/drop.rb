class Drop < ApplicationRecord
    has_many :world_drops
    has_many :worldmaps, through: :world_drops
    
    has_many :game_drops
    has_many :gamesaves, through: :game_drops
end
