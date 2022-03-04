class Map < ApplicationRecord
    validates :pos_x, :pos_y, :name, :description, presence: true
    validates :pos_x, uniqueness: { scope: [:pos_y] }
    validates :pos_y, uniqueness: { scope: [:pos_x] }
    validates :north, :east, :south, :west, inclusion: { in: [true, false] }
end
