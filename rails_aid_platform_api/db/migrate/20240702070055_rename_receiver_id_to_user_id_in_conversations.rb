class RenameReceiverIdToUserIdInConversations < ActiveRecord::Migration[7.1]
  def change
    rename_column :conversations, :receiver_id, :user_id
  end
end
