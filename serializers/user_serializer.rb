class UserSerializer
  include JSONAPI::Serializer

  attributes :email, :first_name, :last_name, :user_id

  attribute :photo do |user|
    if user.photo.present?
      user.photo.url
    else
      nil
    end
  end
end
