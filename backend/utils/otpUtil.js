// backend/utils/otpUtil.js
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOTP;
