if Input.cart.customer && Input.cart.customer.tags.include?('VIP')
  Input.shipping_rates.each do |rate|
    rate.apply_discount(rate.price, message: 'VIP shipping')
  end
end
Output.shipping_rates = Input.shipping_rates
