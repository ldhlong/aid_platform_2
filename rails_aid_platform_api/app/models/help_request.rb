class HelpRequest < ApplicationRecord
    validates_presence_of :title, :request_type, :description, :latitude, :longitude
    belongs_to :user
  
    before_validation :assign_request_count, on: :create
    after_initialize :set_default_visible, if: :new_record?

    private
    def set_default_visible
      self.visible ||= true  # Or false, depending on your needs
    end
    
    def assign_request_count
      self.request_count ||= generate_unique_request_count
    end
  
    def generate_unique_request_count
      new_request_count = SecureRandom.random_number(1_000_000) # Example: Generate random number
      while HelpRequest.exists?(request_count: new_request_count)
        new_request_count += 1 # Increment if already taken
      end
      new_request_count
    end
  end
  