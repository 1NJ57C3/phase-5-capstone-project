class User < ApplicationRecord
    validates :username, :password_digest, presence: true, uniqueness: { case_sensitive: false }
    has_secure_password

    has_many :gamesaves
end