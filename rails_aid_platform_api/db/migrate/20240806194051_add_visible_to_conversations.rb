class AddVisibleToConversations < ActiveRecord::Migration[7.1]
  def change
    add_column :conversations, :visible, :boolean, default: true
  end
end
