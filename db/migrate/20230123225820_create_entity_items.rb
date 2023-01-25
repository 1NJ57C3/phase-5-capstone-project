class CreateEntityItems < ActiveRecord::Migration[7.0]
  def change
    create_table :entity_items do |t|
      t.references :entity, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
