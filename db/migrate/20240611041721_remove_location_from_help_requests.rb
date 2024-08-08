class RemoveLocationFromHelpRequests < ActiveRecord::Migration[6.0]
  def change
    remove_column :help_requests, :location
  end
end
