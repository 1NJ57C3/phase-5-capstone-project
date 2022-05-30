class Gamesave < ApplicationRecord
  belongs_to :user

  has_many :game_drops
  has_many :drops, through: :game_drops

  # accepts_nested_attributes_for :game_drops, allow_destroy: true#, reject_if: :reject_game_drops

  private

  # def reject_game_drops(attributes)
  #   attributes[game_drop_id].blank?
  # end

end
