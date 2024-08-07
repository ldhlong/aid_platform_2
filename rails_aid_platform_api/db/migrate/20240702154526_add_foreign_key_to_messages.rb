class AddForeignKeyToMessages < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :messages, :conversations, column: :conversation_id
  end
end
