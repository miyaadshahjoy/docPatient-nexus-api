const bcrypt = require('bcryptjs');

module.exports = async function (next) {
  if (!this.isModified('password')) return next();
  // TODO: Encrypt the password
  const encryptedPassword = await bcrypt.hash(this.password, 12);
  this.password = encryptedPassword;
  // TODO: Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
};
