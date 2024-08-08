class AddVisibleToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :help_requests, :visible, :boolean
  end
end
