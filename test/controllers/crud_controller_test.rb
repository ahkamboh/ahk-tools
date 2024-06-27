require "test_helper"

class CrudControllerTest < ActionDispatch::IntegrationTest
  test "should get practice" do
    get crud_practice_url
    assert_response :success
  end
end
