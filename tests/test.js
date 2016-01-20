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
  t.throws(() => types.name.validate(props.name, 'name'), /name is required/)
})

test('should validate array types', t => {
  const types = {
    days: propTypes.array,
    months: propTypes.array.isRequired
  }

  const props = {
    days: [1, 2, 3]
  }

  t.is(types.days.validate(props.days, 'days'), null)
  t.throws(() => types.months.validate(props.months, 'months'), /months is required/)
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
  t.throws(() => types.green.validate(props.green, 'green'), /green is required/)
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
  t.throws(() => types.encoder.validate(props.encoder, 'encoder'), /encoder is required/)
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
  t.throws(() => types.year.validate(props.year, 'year'), /year should be of type `number`/)
  t.throws(() => types.day.validate(props.day, 'day'), /day is required/)
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
  t.throws(() => types.config.validate(props.config, 'config'), /config is required/)
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
  t.throws(() => types.city.validate(props.city, 'city'), /city should be of type `string`/)
  t.throws(() => types.state.validate(props.state, 'state'), /state is required/)
  t.is(types.county.validate(props.county, 'county'), null)
  t.is(types.sex.validate(props.sex, 'sex'), null)
})

test('should validate arrayOf', t => {
  const types = {
    names: propTypes.arrayOf(propTypes.string),
    ages: propTypes.arrayOf(propTypes.number),
    cities: propTypes.arrayOf(propTypes.string).isRequired
  }

  const props = {
    names: ['abe', 'george', 'thomas']
  }

  t.is(types.names.validate(props.names, 'names'), null)
  t.is(types.ages.validate(props.ages, 'ages'), null)
  t.throws(() => types.cities.validate(props.cities, 'cities'), /cities is required/)
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
        throw new Error('name is invalid')
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
