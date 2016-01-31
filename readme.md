# deku-prop-types

[![NPM version](https://badge.fury.io/js/deku-prop-types.svg)](http://badge.fury.io/js/deku-prop-types) [![Build Status](https://travis-ci.org/dustinspecker/deku-prop-types.svg?branch=master)](https://travis-ci.org/dustinspecker/deku-prop-types) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/deku-prop-types.svg)](https://coveralls.io/r/dustinspecker/deku-prop-types?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/deku-prop-types/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/deku-prop-types) [![Dependencies](https://david-dm.org/dustinspecker/deku-prop-types.svg)](https://david-dm.org/dustinspecker/deku-prop-types/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/deku-prop-types/dev-status.svg)](https://david-dm.org/dustinspecker/deku-prop-types/#info=devDependencies&view=table)

> Prop type validation for [Deku](https://github.com/dekujs/deku) components

## Install

```bash
npm install --save deku-prop-types
```

## Notes

- Check out [deku-prop-types-immutable](https://github.com/dustinspecker/deku-prop-types-immutable) for additional Prop Type validations for [Immutable](https://facebook.github.io/immutable-js/)

## Usage

**Note: propType validations are not performed in production environments**

`function-component.jsx`
```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const Counter = ({props}) => <div>{props.count}</div>
Counter.propTypes = {
  count: PropTypes.number.isRequired
}

export default validate(Counter)
```

`object-component.jsx`
```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const Counter = {
  propTypes: {
    count: PropTypes.number.isRequired
  },
  render({props}) {
    return <div>{props.count}</div>
  }
}

export default validate(Counter)
```

## Supported types
### PropTypes.any
Validate prop is of any type (not undefined)
### PropTypes.array
Validate prop is an array

### PropTypes.arrayOf
Validate prop is an array consisting of a type

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const NamesList = ({props}) => <div>
  {props.names.map(name => <div>{name}</div>)}
</div>

NamesList.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string)
}

export default validate(NamesList)
```

### PropTypes.bool
Validate prop is a boolean
### PropTypes.func
Validate prop is a function

### PropTypes.instanceOf
Validate prop is an instance of a function or class

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const ItemList ({props}) => <div>
  {props.list.map(item => <div>{item}</div>)}
</div>

ItemList.propTypes = {
  list: PropTypes.instanceOf(Array)
}

export default validate(ItemList)
```

### PropTypes.number
Validate prop is a number
### PropTypes.object
Validate prop is an object

### PropTypes.objectOf
Validate prop has keys all matching an allowed type

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const NameCard = ({props}) => <div>{props.person.firstName + ' ' + props.person.lastName}</div>

NameCard.propTypes = {
  person: PropTypes.objectOf(PropTypes.string)
}

export default validate(NameCard)
```

### PropTypes.oneOf
Validate prop is one of the allowed values

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const Color = ({props}) => <div>{props.color}</div>

Color.propTypes = {
  color: PropTypes.oneOf(['red', 'green', 'blue'])
}

export default validate(Color)
```

### PropTypes.oneOfType
Validate prop is one of the allowed types

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const Age = ({props}) => <div>{props.age}</div>

Age.propTypes = {
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.number])
}

export default validate(Age)
```

### PropTypes.shape
Validate an object's properties are of a certain type

```jsx
import {element} from 'deku'
import {PropTypes, validate} from 'deku-prop-types'

const ConfigDisplay = ({props}) => <div>{props.config.port + ' ' + props.config.host}</div>

ConfigDisplay.propTypes = {
  config: PropTypes.shape({
    host: PropTypes.string,
    port: PropTypes.number
  })
}

export default validate(ConfigDisplay)
```

### PropTypes.string
Validate prop is a string


***Note: all PropTypes can be required by specifying `isRequired` like below:***

`PropTypes.number.isRequired`

## Custom Validators
A function may be passed instead of a propType.

```jsx
import {element} from 'deku'
import {validate} from 'deku-prop-types'

const Counter = ({props}) => <div>{props.count}</div>
Counter.propTypes = {
  count(props, propName) {
    if (props[propName] < 10) {
      return new Error('count must be less than 10')
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
