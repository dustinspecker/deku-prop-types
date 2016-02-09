import test from 'ava'

import {PropTypes, validate} from '../lib'

test('should validate any types', t => {
  const types = {
    age: PropTypes.any,
    name: PropTypes.any.isRequired
  }

  const props = {
    age: 75
  }

  t.is(types.age.validate(props.age, 'age'), undefined)
  const nameError = types.name.validate(props.name, 'name')
  t.ok(nameError instanceof Error)
  t.is(nameError.message, 'name is required')
})

test('should validate array types', t => {
  const types = {
    days: PropTypes.array,
    months: PropTypes.array.isRequired,
    ages: PropTypes.array
  }

  const props = {
    days: [1, 2, 3],
    ages: 3
  }

  t.is(types.days.validate(props.days, 'days'), undefined)
  const monthsError = types.months.validate(props.months, 'months')
  t.ok(monthsError instanceof Error)
  t.is(monthsError.message, 'months is required')
  const agesError = types.ages.validate(props.ages, 'ages')
  t.ok(agesError instanceof TypeError)
  t.is(agesError.message, 'Expected ages to be an `Array`, but got `number`')
})

test('should validate boolean types', t => {
  const types = {
    dead: PropTypes.bool,
    green: PropTypes.bool.isRequired,
    age: PropTypes.bool
  }

  const props = {
    dead: false,
    age: 25
  }

  t.is(types.dead.validate(props.dead, 'dead'), undefined)
  const greenError = types.green.validate(props.green, 'green')
  t.ok(greenError instanceof Error)
  t.is(greenError.message, 'green is required')
  const ageError = types.age.validate(props.age, 'age')
  t.ok(ageError instanceof TypeError)
  t.is(ageError.message, 'Expected age to be of type `boolean`, but got `number`')
})

test('should validate function types', t => {
  const types = {
    validator: PropTypes.func,
    encoder: PropTypes.func.isRequired
  }

  const props = {
    validator: () => 'hi'
  }

  t.is(types.validator.validate(props.validator, 'validator'), undefined)
  const encoderError = types.encoder.validate(props.encoder, 'encoder')
  t.ok(encoderError instanceof Error)
  t.is(encoderError.message, 'encoder is required')
})

test('should validate number types', t => {
  const types = {
    age: PropTypes.number,
    year: PropTypes.number,
    day: PropTypes.number.isRequired,
    week: PropTypes.number.isRequired,
    month: PropTypes.number
  }

  const props = {
    age: 25,
    year: '1990',
    week: 52
  }

  t.is(types.age.validate(props.age, 'age'), undefined)
  const yearError = types.year.validate(props.year, 'year')
  t.ok(yearError instanceof TypeError)
  t.is(yearError.message, 'Expected year to be of type `number`, but got `string`')
  const dayError = types.day.validate(props.day, 'day')
  t.ok(dayError instanceof Error)
  t.is(dayError.message, 'day is required')
  t.is(types.week.validate(props.week, 'week'), undefined)
  t.is(types.month.validate(props.month, 'month'), undefined)
})

test('should validate object types', t => {
  const types = {
    model: PropTypes.object,
    config: PropTypes.object.isRequired
  }

  const props = {
    model: {}
  }

  t.is(types.model.validate(props.model, 'model'), undefined)
  const configError = types.config.validate(props.config, 'config')
  t.ok(configError instanceof Error)
  t.is(configError.message, 'config is required')
})

test('should validate string types', t => {
  const types = {
    name: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string.isRequired,
    county: PropTypes.string.isRequired,
    sex: PropTypes.string
  }

  const props = {
    name: 'dustin',
    city: 3,
    county: 'ocean'
  }

  t.is(types.name.validate(props.name, 'name'), undefined)
  const cityError = types.city.validate(props.city, 'city')
  t.ok(cityError instanceof TypeError)
  t.is(cityError.message, 'Expected city to be of type `string`, but got `number`')
  t.is(types.county.validate(props.county, 'county'), undefined)
  t.is(types.sex.validate(props.sex, 'sex'), undefined)
})

test('should validate arrayOf', t => {
  const types = {
    names: PropTypes.arrayOf(PropTypes.string),
    ages: PropTypes.arrayOf(PropTypes.number),
    cities: PropTypes.arrayOf(PropTypes.string).isRequired,
    oceans: PropTypes.arrayOf(PropTypes.string),
    states: PropTypes.arrayOf(PropTypes.string)
  }

  const props = {
    names: ['abe', 'george', 'thomas'],
    oceans: [1, 2, 3],
    states: 'Missouri'
  }

  t.is(types.names.validate(props.names, 'names'), undefined)
  t.is(types.ages.validate(props.ages, 'ages'), undefined)
  const citiesError = types.cities.validate(props.cities, 'cities')
  t.ok(citiesError instanceof Error)
  t.is(citiesError.message, 'cities is required')
  const oceansError = types.oceans.validate(props.oceans, 'oceans')
  t.ok(oceansError instanceof TypeError)
  t.is(oceansError.message, 'oceans does not consist of the correct type')
  const statesError = types.states.validate(props.states, 'states')
  t.ok(statesError instanceof TypeError)
  t.is(statesError.message, 'Expected states to be an `Array`, but got `string`')
})

