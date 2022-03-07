class ApplicationController < ActionController::API
    include ActionController::Cookies

    wrap_parameters format: []

    rescue_from ActiveRecord::RecordNotFound, with: :render_404
    rescue_from ActiveRecord::RecordInvalid, with: :render_422
    
    before_action :authorize
    skip_before_action :authorize, only: [:render_404, :render_422]
    
    # ! [DEPRECATED] - INITIAL SETUP TESTING
    # def hello_world
    #     session[:count] = (session[:count] || 0) + 1
    #     render json: { count: session[:count] }
    # end

    private

    def authorize
        @current_user = User.find_by(id: session[:user_id])
        
        render json: { errors: ["Not authorized"] }, status: :unauthorized unless session.include? :user_id
    end

    def render_404 e
        render json: { error: "#{e.model} not found" }, status: :not_found
    end

    def render_422 e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
end
