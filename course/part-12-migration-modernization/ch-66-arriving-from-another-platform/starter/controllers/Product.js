server.get('Show', function (req, res, next) { var product = ProductMgr.getProduct(req.querystring.pid); res.render('product', {product: product}); next(); });
