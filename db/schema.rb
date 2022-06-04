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

ActiveRecord::Schema[7.0].define(version: 2022_04_07_063022) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "drops", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "game_drops", force: :cascade do |t|
    t.bigint "gamesave_id", null: false
    t.bigint "drop_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drop_id"], name: "index_game_drops_on_drop_id"
    t.index ["gamesave_id"], name: "index_game_drops_on_gamesave_id"
  end

  create_table "gamesaves", force: :cascade do |t|
    t.integer "x"
    t.integer "y"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_gamesaves_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.citext "username"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "world_drops", force: :cascade do |t|
    t.bigint "worldmap_id", null: false
    t.bigint "drop_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drop_id"], name: "index_world_drops_on_drop_id"
    t.index ["worldmap_id"], name: "index_world_drops_on_worldmap_id"
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

  add_foreign_key "game_drops", "drops"
  add_foreign_key "game_drops", "gamesaves"
  add_foreign_key "gamesaves", "users"
  add_foreign_key "world_drops", "drops"
  add_foreign_key "world_drops", "worldmaps"
end
