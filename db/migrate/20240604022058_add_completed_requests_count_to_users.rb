class AddCompletedRequestsCountToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :completed_requests_count, :integer, default: 0, null: false
  end
end
