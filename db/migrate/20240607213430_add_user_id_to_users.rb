# db/migrate/20240607213430_add_user_id_to_users.rb
class AddUserIdToUsers < ActiveRecord::Migration[6.0]
  def change
    change_table :users do |t|
      t.primary_key :user_id
    end
  end
end
