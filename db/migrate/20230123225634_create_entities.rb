class CreateEntities < ActiveRecord::Migration[7.0]
  def change
    create_table :entities do |t|
      t.string :group
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
