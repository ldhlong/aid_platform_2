require 'securerandom'

secret_key = SecureRandom.hex(64)
puts secret_key