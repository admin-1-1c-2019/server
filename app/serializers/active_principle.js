exports.getActivePrinciple = active => ({
  code: active.id,
  name: active.name,
  description: active.description
});

exports.getActivePrinciples = actives => actives.map(exports.getActivePrinciple);
