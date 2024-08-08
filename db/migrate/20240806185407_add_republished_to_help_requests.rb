class AddRepublishedToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :help_requests, :republished, :boolean, default: false
  end
end
