class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    enable_extension :citext
    create_table :users do |t|
      t.citext :username
      t.string :password_digest

      t.timestamps
    end
  end
end
