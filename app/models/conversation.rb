class Conversation < ApplicationRecord
    has_many :messages
    belongs_to :help_request, foreign_key: 'help_request_id', primary_key: 'request_count'
end
