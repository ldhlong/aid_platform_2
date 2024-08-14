class HelpRequestsController < ApplicationController
  before_action :set_help_request, only: [:show, :update, :mark_complete, :republish]

  def index
    # Fetch help requests with fewer than 5 assigned users or where completion_status is true
    help_requests = HelpRequest.where("assigned_users_count < ? OR completion_status = ?", 5, true)
  
    # Group by title and select the first entry in each group
    unique_requests = help_requests.group_by(&:title).values.map(&:first)
  
    render json: unique_requests
  end
  

  def show
    render json: @help_request
  end

  def create
    help_request = HelpRequest.new(help_request_params.merge(user_id: current_user_id))

    if help_request.save
      # Create a new conversation and associate its ID with the help_request
      conversation = Conversation.create(
        sender_id: help_request.user_id,
        user_id: nil,  # Set to nil initially since accepted_by_user is nil
        help_request_id: help_request.id
      )

      # Update help_request with conversation_id
      help_request.update(conversation_id: conversation.id)

      Message.create(
        body: "Let's start the conversation!",
        conversation_id: conversation.id,
        sender_id: help_request.user_id,
        user_id: nil  # Set to nil initially since accepted_by_user is nil
      )

      render json: help_request, status: :created
    else
      render json: { errors: help_request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @help_request = HelpRequest.find_by(request_count: params[:request_count])
    return render json: { error: 'Help request not found' }, status: :not_found unless @help_request

    accepted_by_user = params.dig(:help_request, :accepted_by_user)&.to_i

    if accepted_by_user.present?
        if @help_request.assigned_users_count < 5
          @help_request.increment!(:assigned_users_count)

          if @help_request.assigned_users_count >= 5
            @help_request.update(visible: false)
          end

        if @help_request.update(help_request_update_params)
          # Create a new conversation for each accepted user
          conversation = Conversation.create(
            sender_id: accepted_by_user,
            user_id: @help_request.user_id,
            help_request_id: @help_request.id
          )

          Message.create(
            body: "Let's start the conversation!",
            conversation_id: conversation.id,
            sender_id: accepted_by_user,
            user_id: @help_request.user_id
          )

          render json: { help_request: @help_request, conversation_id: conversation.id }, status: :ok
        else
          render json: { errors: @help_request.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: "Help request already has the maximum number of accepted users." }, status: :unprocessable_entity
      end
    else
      render json: { error: "Accepted by user is required." }, status: :unprocessable_entity
    end
  end

  def completed_requests_count
    count = HelpRequest.where(completion_status: true).count
    Rails.logger.debug "Completed requests count: #{count}"
    render json: { count: count }
  end
  def mark_complete
    Rails.logger.debug "Parameters: #{params.inspect}"
    help_request = HelpRequest.find_by(request_count: params[:request_count])
  
    if help_request
      # Update the help request's completion status and set visible to false
      help_request.update(
        completion_status: true, # Set completion_status to true
        visible: false
      )
  
      # Find conversations related to the help request
      conversations = Conversation.where(help_request_id: help_request.request_count)
  
      # Update the visibility of related conversations
      conversations.update_all(visible: false)
  
      render json: { message: "Help request and related conversations updated successfully" }, status: :ok
    else
      render json: { error: "Help request not found" }, status: :not_found
    end
  end

  def republish
    help_request = HelpRequest.find_by(request_count: params[:request_count])
    conversation = Conversation.find_by(id: params[:conversation_id])
  
    if help_request && conversation
      # Update HelpRequest
      help_request.decrement!(:assigned_users_count) # Assuming you have this field
      help_request.update(visible: true)
  
      # Update Conversation
      conversation.update(visible: false)
  
      render json: { message: "Help request republished successfully" }, status: :ok
    else
      render json: { error: "Help request or conversation not found" }, status: :not_found
    end
  end
  private

  def set_help_request
    @help_request = HelpRequest.find_by(request_count: params[:request_count])
    unless @help_request
      render json: { error: 'Help request not found' }, status: :not_found
    end
  end

  def current_user_id
    params[:help_request][:user_id]  # Adjust this to your actual method of retrieving user_id from local storage
  end

  def help_request_params
    params.require(:help_request).permit(:title, :request_type, :description, :latitude, :longitude, :user_id, :visible, :request_count)
  end

  def help_request_update_params
    params.require(:help_request).permit(:accepted_by_user, :completion_status, :visible)
  end
end
