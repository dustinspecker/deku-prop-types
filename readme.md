# deku-prop-types

[![NPM version](https://badge.fury.io/js/deku-prop-types.svg)](http://badge.fury.io/js/deku-prop-types) [![Build Status](https://travis-ci.org/dustinspecker/deku-prop-types.svg?branch=master)](https://travis-ci.org/dustinspecker/deku-prop-types) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/deku-prop-types.svg)](https://coveralls.io/r/dustinspecker/deku-prop-types?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/deku-prop-types/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/deku-prop-types) [![Dependencies](https://david-dm.org/dustinspecker/deku-prop-types.svg)](https://david-dm.org/dustinspecker/deku-prop-types/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/deku-prop-types/dev-status.svg)](https://david-dm.org/dustinspecker/deku-prop-types/#info=devDependencies&view=table)

> Prop type validation for [Deku](https://github.com/dekujs/deku) components

## Install

```bash
npm install --save deku-prop-types
```

## Usage

`function-component.jsx`
```jsx
import {element} from 'deku'
import {propTypes, validate} from 'deku-prop-types'

const Counter = ({props}) => <div>{props.count}</div>
Count.propTypes = {
  count: propTypes.number.isRequired
}

export default validate(Counter)
```

`object-component.jsx`
```jsx
import {element} from 'deku'
import {propTypes, validate} from 'deku-prop-types'

const Counter = {
  propTypes: {
    count: propTypes.number.isRequired
  },
  render({props}) {
    return <div>{props.count}</div>
  }
}

export default validate(Counter)
```

## Supported types
### propTypes.any
Validate prop is of any type (not undefined)
### propTypes.array
Validate prop is an array

### propTypes.arrayOf
Validate prop is an array consisting of a type

```jsx
import {element} from 'deku'
import {validate} from 'deku-prop-types'

const NamesList = ({props}) => <div>
  {props.names.map(name => <div>{name}</div>)}
</div>

NamesList.propTypes = {
  names: propTypes.arrayOf(propTypes.string)
}

export default validate(NamesList)
```

### propTypes.bool
Validate prop is a boolean
### propTypes.func
Validate prop is a function
### propTypes.number
Validate prop is a number
### propTypes.object
Validate prop is an object
### propTypes.string
Validate prop is a string


***Note: all propTypes can be required by specifying `isRequired` like below:***

`propTypes.number.isRequired`

## Custom Validators
A function may be passed instead of a propType.

```jsx
import {element} from 'deku'
import {validate} from 'deku-prop-types'

const Counter = ({props}) => <div>{props.count}</div>
Counter.propTypes = {
  count(props, propName) {
    if (props[propName] < 10) {
      throw new Error('count must be less than 10')
    }
  }
}

export default validate(Counter)
```

## API
### validate(component)
#### component
type: `function` | `object`

Validate props passed to component match the specified type. An `Error` is thrown if a prop is not valid.

## License
MIT © [Dustin Specker](https://github.com/dustinspecker)
