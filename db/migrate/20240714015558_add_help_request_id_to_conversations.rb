class AddHelpRequestIdToConversations < ActiveRecord::Migration[7.1]
  def change
    add_column :conversations, :help_request_id, :integer
    add_index :conversations, :help_request_id
  end
end
