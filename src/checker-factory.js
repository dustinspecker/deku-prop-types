/**
 * Creates a new CheckerFactory
 * @param {String} name - name of Checker (e.g. string, array, shape)
 * @param {String|Function} [validator] - If String, typeof is performed to match the type
 *   If Function, the function is executed. The function should return an Error if invalid
 * @return {Object} - a CheckerFactory
 */
module.exports = (name, validator) => ({
  /**
   * Set Checker as required
   *
   * @return {Object} - CheckerFactory
   */
  get isRequired() {
    this.required = true
    return this
  },
  /**
   * Determine if props are valid
   *
   * @param {*} prop - the prop to test
   * @param {String} key - the name of the prop
   * @return {Error|undefined} - If an invalid, an Error is returne. If valid, undefined is returned
   */
  validate(prop, key) {
    if (this.required && prop === undefined) {
      return new Error(`${key} is required`)
    }

    if (prop !== undefined) {
      if (typeof validator === 'string' && typeof prop !== validator) {
        const actualType = typeof prop
        return new TypeError(`Expected ${key} to be of type \`${validator}\`, but got \`${actualType}\``)
      }

      if (typeof validator === 'function') {
        return validator(prop, key)
      }
    }
  }
})
