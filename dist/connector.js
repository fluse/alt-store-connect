'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var eachObject = function eachObject(f, o) {
    o.forEach(function (from) {
        Object.keys(Object(from)).forEach(function (key) {
            f(key, from[key]);
        });
    });
};

var isFunction = function isFunction(x) {
    return typeof x === 'function';
};

var assign = function assign(target) {
    for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        source[_key - 1] = arguments[_key];
    }

    eachObject(function (key, value) {
        return target[key] = value;
    }, source);
    return target;
};

module.exports = function connectToStores(Spec) {
    var Component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Spec;


    // Check for required static methods.
    if (!isFunction(Spec.getStores)) {
        throw new Error('connectToStores() expects the wrapped component to have a static getStores() method');
    }

    if (!isFunction(Spec.getPropsFromStores)) {
        throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method');
    }

    if (typeof Spec.storeDidChange === 'undefined') {
        var storeDidChange = function storeDidChange() {}; // no-op
    } else if (!isFunction(Spec.storeDidChange)) {
        throw new Error('connectToStores() expects the storeDidChange() to be a function');
    } else {
        var storeDidChange = Spec.storeDidChange;
    }

    var StoreConnection = function (_React$PureComponent) {
        _inherits(StoreConnection, _React$PureComponent);

        function StoreConnection(props, context) {
            _classCallCheck(this, StoreConnection);

            var _this = _possibleConstructorReturn(this, (StoreConnection.__proto__ || Object.getPrototypeOf(StoreConnection)).call(this, props));

            _this.context = context;
            _this.state = Spec.getPropsFromStores(props, _this.context);

            _this.displayName = 'Stateful' + (Component.displayName || Component.name || 'Container');
            return _this;
        }

        _createClass(StoreConnection, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                this.setState(Spec.getPropsFromStores(nextProps, this.context));
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                var stores = Spec.getStores(this.props, this.context);

                this.storeListeners = stores.map(function (store) {
                    return store.listen(_this2.onChange.bind(_this2));
                });

                if (Spec.componentDidConnect) {
                    Spec.componentDidConnect(this.props, this.context);
                }
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.storeListeners.forEach(function (unlisten) {
                    return unlisten();
                });
            }
        }, {
            key: 'onChange',
            value: function onChange() {
                this.setState(Spec.getPropsFromStores(this.props, this.context));

                storeDidChange(this.state);
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(Component, assign({}, this.props, this.state));
            }
        }]);

        return StoreConnection;
    }(_react2.default.PureComponent);

    if (Component.contextTypes) {
        StoreConnection.contextTypes = Component.contextTypes;
    }

    return StoreConnection;
};
