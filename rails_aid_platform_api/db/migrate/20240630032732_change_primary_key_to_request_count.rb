class ChangePrimaryKeyToRequestCount < ActiveRecord::Migration[7.1]
  def up
    # Add request_count as primary key
    add_column :help_requests, :request_count, :primary_key

    # Ensure request_count is unique and populated with unique values
    HelpRequest.reset_column_information
    HelpRequest.all.each.with_index(1) do |help_request, index|
      help_request.update_column(:request_count, index)
    end
  end

  def down
    # Remove request_count primary key
    remove_column :help_requests, :request_count

    # Add user_id back as primary key
    add_column :help_requests, :user_id, :primary_key
  end
end
