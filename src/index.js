const checkerFactory = (name, validator) => ({
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
        return new TypeError(`Expected ${key} to be of type \`${name}\`, but got \`${actualType}\``)
      }

      if (typeof validator === 'function') {
        return validator(prop, key)
      }
    }
  }
})

module.exports.propTypes = {
  get any() {
    return checkerFactory('any')
  },
  get array() {
    return checkerFactory('array', (prop, key) => {
      if (!Array.isArray(prop)) {
        const actualType = typeof prop
        return new TypeError(`Expected ${key} to be an \`Array\`, but got \`${actualType}\``)
      }
    })
  },
  get arrayOf() {
    return validator =>
      checkerFactory('arrayOf', (prop, key) => {
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
    return checkerFactory('bool', 'boolean')
  },
  get func() {
    return checkerFactory('func', 'function')
  },
  get instanceOf() {
    return constructor =>
      checkerFactory('instanceOf', (prop, key) => {
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
    return checkerFactory('number', 'number')
  },
  get object() {
    return checkerFactory('object', 'object')
  },
  get objectOf() {
    return validator =>
      checkerFactory('objectOf', (prop, key) => {
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
      checkerFactory('oneOf', (prop, key) => {
        const isAllowed = allowedValues.some(value => value === prop)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed values`)
        }
      })
  },
  get oneOfType() {
    return allowedTypes =>
      checkerFactory('oneOfType', (prop, key) => {
        const isAllowed = !allowedTypes.every(type => type.validate(prop) instanceof Error)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed types`)
        }
      })
  },
  get shape() {
    return propsObj =>
      checkerFactory('shape', (prop, key) => {
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
    return checkerFactory('string', 'string')
  }
}

const validate = (propTypes, props) => {
  Object.keys(propTypes).forEach(key => {
    let result
    if (typeof propTypes[key] === 'function') {
      result = propTypes[key](props, key)
    } else {
      result = propTypes[key].validate(props[key], key)
    }

    if (result instanceof Error) {
      throw result
    }
  })
}

module.exports.validate = component => {
  /* eslint-disable no-process-env */
  if (process.env.NODE_ENV === 'production') {
    return component
  }

  if (typeof component === 'function') {
    return model => {
      validate(component.propTypes, model.props)
      return component(model)
    }
  }

  // create render function that validates and calls original render fn
  const transformedComponent = {
    render(model) {
      validate(component.propTypes, model.props)
      return component.render(model)
    }
  }
  // copy original component's properties
  Object.keys(component).forEach(key => {
    if (key !== 'render') {
      transformedComponent[key] = component[key]
    }
  })
  return transformedComponent
}
