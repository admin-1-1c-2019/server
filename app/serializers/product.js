const { getActivePrinciple } = require('./active_principle');

exports.getProduct = product => ({
  code: product.id,
  name: product.name,
  description: product.description,
  images: product.images,
  size: product.size,
  active_principle: getActivePrinciple(product.activePrinciple)
});

exports.getProducts = products => products.map(exports.getProduct);
