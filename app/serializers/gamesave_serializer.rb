class GamesaveSerializer < ActiveModel::Serializer
  attributes :id, :pos_x, :pos_y
  has_one :user

  # validates :pos_x, :pos_y, :user
end
