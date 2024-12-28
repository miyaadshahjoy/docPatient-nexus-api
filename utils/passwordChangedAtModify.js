module.exports = function (next) {
  if (!this.isModified('password' || this.isNew)) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
};
