class CreateRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :requests do |t|
      t.string :title
      t.string :request_type
      t.text :description
      t.string :location
      t.string :accepted_by_user
      t.boolean :completion_status, default: false
      t.integer :request_count, default: 0

      t.timestamps
    end
  end
end
