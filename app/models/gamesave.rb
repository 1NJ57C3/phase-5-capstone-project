class Gamesave < ApplicationRecord
  belongs_to :user

  has_many :game_items
  has_many :items, through: :game_items, dependent: :destroy

  # accepts_nested_attributes_for :game_items, allow_destroy: true#, reject_if: :reject_game_items

  private

  # def reject_game_items(attributes)
  #   attributes[game_item_id].blank?
  # end

end
