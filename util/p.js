/**
 * Wraps a promises .then and .catch and returns it neatly.
 * 
 * Returns an array where the first value is an error if it got caught, else it is null and the rest is the returned data by the promise.
 */

module.exports = function(promise) {
  return promise
    .then((...data) => [null, ...data])
    .catch((err) => [err, null])
}