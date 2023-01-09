class WorldItem < ApplicationRecord
  belongs_to :worldmap
  belongs_to :item
end
