class CreateMaps < ActiveRecord::Migration[7.0]
  def change
    create_table :maps do |t|
      t.integer :pos_x
      t.integer :pos_y
      t.string :name
      t.string :description
      t.boolean :north
      t.boolean :east
      t.boolean :south
      t.boolean :west

      t.timestamps
    end
  end
end
