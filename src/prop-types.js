import checkerFactory from 'checker-factory'

module.exports = {
  get any() {
    return checkerFactory()
  },
  get array() {
    return checkerFactory((prop, key) => {
      if (!Array.isArray(prop)) {
        const actualType = typeof prop
        return new TypeError(`Expected ${key} to be an \`Array\`, but got \`${actualType}\``)
      }
    })
  },
  get arrayOf() {
    return validator =>
      checkerFactory((prop, key) => {
        if (!Array.isArray(prop)) {
          const actualType = typeof prop
          return new TypeError(`Expected ${key} to be an \`Array\`, but got \`${actualType}\``)
        }
        const anyErrors = prop.some(p => validator.validate(p) instanceof Error)
        if (anyErrors) {
          return new TypeError(`${key} does not consist of the correct type`)
        }
      })
  },
  get bool() {
    return checkerFactory('boolean')
  },
  get func() {
    return checkerFactory('function')
  },
  get instanceOf() {
    return constructor =>
      checkerFactory((prop, key) => {
        if (!(prop instanceof constructor)) {
          /* eslint-disable prefer-reflect */
          const actualConstructorName = prop === null ? prop : Object.getPrototypeOf(prop).constructor.name
          const errorMsg = `Expected ${key} to be an instance of \`${constructor.name}\`, ` +
            `but got \`${actualConstructorName}\``
          return new TypeError(errorMsg)
        }
      })
  },
  get number() {
    return checkerFactory('number')
  },
  get object() {
    return checkerFactory('object')
  },
  get objectOf() {
    return validator =>
      checkerFactory((prop, key) => {
        const propKeys = Object.keys(prop)

        for (let i = 0; i < propKeys.length; i++) {
          const validatorResult = validator.validate(
            prop[propKeys[i]],
            `${key}.${propKeys[i]}`
          )

          if (validatorResult instanceof Error) {
            return validatorResult
          }
        }
      })
  },
  get oneOf() {
    return allowedValues =>
      checkerFactory((prop, key) => {
        const isAllowed = allowedValues.some(value => value === prop)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed values`)
        }
      })
  },
  get oneOfType() {
    return allowedTypes =>
      checkerFactory((prop, key) => {
        const isAllowed = !allowedTypes.every(type => type.validate(prop) instanceof Error)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed types`)
        }
      })
  },
  get shape() {
    return propsObj =>
      checkerFactory((prop, key) => {
        const validators = Object.keys(propsObj)

        for (let i = 0; i < validators.length; i++) {
          const validatorResult = propsObj[validators[i]].validate(
            prop[validators[i]],
            `${key}.${validators[i]}`
          )

          if (validatorResult instanceof Error) {
            return validatorResult
          }
        }
      })
  },
  get string() {
    return checkerFactory('string')
  }
}
