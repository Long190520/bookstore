Stripe.setPublishableKey(
  "pk_test_51LzJKkK49vPExP4tLxDc4OgJuNJUtvu0PnDqTAqunMbtr1y6FHXm0td8f4rnklrZG10GLFZokwqZrwgiGHBtS3gq005PVY4P6A"
);

var $form = $("#checkout-form");

$form.submit(function (event) {
  $("#payment-error").addClass("hidden");
  $form.find("button").prop("disabled", true);

  Stripe.card.createToken(
    {
      number: $("#card-number").val(),
      exp_month: $("#card-expiry-month").val(),
      exp_year: $("#card-expiry-year").val(),
      name: $("#card-name").val(),
    },
    stripeResponseHandler
  );

  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) {
    // Problem!

    // Show the errors on the form
    $("#payment-error").text(response.error.message);
    $("#payment-error").removeClass("hidden");
    $form.find("button").prop("disabled", false); // Re-enable submission
  } else {
    // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}
