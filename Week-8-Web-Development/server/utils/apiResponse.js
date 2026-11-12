exports.sendSuccess = (res, { status = 200, message = "Success", data = null, meta } = {}) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};
