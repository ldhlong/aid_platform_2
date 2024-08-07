class AddConversationIdToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :help_requests, :conversation_id, :integer
  end
end
