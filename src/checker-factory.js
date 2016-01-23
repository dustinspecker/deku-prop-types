module.exports = (name, validator) => ({
  get isRequired() {
    this.required = true
    return this
  },
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
