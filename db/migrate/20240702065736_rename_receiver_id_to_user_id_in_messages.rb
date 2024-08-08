class RenameReceiverIdToUserIdInMessages < ActiveRecord::Migration[7.1]
  def change
    rename_column :messages, :receiver_id, :user_id
  end
end
