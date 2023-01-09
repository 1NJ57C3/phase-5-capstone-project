class Worldmap < ApplicationRecord
  validates :x, uniqueness: { scope: :y }
  validates :y, uniqueness: { scope: :x }

  has_many :world_items
  has_many :items, through: :world_items
end
