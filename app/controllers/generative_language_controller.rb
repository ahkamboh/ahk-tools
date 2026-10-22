require "net/http"
require "json"

# Calls Gemini on the server so the API key never reaches the browser.
# POST /generate_content  { "prompt": "...", "generationConfig": { ... } }
# Responds with Gemini's own JSON (candidates[0].content.parts[0].text).
class GenerativeLanguageController < ApplicationController
  GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent".freeze
  GENERATION_CONFIG_KEYS = %w[temperature topK topP maxOutputTokens].freeze

  def generate_content
    api_key = ENV["API_KEY"]
    if api_key.blank?
      return render json: { error: "API_KEY is not set on the server" }, status: :service_unavailable
    end

    prompt = params[:prompt].to_s.strip
    return render json: { error: "prompt is required" }, status: :bad_request if prompt.empty?

    body = { contents: [{ parts: [{ text: prompt }] }] }
    if params[:generationConfig].respond_to?(:permit)
      config = params[:generationConfig].permit(*GENERATION_CONFIG_KEYS).to_h
      body[:generationConfig] = config if config.present?
    end

    uri = URI(format(GEMINI_URL, ENV["GEMINI_MODEL"].presence || "gemini-pro"))
    response = Net::HTTP.post(uri, body.to_json,
                              "Content-Type" => "application/json",
                              "x-goog-api-key" => api_key)
    render json: response.body, status: response.code.to_i
  rescue StandardError => e
    Rails.logger.error("Gemini request failed: #{e.class}")
    render json: { error: "Gemini request failed" }, status: :bad_gateway
  end
end
