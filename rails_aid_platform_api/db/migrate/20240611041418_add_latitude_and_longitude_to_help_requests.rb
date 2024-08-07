class AddLatitudeAndLongitudeToHelpRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :help_requests, :latitude, :float
    add_column :help_requests, :longitude, :float
  end
end
