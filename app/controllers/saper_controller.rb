# frozen_string_literal: true

# Class for displaying the leaderboard and changing the user's score
class SaperController < ApplicationController
  def game; end

  def leaders
    @show = User.find_by_sql('select * from users where result<>-1 order by result limit 10')
  end

  def addresult
    num = params[:num].to_i
    us = User.find_by(id: cookies.signed[:user_id])
    if us.result == -1
      us.result = num
      us.save
    elsif num < us.result
      us.result = num
      us.save
    end
  end
end
