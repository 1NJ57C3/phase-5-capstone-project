class ChangeDropsToItems < ActiveRecord::Migration[7.0]
  def change
    rename_table :drops, :items
    rename_table :game_drops, :game_items
    rename_column :game_items, :drop_id, :item_id
    rename_table :world_drops, :world_items
    rename_column :world_items, :drop_id, :item_id
  end
end
