module.exports = (req, res, next) => {
  if (req.user.role == 1 && req.params.id == req.user.id) return next();

  res.status(403).send("Access forbidden.");
};
