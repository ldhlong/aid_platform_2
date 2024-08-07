class AddAssignedUsersCountToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :help_requests, :assigned_users_count, :integer, default: 0
  end
end