test('should validate instanceOf', t => {
  const types = {
    error: PropTypes.instanceOf(Error),
    list: PropTypes.instanceOf(Array),
    name: PropTypes.instanceOf(String),
    dog: PropTypes.instanceOf(Object)
  }

  const props = {
    error: new Error('bad'),
    list: {},
    name: null,
    dog: undefined
  }

  t.is(types.error.validate(props.error, 'error'), undefined)
  const listError = types.list.validate(props.list, 'list')
  t.ok(listError instanceof TypeError)
  t.is(listError.message, 'Expected list to be an instance of `Array`, but got `Object`')
  const nameError = types.name.validate(props.name, 'name')
  t.ok(nameError instanceof TypeError)
  t.is(nameError.message, 'Expected name to be an instance of `String`, but got `null`')
  t.is(types.dog.validate(props.dog, 'dog'), undefined)
})

test('should validate objectOf', t => {
  const types = {
    ports: PropTypes.objectOf(PropTypes.number),
    names: PropTypes.objectOf(PropTypes.string)
  }

  const props = {
    ports: {
      http: 80,
      https: 443
    },
    names: {
      first: 'dustin',
      last: 3
    }
  }

  t.is(types.ports.validate(props.ports, 'ports'), undefined)
  const namesError = types.names.validate(props.names, 'names')
  t.ok(namesError instanceof TypeError)
  t.is(namesError.message, 'Expected names.last to be of type `string`, but got `number`')
})

test('should validate oneOf', t => {
  const types = {
    color: PropTypes.oneOf(['blue', 'red', 'green']),
    state: PropTypes.oneOf(['Alabama', 'Missouri', 'Utah'])
  }

  const props = {
    color: 'yellow',
    state: 'Missouri'
  }

  const colorError = types.color.validate(props.color, 'color')
  t.ok(colorError instanceof TypeError)
  t.is(colorError.message, 'Expected color to be `blue`, `red`, or `green`, but got `yellow`')
  t.is(types.state.validate(props.state, 'state'), undefined)
})

test('should validate oneOfType', t => {
  const types = {
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  const props = {
    color: [],
    age: 25
  }

  const colorError = types.color.validate(props.color, 'color')
  t.ok(colorError instanceof TypeError)
  t.is(colorError.message, 'Expected color to be `string` or `number`, but got `object`')
  t.is(types.age.validate(props.age, 'age'), undefined)
})

test('should validate shape', t => {
  const types = {
    config: PropTypes.shape({
      name: PropTypes.string,
      age: PropTypes.number
    }),
    options: PropTypes.shape({
      port: PropTypes.number,
      host: PropTypes.string
    })
  }

  const props = {
    config: {
      name: 'dustin',
      age: 25
    },
    options: {
      port: 8080,
      host: 3
    }
  }

  t.is(types.config.validate(props.config, 'config'), undefined)
  const optionsError = types.options.validate(props.options, 'options')
  t.ok(optionsError instanceof TypeError)
  t.is(optionsError.message, 'Expected options.host to be of type `string`, but got `number`')
})

test('should validate deep props', t => {
  const types = {
    person: PropTypes.shape({
      name: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string
      })
    }),
    options: PropTypes.shape({
      path: PropTypes.shape({
        host: PropTypes.string.isRequired,
        port: PropTypes.number
      })
    })
  }

  const props = {
    person: {
      name: {
        first: 'dustin',
        last: 25
      }
    },
    options: {
      path: {
        port: 80
      }
    }
  }

  const personNameError = types.person.validate(props.person, 'person')
  t.ok(personNameError instanceof TypeError)
  t.is(personNameError.message, 'Expected person.name.last to be of type `string`, but got `number`')
  const optionsPathError = types.options.validate(props.options, 'options')
  t.ok(optionsPathError instanceof Error)
  t.is(optionsPathError.message, 'options.path.host is required')
})

test('should validate props', t => {
  const types = {
    name: PropTypes.string,
    county: PropTypes.number.isRequired
  }

  const props = {
    name: 'dustin'
  }

  const component = model => model
  component.propTypes = types
  t.throws(() => validate(component)({props}), /county is required/)

  const objComponent = {
    propTypes: types,
    other: () => 3,
    render: model => model
  }
  t.throws(() => validate(objComponent).render({props}), /county is required/)
  t.is(objComponent.other(), 3)

  types.county = PropTypes.number
  t.same(validate(component)({props}), {props})
  t.same(validate(objComponent).render({props}), {props})
})

test('should validate props with custom validators', t => {
  const types = {
    name(props, propName) {
      if (props[propName].length !== 3) {
        return new Error('name is invalid')
      }
    }
  }

  const component = model => model
  component.propTypes = types

  const props = {
    name: 'hi'
  }

  t.throws(() => validate(component)({props}), /name is invalid/)

  props.name = 'hii'
  t.same(validate(component)({props}), {props})
})

test('should not perform validation when production env', t => {
  /* eslint-disable no-process-env */
  process.env.NODE_ENV = 'production'
  const props = {
    name: 3
  }

  const component = model => model
  component.propTypes = {
    name: PropTypes.string
  }

  t.doesNotThrow(() => validate(component)({props}))
})
