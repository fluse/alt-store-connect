import React from 'react';
import isEqual from 'react-fast-compare';

const eachObject = (f, o) => {
    o.forEach((from) => {
        Object.keys(Object(from)).forEach((key) => {
            f(key, from[key])
        })
    })
}

const isFunction = (x) => {
    return typeof x === 'function'
}

const assign = (target, ...source) => {
    eachObject((key, value) => target[key] = value, source)
    return target
}

module.exports = function connectToStores(Spec, Component = Spec) {

    // Check for required static methods.
    if (!isFunction(Spec.getStores)) {
        throw new Error('connectToStores() expects the wrapped component to have a static getStores() method')
    }

    if (!isFunction(Spec.getPropsFromStores)) {
        throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method')
    }

    if (typeof Spec.storeDidChange === 'undefined') {
        var storeDidChange = (...args) => {} // no-op
    } else if (!isFunction(Spec.storeDidChange)) {
        throw new Error('connectToStores() expects the storeDidChange() to be a function')
    } else {
        var storeDidChange = Spec.storeDidChange
    }

    class StoreConnection extends React.Component {

        constructor(props, context) {
            super(props);

            this.context = context;
            this.state = Spec.getPropsFromStores(props, this.context);

            this.displayName = `Stateful${Component.displayName || Component.name || 'Container'}`;
        }

        shouldComponentUpdate(nextProps, nextState) {
            return !isEqual(this.props, nextProps)
        }

        componentDidUpdate(nextProps) {
            this.setState(Spec.getPropsFromStores(nextProps, this.context))
        }

        componentDidMount() {
            const stores = Spec.getStores(this.props, this.context)

            this.storeListeners = stores.map((store) => {
                return store.listen(this.onChange.bind(this))
            })

            if (Spec.componentDidConnect) {
                Spec.componentDidConnect(this.props, this.context)
            }
        }

        componentWillUnmount() {
            this.storeListeners.forEach(unlisten => unlisten())
        }

        onChange() {
            this.setState(
                Spec.getPropsFromStores(this.props, this.context)
            )

            storeDidChange(this.state)
        }

        render() {
            return React.createElement(
                Component,
                assign({}, this.props, this.state)
            )
        }
    }

    if (Component.contextTypes) {
        StoreConnection.contextTypes = Component.contextTypes
    }

    return StoreConnection
}
