import arrayJoinConjunction from 'array-join-conjunction'
import checkerFactory from 'checker-factory'

module.exports = {
  get any() {
    return checkerFactory(undefined, 'any')
  },
  get array() {
    return checkerFactory((prop, key) => {
      if (!Array.isArray(prop)) {
        const actualType = typeof prop

        return new TypeError(`Expected ${key} to be an \`Array\`, but got \`${actualType}\``)
      }
    }, 'array')
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
      }, 'arrayOf')
  },
  get bool() {
    return checkerFactory('boolean', 'bool')
  },
  get func() {
    return checkerFactory('function', 'function')
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
      }, 'instanceOf')
  },
  get number() {
    return checkerFactory('number', 'number')
  },
  get object() {
    return checkerFactory('object', 'object')
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
      }, 'objectOf')
  },
  get oneOf() {
    return allowedValues =>
      checkerFactory((prop, key) => {
        const isAllowed = allowedValues.some(value => value === prop)
        if (!isAllowed) {
          const valuesMsg = arrayJoinConjunction(allowedValues.map(v => `\`${v}\``), 'or')
          const errMsg = `Expected ${key} to be ${valuesMsg}, but got \`${prop}\``

          return new TypeError(errMsg)
        }
      }, 'oneOf')
  },
  get oneOfType() {
    return allowedTypes =>
      checkerFactory((prop, key) => {
        const isAllowed = !allowedTypes.every(type => type.validate(prop) instanceof Error)
        if (!isAllowed) {
          const typesMsg = arrayJoinConjunction(allowedTypes.map(t => `\`${t.name}\``), 'or')
          const errMsg = `Expected ${key} to be ${typesMsg}, but got \`${typeof prop}\``

          return new TypeError(errMsg)
        }
      }, 'oneOfType')
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
      }, 'shape')
  },
  get string() {
    return checkerFactory('string', 'string')
  }
}
