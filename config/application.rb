require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Saper1
  class Application < Rails::Application
    config.load_defaults 6.1
    config.i18n.default_locale = :ru
  end
end