class ConversationsController < ApplicationController
  def index
    user_id = params[:user_id]
  
    # Fetch conversations
    conversations = Conversation.where('sender_id = ? OR user_id = ?', user_id, user_id)
  
    # Filter conversations
    filtered_conversations = conversations.select do |conversation|
      conversation.sender_id.present? && conversation.user_id.present?
    end
  
    # Fetch help request details and merge with conversation data
      data = filtered_conversations.map do |conversation|
      last_message = conversation.messages.last
      help_request = HelpRequest.find_by(request_count: conversation.help_request_id)

      {
        id: conversation.id,
        sender_id: conversation.sender_id,
        user_id: conversation.user_id,
        last_message: last_message ? last_message.body : '',
        updated_at: last_message ? last_message.created_at : conversation.updated_at,
        help_request_id: conversation.help_request_id,
        created_at: help_request ? help_request.created_at : nil,
        title: help_request ? help_request.title : 'N/A',
        request_type: help_request ? help_request.request_type : 'N/A',
        description: help_request ? help_request.description : 'N/A',
        completion_status: help_request ? help_request.completion_status : nil,
        visible: conversation.visible,
        assigned_users_count: help_request ? help_request.assigned_users_count : nil
      }
    end

    
    render json: data
  end
end
