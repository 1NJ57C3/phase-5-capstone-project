# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_01_23_225820) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "entities", force: :cascade do |t|
    t.string "group"
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "entity_items", force: :cascade do |t|
    t.bigint "entity_id", null: false
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entity_id"], name: "index_entity_items_on_entity_id"
    t.index ["item_id"], name: "index_entity_items_on_item_id"
  end

  create_table "game_items", force: :cascade do |t|
    t.bigint "gamesave_id", null: false
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gamesave_id"], name: "index_game_items_on_gamesave_id"
    t.index ["item_id"], name: "index_game_items_on_item_id"
  end

  create_table "gamesaves", force: :cascade do |t|
    t.integer "x"
    t.integer "y"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_gamesaves_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.citext "username"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "world_entities", force: :cascade do |t|
    t.bigint "worldmap_id", null: false
    t.bigint "entity_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entity_id"], name: "index_world_entities_on_entity_id"
    t.index ["worldmap_id"], name: "index_world_entities_on_worldmap_id"
  end

  create_table "world_items", force: :cascade do |t|
    t.bigint "worldmap_id", null: false
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_world_items_on_item_id"
    t.index ["worldmap_id"], name: "index_world_items_on_worldmap_id"
  end

  create_table "worldmaps", force: :cascade do |t|
    t.integer "x"
    t.integer "y"
    t.string "name"
    t.text "description"
    t.boolean "north"
    t.boolean "east"
    t.boolean "south"
    t.boolean "west"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "entity_items", "entities"
  add_foreign_key "entity_items", "items"
  add_foreign_key "game_items", "gamesaves"
  add_foreign_key "game_items", "items"
  add_foreign_key "gamesaves", "users"
  add_foreign_key "world_entities", "entities"
  add_foreign_key "world_entities", "worldmaps"
  add_foreign_key "world_items", "items"
  add_foreign_key "world_items", "worldmaps"
end
