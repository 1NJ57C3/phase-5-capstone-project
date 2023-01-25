class EntityItem < ApplicationRecord
  belongs_to :entity
  belongs_to :item
end
