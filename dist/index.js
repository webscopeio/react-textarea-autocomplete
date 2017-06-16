(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'textarea-caret', 'classnames', './style.css'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('textarea-caret'), require('classnames'), require('./style.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.textareaCaret, global.classnames, global.style);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _textareaCaret, _classnames) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _textareaCaret2 = _interopRequireDefault(_textareaCaret);

  var _classnames2 = _interopRequireDefault(_classnames);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // todo Flow

  var KEY_CODES = {
    ESC: 27,
    UP: 38,
    DOWN: 40,
    ENTER: 13
  };

  // very cool, I should open-source it, indeed
  var Listeners = function () {
    var i = 0;
    var listeners = {};

    var f = function f(keyCode, fn, e) {
      var code = e.keyCode || e.which;
      if ((typeof keyCode === 'undefined' ? 'undefined' : _typeof(keyCode)) !== 'object') keyCode = [keyCode];
      if (keyCode.includes(code) && Object.values(listeners).find(function (_ref) {
        var triggerKeyCode = _ref.keyCode;
        return triggerKeyCode === keyCode;
      })) return fn(e);
    };

    var addListener = function addListener(keyCode, fn) {
      listeners[i] = {
        keyCode: keyCode,
        fn: fn
      };

      document.addEventListener('keydown', function (e) {
        return f(keyCode, fn, e);
      });

      return i++;
    };

    var removeListener = function removeListener(id) {
      delete listeners[id];
      i--;
    };

    var removeAllListeners = function removeAllListeners() {
      document.removeEventListener('keydown', f);
    };

    return {
      add: addListener,
      remove: removeListener,
      removeAll: removeAllListeners
    };
  }();

  var Item = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
      _classCallCheck(this, Item);

      return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    _createClass(Item, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            Component = _props.component,
            item = _props.item,
            selected = _props.selected;

        return _react2.default.createElement(
          'li',
          { className: (0, _classnames2.default)('rta__item', { 'rta__item--selected': selected }), key: item },
          _react2.default.createElement(Component, { selected: selected, entity: item })
        );
      }
    }]);

    return Item;
  }(_react2.default.Component);

  var List = function (_React$PureComponent) {
    _inherits(List, _React$PureComponent);

    function List() {
      _classCallCheck(this, List);

      var _this2 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));

      _this2.state = {
        selected: null
      };

      _this2.getPositionInList = function () {
        var values = _this2.props.values;
        var selectedItem = _this2.state.selectedItem;

        return values.findIndex(function (a) {
          return _this2.getId(a) === _this2.getId(selectedItem);
        });
      };

      _this2.scroll = function (e) {
        var values = _this2.props.values;

        var code = e.keyCode || e.which;

        var oldPosition = _this2.getPositionInList();
        var newPosition = void 0;
        switch (code) {
          case KEY_CODES.DOWN:
            // down
            newPosition = oldPosition + 1;
            break;
          case KEY_CODES.UP:
            // up
            newPosition = oldPosition - 1;
            break;
          default:
            newPosition = oldPosition;
            break;
        }

        newPosition = (newPosition % values.length + values.length) % values.length;
        _this2.setState({ selectedItem: values[newPosition] });
      };

      _this2.onPressEnter = function (e) {
        var _this2$props = _this2.props,
            values = _this2$props.values,
            onSelect = _this2$props.onSelect;


        e.preventDefault();
        onSelect(_this2.getTextToReplace(values[_this2.getPositionInList()]));
      };

      _this2.getId = function (item) {
        return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.id : item;
      };

      _this2.getTextToReplace = function (item) {
        return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.text : item;
      };

      _this2.isSelected = function (item) {
        var selectedItem = _this2.state.selectedItem;

        return _this2.getId(selectedItem) === _this2.getId(item);
      };

      _this2.listeners = [];
      return _this2;
    }

    _createClass(List, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var values = this.props.values;


        this.setState({
          selectedItem: values[0]
        });

        this.listeners.push(Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll), Listeners.add([KEY_CODES.ENTER], this.onPressEnter));
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var listener = void 0;
        while (listener = this.listeners.pop()) {
          Listeners.remove(listener);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props2 = this.props,
            values = _props2.values,
            component = _props2.component;


        return _react2.default.createElement(
          'ul',
          { className: 'rta__list' },
          values.map(function (item) {
            return _react2.default.createElement(Item, {
              key: _this3.getId(item),
              selected: _this3.isSelected(item),
              item: item,
              component: component
            });
          })
        );
      }
    }]);

    return List;
  }(_react2.default.PureComponent);

  var ReactTextareaAutocomplete = function (_React$Component2) {
    _inherits(ReactTextareaAutocomplete, _React$Component2);

    function ReactTextareaAutocomplete() {
      var _ref2;

      var _temp, _this4, _ret;

      _classCallCheck(this, ReactTextareaAutocomplete);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this4 = _possibleConstructorReturn(this, (_ref2 = ReactTextareaAutocomplete.__proto__ || Object.getPrototypeOf(ReactTextareaAutocomplete)).call.apply(_ref2, [this].concat(args))), _this4), _this4.update = function () {
        var trigger = _this4.props.trigger;

        _this4.tokenRegExp = new RegExp('[' + Object.keys(trigger).join('') + ']\\w*$');
      }, _this4.state = {
        top: 0,
        left: 0,
        currentTrigger: false,
        actualToken: '',
        data: null,
        dataLoading: false
      }, _this4.changeHandler = function (e) {
        var trigger = _this4.props.trigger;


        var triggerChars = Object.keys(trigger);

        var target = e.target;
        var tokenMatch = _this4.tokenRegExp.exec(target.value.slice(0, target.selectionEnd));
        var lastToken = tokenMatch && tokenMatch[0];

        if (!lastToken || lastToken.length <= 1) {
          _this4.setState({
            data: null
          });
        }

        var currentTrigger = lastToken && triggerChars.find(function (a) {
          return a === lastToken[0];
        }) || null;

        if (!currentTrigger) {
          return;
        }

        var _getCaretCoordinates = (0, _textareaCaret2.default)(target, target.selectionEnd),
            top = _getCaretCoordinates.top,
            left = _getCaretCoordinates.left;

        _this4.setState({
          top: top,
          left: left,
          currentTrigger: currentTrigger,
          actualToken: lastToken && lastToken.slice(1)
        }, _this4.getValuesFromProvider);
      }, _this4.modifyCurrentToken = function (newToken) {
        var currentTrigger = _this4.state.currentTrigger;

        var _this4$getCurrentTrig = _this4.getCurrentTriggerSettings(),
            _this4$getCurrentTrig2 = _this4$getCurrentTrig.pair,
            pair = _this4$getCurrentTrig2 === undefined ? false : _this4$getCurrentTrig2;

        _this4.textareaRef.value = _this4.textareaRef.value.replace(_this4.tokenRegExp, '' + (currentTrigger + newToken) + (pair ? currentTrigger : ''));
        _this4.closeAutocomplete();
      }, _this4.closeAutocomplete = function () {
        _this4.setState({ currentTrigger: null });
      }, _this4.onSelect = function (newToken) {
        _this4.modifyCurrentToken(newToken);
        _this4.closeAutocomplete();
      }, _this4.getCurrentTriggerSettings = function () {
        return _this4.props.trigger[_this4.state.currentTrigger];
      }, _this4.getValuesFromProvider = function () {
        var _this4$state = _this4.state,
            currentTrigger = _this4$state.currentTrigger,
            actualToken = _this4$state.actualToken;


        if (!currentTrigger) {
          return;
        }

        var _this4$getCurrentTrig3 = _this4.getCurrentTriggerSettings(),
            dataProvider = _this4$getCurrentTrig3.dataProvider,
            component = _this4$getCurrentTrig3.component;

        if (typeof dataProvider !== 'function') {
          console.warn('Trigger provider has to be a function!');
        }

        _this4.setState({
          dataLoading: true,
          data: null
        });

        dataProvider(actualToken).then(function (data) {
          _this4.setState({
            dataLoading: false,
            data: data,
            component: component
          });
        });
      }, _temp), _possibleConstructorReturn(_this4, _ret);
    }

    _createClass(ReactTextareaAutocomplete, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.update();
        Listeners.add(KEY_CODES.ESC, this.closeAutocomplete);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        Listeners.removeAll();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.update();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this5 = this;

        var _state = this.state,
            left = _state.left,
            top = _state.top,
            currentTrigger = _state.currentTrigger,
            data = _state.data,
            dataLoading = _state.dataLoading,
            component = _state.component;


        return _react2.default.createElement(
          'div',
          { className: 'rta__wrapper' },
          _react2.default.createElement('textarea', {
            ref: function ref(_ref3) {
              return _this5.textareaRef = _ref3;
            },
            className: 'rta__textarea',
            onChange: this.changeHandler
          }),
          (dataLoading || currentTrigger && data) && _react2.default.createElement(
            'div',
            { style: { top: top, left: left }, className: 'rta__autocomplete' },
            dataLoading && _react2.default.createElement(
              'div',
              null,
              'Loading...'
            ),
            data && _react2.default.createElement(List, { values: data, component: component, onSelect: this.onSelect })
          )
        );
      }
    }]);

    return ReactTextareaAutocomplete;
  }(_react2.default.Component);

  exports.default = ReactTextareaAutocomplete;
});