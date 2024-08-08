class RenameIdColumnToUserIdInUsers < ActiveRecord::Migration[7.1]
  def change
    rename_column :users, :id, :user_id
  end
end
