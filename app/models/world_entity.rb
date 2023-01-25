class WorldEntity < ApplicationRecord
  belongs_to :worldmap
  belongs_to :entity
end
