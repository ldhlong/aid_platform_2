class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :sender, class_name: 'User', foreign_key: 'sender_id'
  belongs_to :user, class_name: 'User', foreign_key: 'user_id'

  after_create_commit { broadcast_message }

  private

  def broadcast_message
    ActionCable.server.broadcast("MessagesChannel_#{conversation.id}", {
                                   id: id,
                                   body: body,
                                   sender_id: sender_id,
                                   user_id: user_id
                                 })
  end
end
