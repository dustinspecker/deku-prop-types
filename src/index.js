const checkerFactory = (name, validator) => ({
  get isRequired() {
    this.required = true
    return this
  },
  validate(prop, key) {
    if (this.required && prop === undefined) {
      throw new Error(`${key} is required`)
    }

    if (prop !== undefined) {
      if (typeof validator === 'string' && typeof prop !== validator ||
          typeof validator === 'function' && !validator(prop)) {
        throw new TypeError(`${key} should be of type \`${name}\``)
      }
    }

    return null
  }
})

module.exports.propTypes = {
  get any() {
    return checkerFactory('any', prop => prop !== undefined)
  },
  get array() {
    return checkerFactory('array', prop => Array.isArray(prop))
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
  get string() {
    return checkerFactory('string', 'string')
  }
}

const validate = (propTypes, props) => {
  Object.keys(propTypes).forEach(key => {
    if (typeof propTypes[key] === 'function') {
      propTypes[key](props, key)
    } else {
      propTypes[key].validate(props[key], key)
    }
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
