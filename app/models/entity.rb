class Entity < ApplicationRecord
  validates :group, :name, :description, presence: true
  
  has_many :entity_items
  has_many :items, through: :entity_items
end
