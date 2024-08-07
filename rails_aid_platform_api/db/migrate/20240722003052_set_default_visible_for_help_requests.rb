class SetDefaultVisibleForHelpRequests < ActiveRecord::Migration[7.1]
  def up
    # Set the default value for existing records
    change_column_default :help_requests, :visible, true

    # Update existing records to use the default value
    HelpRequest.update_all(visible: true)
  end

  def down
    # Remove the default value if rolling back
    change_column_default :help_requests, :visible, nil
  end
end
