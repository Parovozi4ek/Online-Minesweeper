class ChangeResultFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column :users, :result, :integer
  end
end
