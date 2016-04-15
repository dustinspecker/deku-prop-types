/**
 * Warns of missing propTypes
 * @param {Object} propTypes - an object with values being checkers
 * @param {Object} props - an object to check for missing propTypes
 * @param {Number} warningLevel - should warn/error when missing propType discovered
 *  0 - do not warn
 *  1 - console.warn
 *  2 - throw Error
 * @throws {Error} - if warningLevel is 2 and missing propType discovered
 */
const warnOfMissingPropTypes = (propTypes, props, warningLevel) => {
  if (!warningLevel) {
    return
  }

  const propTypeKeys = Object.keys(propTypes)
  const propsKeys = Object.keys(props)

  propsKeys
    .filter(prop => propTypeKeys.indexOf(prop) === -1)
    .forEach(missingProp => {
      const msg = `Missing \`${missingProp}\` propType`

      if (warningLevel === 1) {
        console.warn(msg)
      }

      if (warningLevel === 2) {
        throw new Error(msg)
      }
    })
}

/**
 * Determine if the props are valid
 * @param {Object} propTypes - an object with values being checkers
 * @param {Object} props - an object to check for validity
 * @throws {Error} - if a prop is invalid
 */
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

/**
 * Transform a component into a component with prop validation
 * @param {Function|Object} component - the component to add validation to
 * @param {Number} [warningLevel=1] - should warn when missing propType discovered
 * @return {Function|Object} -the modified component with validation added
 */
module.exports = (component, warningLevel = 1) => {
  /* eslint-disable no-process-env */
  if (process.env.NODE_ENV === 'production') {
    return component
  }

  if (typeof component === 'function') {
    return model => {
      warnOfMissingPropTypes(component.propTypes, model.props, warningLevel)
      validate(component.propTypes, model.props)

      return component(model)
    }
  }

  // create render function that validates and calls original render fn
  const transformedComponent = {
    render(model) {
      warnOfMissingPropTypes(component.propTypes, model.props, warningLevel)
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
