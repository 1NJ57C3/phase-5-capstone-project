class CreateWorldmaps < ActiveRecord::Migration[7.0]
  def change
    create_table :worldmaps do |t|
      t.integer :x
      t.integer :y
      t.string :name
      t.text :description
      t.boolean :north
      t.boolean :east
      t.boolean :south
      t.boolean :west

      t.timestamps
    end
  end
end
