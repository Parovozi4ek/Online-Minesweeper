require "test_helper"

class UserTest < ActiveSupport::TestCase
  test 'check that user can be saved, read, edited and destroyed' do
    password = Faker::Lorem.word
    username = Faker::Lorem.word
    user = User.create(username: username, password: password, password_confirmation: password)
    assert user.save
    assert User.find_by(username: username)
    username = Faker::Lorem.word
    user.update(username: username, password: password, password_confirmation: password)
    assert user.save
    assert User.find_by(username: username)
    assert user.destroy
  end
end
