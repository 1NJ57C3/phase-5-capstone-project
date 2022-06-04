class Worldmap < ApplicationRecord
  validates :x, uniqueness: { scope: :y }
  validates :y, uniqueness: { scope: :x }

  has_many :world_drops
  has_many :drops, through: :world_drops
end
