import test from 'ava'

import {propTypes, validate} from '../lib'

test('should validate any types', t => {
  const types = {
    age: propTypes.any,
    name: propTypes.any.isRequired
  }

  const props = {
    age: 75
  }

  t.is(types.age.validate(props.age, 'age'), null)
  const nameError = types.name.validate(props.name, 'name')
  t.is(nameError.message, 'name is required')
})

test('should validate array types', t => {
  const types = {
    days: propTypes.array,
    months: propTypes.array.isRequired,
    ages: propTypes.array
  }

  const props = {
    days: [1, 2, 3],
    ages: 3
  }

  t.is(types.days.validate(props.days, 'days'), null)
  const monthsError = types.months.validate(props.months, 'months')
  t.is(monthsError.message, 'months is required')
  const agesError = types.ages.validate(props.ages, 'ages')
  t.is(agesError.message, 'ages should be of type `array`')
})

test('should validate boolean types', t => {
  const types = {
    dead: propTypes.bool,
    green: propTypes.bool.isRequired
  }

  const props = {
    dead: false
  }

  t.is(types.dead.validate(props.dead, 'dead'), null)
  const greenError = types.green.validate(props.green, 'green')
  t.is(greenError.message, 'green is required')
})

test('should validate function types', t => {
  const types = {
    validator: propTypes.func,
    encoder: propTypes.func.isRequired
  }

  const props = {
    validator: () => 'hi'
  }

  t.is(types.validator.validate(props.validator, 'validator'), null)
  const encoderError = types.encoder.validate(props.encoder, 'encoder')
  t.is(encoderError.message, 'encoder is required')
})

test('should validate number types', t => {
  const types = {
    age: propTypes.number,
    year: propTypes.number,
    day: propTypes.number.isRequired,
    week: propTypes.number.isRequired,
    month: propTypes.number
  }

  const props = {
    age: 25,
    year: '1990',
    week: 52
  }

  t.is(types.age.validate(props.age, 'age'), null)
  const yearError = types.year.validate(props.year, 'year')
  t.is(yearError.message, 'year should be of type `number`')
  const dayError = types.day.validate(props.day, 'day')
  t.is(dayError.message, 'day is required')
  t.is(types.week.validate(props.week, 'week'), null)
  t.is(types.month.validate(props.month, 'month'), null)
})

test('should validate object types', t => {
  const types = {
    model: propTypes.object,
    config: propTypes.object.isRequired
  }

  const props = {
    model: {}
  }

  t.is(types.model.validate(props.model, 'model'), null)
  const configError = types.config.validate(props.config, 'config')
  t.is(configError.message, 'config is required')
})

test('should validate string types', t => {
  const types = {
    name: propTypes.string,
    city: propTypes.string,
    state: propTypes.string.isRequired,
    county: propTypes.string.isRequired,
    sex: propTypes.string
  }

  const props = {
    name: 'dustin',
    city: 3,
    county: 'ocean'
  }

  t.is(types.name.validate(props.name, 'name'), null)
  const cityError = types.city.validate(props.city, 'city')
  t.ok(cityError instanceof Error)
  t.is(cityError.message, 'city should be of type `string`')
  t.is(types.county.validate(props.county, 'county'), null)
  t.is(types.sex.validate(props.sex, 'sex'), null)
})

test('should validate arrayOf', t => {
  const types = {
    names: propTypes.arrayOf(propTypes.string),
    ages: propTypes.arrayOf(propTypes.number),
    cities: propTypes.arrayOf(propTypes.string).isRequired,
    oceans: propTypes.arrayOf(propTypes.string),
    states: propTypes.arrayOf(propTypes.string)
  }

  const props = {
    names: ['abe', 'george', 'thomas'],
    oceans: [1, 2, 3],
    states: 'Missouri'
  }

  t.is(types.names.validate(props.names, 'names'), null)
  t.is(types.ages.validate(props.ages, 'ages'), null)
  const citiesError = types.cities.validate(props.cities, 'cities')
  t.is(citiesError.message, 'cities is required')
  const oceansError = types.oceans.validate(props.oceans, 'oceans')
  t.is(oceansError.message, 'oceans does not consist of the correct type')
  const statesError = types.states.validate(props.states, 'states')
  t.is(statesError.message, 'states is not an `Array`')
})

test('should validate instanceOf', t => {
  const types = {
    error: propTypes.instanceOf(Error),
    list: propTypes.instanceOf(Array)
  }

  const props = {
    error: new Error('bad'),
    list: 3
  }

  t.is(types.error.validate(props.error, 'error'), null)
  const listError = types.list.validate(props.list, 'list')
  t.is(listError.message, 'list is not an instance of `Array`')
})

test('should validate objectOf', t => {
  const types = {
    ports: propTypes.objectOf(propTypes.number),
    names: propTypes.objectOf(propTypes.string)
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

  t.is(types.ports.validate(props.ports, 'ports'), null)
  const namesError = types.names.validate(props.names, 'names')
  t.is(namesError.message, 'names does not consist of all properties with `string` values')
})

test('should validate oneOf', t => {
  const types = {
    color: propTypes.oneOf(['blue', 'red', 'green']),
    state: propTypes.oneOf(['Alabama', 'Missouri', 'Utah'])
  }

  const props = {
    color: 'yellow',
    state: 'Missouri'
  }

  const colorError = types.color.validate(props.color, 'color')
  t.is(colorError.message, 'color is not one of the allowed values')
  t.is(types.state.validate(props.state, 'state'), null)
})

test('should validate oneOfType', t => {
  const types = {
    color: propTypes.oneOfType([propTypes.string, propTypes.number]),
    age: propTypes.oneOfType([propTypes.string, propTypes.number])
  }

  const props = {
    color: [],
    age: 25
  }

  const colorError = types.color.validate(props.color, 'color')
  t.is(colorError.message, 'color is not one of the allowed types')
  t.is(types.age.validate(props.age, 'age'), null)
})

test('should validate shape', t => {
  const types = {
    config: propTypes.shape({
      name: propTypes.string,
      age: propTypes.number
    }),
    options: propTypes.shape({
      port: propTypes.number,
      host: propTypes.string
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

  t.is(types.config.validate(props.config, 'config'), null)
  const optionsError = types.options.validate(props.options, 'options')
  t.is(optionsError.message, 'options.host should be of type `string`')
})

test('should validate props', t => {
  const types = {
    name: propTypes.string,
    county: propTypes.number.isRequired
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

  types.county = propTypes.number
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
    name: propTypes.string
  }

  t.doesNotThrow(() => validate(component)({props}))
})
