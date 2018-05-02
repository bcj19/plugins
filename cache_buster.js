/**
 * returns 10 character random alphanumeric string
 * @param len {=number} specify length of return string (optional)
 */
function getCacheBuster(len) {
  var len = len || 5,
    cb = '',
    charPool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < len; i++) {
    cb += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  return cb;
}

return (getCacheBuster(10));
