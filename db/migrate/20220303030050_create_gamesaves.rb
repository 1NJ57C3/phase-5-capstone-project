class CreateGamesaves < ActiveRecord::Migration[7.0]
  def change
    create_table :gamesaves do |t|
      t.integer :pos_x
      t.integer :pos_y
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
