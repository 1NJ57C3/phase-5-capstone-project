class Item < ApplicationRecord
    validates :name, :description, presence: true
    
    has_many :world_items
    has_many :worldmaps, through: :world_items
    
    has_many :game_items
    has_many :gamesaves, through: :game_items
end
