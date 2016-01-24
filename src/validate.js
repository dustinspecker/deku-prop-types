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
 * @return {Function|Object} -the modified component with validation added
 */
module.exports = component => {
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
