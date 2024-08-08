class RemoveRepublishedColumnFromHelpRequests < ActiveRecord::Migration[7.1]
  def change
    remove_column :help_requests, :republished
  end
end
