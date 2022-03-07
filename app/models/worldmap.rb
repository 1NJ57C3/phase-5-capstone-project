class Worldmap < ApplicationRecord
    validates :x, uniqueness: { scope: :y }
    validates :y, uniqueness: { scope: :x }
end
