class Worldmap < ApplicationRecord
  validates :x, :y, :name, :description, presence: true
  validates :x, uniqueness: { scope: :y }
  validates :y, uniqueness: { scope: :x }
  validates :north, :east, :south, :west, inclusion: [true, false]

  has_many :world_items
  has_many :items, through: :world_items

  has_many :world_entities
  has_many :entities, through: :world_entities
end
