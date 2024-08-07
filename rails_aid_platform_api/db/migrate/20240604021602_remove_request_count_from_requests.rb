class RemoveRequestCountFromRequests < ActiveRecord::Migration[7.1]
  def change
    remove_column :requests, :request_count, :integer
  end
end
