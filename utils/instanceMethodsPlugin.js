const bcrypt = require('bcryptjs');

const instanceMethodsPlugin = (schema) => {
  // Impl: Check if password is correct
  schema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  schema.methods.passwordChangedAfter = function (JWTTimestamp) {
    return JWTTimestamp < this.passwordChangedAt.getTime() / 1000;
  };
};

module.exports = instanceMethodsPlugin;
