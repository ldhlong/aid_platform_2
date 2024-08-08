class RenameIdColumnToUserIdInHelpRequests < ActiveRecord::Migration[7.1]
  def change
    remove_column :requests, :user_id
    rename_column :requests, :id, :user_id
  end
end
