class FallbackController < ActionController::Base
    def index
        render file: 'public/robots.txt'
        # render file: 'public/index.html'
    end
end
