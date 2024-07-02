require "test_helper"

class RecmndLetterControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get recmnd_letter_index_url
    assert_response :success
  end
end
