const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

  // Impl: Generate Password Reset Token
  schema.methods.createPasswordResetToken = function () {
    // pseudo-random 32-bit hex string
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };
  // Impl: Generate Email verification Token
  schema.methods.createEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    this.emailVerificationTokenExpire = Date.now() + 10 * 60 * 1000;
    return verificationToken;
  };
};

module.exports = instanceMethodsPlugin;
