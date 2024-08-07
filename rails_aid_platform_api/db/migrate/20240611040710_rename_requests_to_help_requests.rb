class RenameRequestsToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    rename_table :requests, :help_requests
  end
end
