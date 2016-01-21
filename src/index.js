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
        return new TypeError(`${key} should be of type \`${name}\``)
      }

      if (typeof validator === 'function') {
        return validator(prop, key)
      }
    }

    return null
  }
})

module.exports.propTypes = {
  get any() {
    return checkerFactory('any', () => null)
  },
  get array() {
    return checkerFactory('array', (prop, key) => {
      if (!Array.isArray(prop)) {
        return new TypeError(`${key} should be of type \`array\``)
      }
      return null
    })
  },
  get arrayOf() {
    return validator =>
      checkerFactory('arrayOf', (prop, key) => {
        const anyErrors = prop.some(p => validator.validate(p) instanceof Error)
        if (anyErrors) {
          return new TypeError(`${key} does not consist of the correct type`)
        }

        return null
      })
  },
  get bool() {
    return checkerFactory('bool', 'boolean')
  },
  get func() {
    return checkerFactory('func', 'function')
  },
  get number() {
    return checkerFactory('number', 'number')
  },
  get object() {
    return checkerFactory('object', 'object')
  },
  get oneOf() {
    return allowedValues =>
      checkerFactory('oneOf', (prop, key) => {
        const isAllowed = allowedValues.some(value => value === prop)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed values`)
        }

        return null
      })
  },
  get oneOfType() {
    return allowedTypes =>
      checkerFactory('oneOfType', (prop, key) => {
        const isAllowed = !allowedTypes.every(type => type.validate(prop) instanceof Error)
        if (!isAllowed) {
          return new TypeError(`${key} is not one of the allowed types`)
        }

        return null
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

    return null
  })
}

module.exports.validate = component => {
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
