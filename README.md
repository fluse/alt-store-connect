# Connecting components to Alt stores

## Install

```
npm install alt-store-connect --save
```

`connectToStores` wraps a React component and control its props with data coming from Alt stores.

This module supports React 16

Expects the Component to have two static methods:
- `getStores()`: Should return an array of stores.
- `getPropsFromStores(props)`: Should return the props from the stores.

## Usage Examples

### ES6 Class Higher Order Component

```js
import React from 'react';
import myStore from './stores/myStore';
import connectToStores from 'alt-connect-store';

class MyComponent extends React.Component {

    static getStores(props) {
        return [myStore];
    }

    static getPropsFromStores(props) {
        return myStore.getState();
    }

    render() {
        // Use this.props like normal...
    }
}

export default connectToStores(MyComponent);
```

### ES7 Decorator

```js

import React from 'react';
import myStore from './stores/myStore';
import connectToStores from 'alt-connect-store';

@connectToStores
class MyComponent extends React.Component {

    static getStores(props) {
        return [myStore];
    }

    static getPropsFromStores(props) {
        return myStore.getState();
    }

    render() {
        // Use this.props like normal...
    }
}
```
