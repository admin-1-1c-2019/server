exports.create = body => ({
  name: body.name,
  description: body.description,
  images: body.images,
  size: body.size,
  activePrincipleId: body.active_principle_id
});
