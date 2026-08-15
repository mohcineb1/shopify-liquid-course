# Legacy Shopify Script export: business behavior and current execution are unknown.
if Input.cart.line_items.length > 3
  Output.shipping_rates = Input.shipping_rates.reject { |rate| rate.name == 'Express' }
end
