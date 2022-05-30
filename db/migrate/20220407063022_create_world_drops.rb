class CreateWorldDrops < ActiveRecord::Migration[7.0]
  def change
    create_table :world_drops do |t|
      t.references :worldmap, null: false, foreign_key: true
      t.references :drop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
