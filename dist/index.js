(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      [
        'exports',
        'react',
        'prop-types',
        'textarea-caret',
        'classnames',
        './style.css',
      ],
      factory,
    );
  } else if (typeof exports !== 'undefined') {
    factory(
      exports,
      require('react'),
      require('prop-types'),
      require('textarea-caret'),
      require('classnames'),
      require('./style.css'),
    );
  } else {
    var mod = {
      exports: {},
    };
    factory(
      mod.exports,
      global.react,
      global.propTypes,
      global.textareaCaret,
      global.classnames,
      global.style,
    );
    global.index = mod.exports;
  }
})(this, function(exports, _react, _propTypes, _textareaCaret, _classnames) {
  'use strict';
  Object.defineProperty(exports, '__esModule', {
    value: true,
  });

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  var _textareaCaret2 = _interopRequireDefault(_textareaCaret);

  var _classnames2 = _interopRequireDefault(_classnames);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj,
        };
  }

  function _objectWithoutProperties(obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  }

  var _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    }

    return call && (typeof call === 'object' || typeof call === 'function')
      ? call
      : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError(
        'Super expression must either be null or a function, not ' +
          typeof superClass,
      );
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
    if (superClass)
      Object.setPrototypeOf
        ? Object.setPrototypeOf(subClass, superClass)
        : (subClass.__proto__ = superClass);
  }

  var _typeof = typeof Symbol === 'function' &&
    typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

  var KEY_CODES = {
    ESC: 27,
    UP: 38,
    DOWN: 40,
    ENTER: 13,
  };

  var Listeners = (function() {
    var i = 0;
    var listeners = {};

    var f = function f(keyCode, fn, e) {
      var code = e.keyCode || e.which;
      if (
        (typeof keyCode === 'undefined' ? 'undefined' : _typeof(keyCode)) !==
        'object'
      )
        keyCode = [keyCode];
      if (
        keyCode.includes(code) &&
        Object.values(listeners).find(function(_ref) {
          var triggerKeyCode = _ref.keyCode;
          return triggerKeyCode === keyCode;
        })
      )
        return fn(e);
    };

    var addListener = function addListener(keyCode, fn) {
      listeners[i] = {
        keyCode: keyCode,
        fn: fn,
      };

      document.addEventListener('keydown', function(e) {
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
      removeAll: removeAllListeners,
    };
  })();

  var Item = (function(_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
      _classCallCheck(this, Item);

      return _possibleConstructorReturn(
        this,
        (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments),
      );
    }

    _createClass(Item, [
      {
        key: 'render',
        value: function render() {
          var _props = this.props,
            Component = _props.component,
            item = _props.item,
            selected = _props.selected;

          return _react2.default.createElement(
            'li',
            {
              className: (0, _classnames2.default)('rta__item', {
                'rta__item--selected': selected,
              }),
            },
            _react2.default.createElement(Component, {
              selected: selected,
              entity: item,
            }),
          );
        },
      },
    ]);

    return Item;
  })(_react2.default.Component);

  var List = (function(_React$PureComponent) {
    _inherits(List, _React$PureComponent);

    function List() {
      _classCallCheck(this, List);

      var _this2 = _possibleConstructorReturn(
        this,
        (List.__proto__ || Object.getPrototypeOf(List)).call(this),
      );

      _this2.state = {
        selected: null,
      };

      _this2.getPositionInList = function() {
        var values = _this2.props.values;
        var selectedItem = _this2.state.selectedItem;

        return values.findIndex(function(a) {
          return _this2.getId(a) === _this2.getId(selectedItem);
        });
      };

      _this2.scroll = function(e) {
        e.preventDefault();

        var values = _this2.props.values;

        var code = e.keyCode || e.which;

        var oldPosition = _this2.getPositionInList();
        var newPosition = void 0;
        switch (code) {
          case KEY_CODES.DOWN:
            newPosition = oldPosition + 1;
            break;
          case KEY_CODES.UP:
            newPosition = oldPosition - 1;
            break;
          default:
            newPosition = oldPosition;
            break;
        }

        newPosition =
          (newPosition % values.length + values.length) % values.length;
        _this2.setState({ selectedItem: values[newPosition] });
      };

      _this2.onPressEnter = function(e) {
        e.preventDefault();

        var _this2$props = _this2.props,
          values = _this2$props.values,
          onSelect = _this2$props.onSelect,
          getTextToReplace = _this2$props.getTextToReplace;

        e.preventDefault();
        onSelect(getTextToReplace(values[_this2.getPositionInList()]));
      };

      _this2.getId = function(item) {
        return _this2.props.getTextToReplace(item);
      };

      _this2.isSelected = function(item) {
        var selectedItem = _this2.state.selectedItem;

        return _this2.getId(selectedItem) === _this2.getId(item);
      };

      _this2.listeners = [];
      return _this2;
    }

    _createClass(List, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var values = this.props.values;

          this.setState({
            selectedItem: values[0],
          });

          this.listeners.push(
            Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll),
            Listeners.add([KEY_CODES.ENTER], this.onPressEnter),
          );
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var listener = void 0;
          while ((listener = this.listeners.pop())) {
            Listeners.remove(listener);
          }
        },
      },
      {
        key: 'render',
        value: function render() {
          var _this3 = this;

          var _props2 = this.props,
            values = _props2.values,
            component = _props2.component;

          return _react2.default.createElement(
            'ul',
            { className: 'rta__list' },
            values.map(function(item) {
              return _react2.default.createElement(Item, {
                key: _this3.getId(item),
                selected: _this3.isSelected(item),
                item: item,
                component: component,
              });
            }),
          );
        },
      },
    ]);

    return List;
  })(_react2.default.PureComponent);

  var ReactTextareaAutocomplete = (function(_React$Component2) {
    _inherits(ReactTextareaAutocomplete, _React$Component2);

    function ReactTextareaAutocomplete() {
      var _ref2;

      var _temp, _this4, _ret;

      _classCallCheck(this, ReactTextareaAutocomplete);

      for (
        var _len = arguments.length, args = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      return (_ret = (
        (_temp = (
          (_this4 = _possibleConstructorReturn(
            this,
            (_ref2 =
              ReactTextareaAutocomplete.__proto__ ||
              Object.getPrototypeOf(ReactTextareaAutocomplete)).call.apply(
              _ref2,
              [this].concat(args),
            ),
          )),
          _this4
        )),
        (_this4.update = function(prevProps) {
          var _this4$props = _this4.props,
            trigger = _this4$props.trigger,
            newValue = _this4$props.value;
          var value = _this4.state.value;

          _this4.tokenRegExp = new RegExp(
            '[' + Object.keys(trigger).join('') + ']\\w*$',
          );

          if (!prevProps) return;

          if (value !== newValue) {
            _this4.textareaRef.value = newValue;
            _this4.setState({ value: newValue });
          }
        }),
        (_this4.state = {
          top: 0,
          left: 0,
          currentTrigger: false,
          actualToken: '',
          data: null,
          value: '',
          dataLoading: false,
        }),
        (_this4.changeHandler = function(e) {
          var _this4$props2 = _this4.props,
            trigger = _this4$props2.trigger,
            onChange = _this4$props2.onChange;

          if (onChange) {
            e.persist();
            onChange(e);
          }

          var triggerChars = Object.keys(trigger);

          var target = e.target;
          var tokenMatch = _this4.tokenRegExp.exec(
            target.value.slice(0, target.selectionEnd),
          );
          var lastToken = tokenMatch && tokenMatch[0];

          if (!lastToken || lastToken.length <= 1) {
            _this4.setState({
              data: null,
            });
          }

          var currentTrigger =
            (lastToken &&
              triggerChars.find(function(a) {
                return a === lastToken[0];
              })) ||
            null;

          if (!currentTrigger) {
            return;
          }

          var _getCaretCoordinates = (0, _textareaCaret2.default)(
            target,
            target.selectionEnd,
          ),
            top = _getCaretCoordinates.top,
            left = _getCaretCoordinates.left;

          _this4.setState(
            {
              top: top,
              left: left,
              selectionEnd: target.selectionEnd,
              selectionStart: target.selectionStart,
              currentTrigger: currentTrigger,
              actualToken: lastToken && lastToken.slice(1),
            },
            _this4.getValuesFromProvider,
          );
        }),
        (_this4.getTextToReplace = function() {
          var _this4$getCurrentTrig = _this4.getCurrentTriggerSettings(),
            output = _this4$getCurrentTrig.output;

          var currentTrigger = _this4.state.currentTrigger;

          return function(item) {
            if (
              (typeof item === 'undefined' ? 'undefined' : _typeof(item)) ===
              'object'
            ) {
              if (!output || typeof output !== 'function') {
                throw new Error('RTA: Output function is not defined!');
              }

              return output(item, currentTrigger);
            }

            return currentTrigger + item;
          };
        }),
        (_this4.closeAutocomplete = function() {
          _this4.setState({ currentTrigger: null });
        }),
        (_this4.onSelect = function(newToken) {
          var _this4$state = _this4.state,
            actualToken = _this4$state.actualToken,
            selectionEnd = _this4$state.selectionEnd,
            selectionStart = _this4$state.selectionStart;

          var offsetToEndOfToken = 0;
          var textareaValue = _this4.textareaRef.value;
          while (
            textareaValue[selectionEnd + offsetToEndOfToken] &&
            textareaValue[selectionEnd + offsetToEndOfToken] !== ' '
          ) {
            offsetToEndOfToken++;
          }

          var textToModify = textareaValue.slice(
            0,
            selectionEnd + offsetToEndOfToken,
          );
          var modifiedText =
            textToModify.substring(0, textToModify.lastIndexOf(' ')) +
            ' ' +
            newToken;

          _this4.textareaRef.value = textareaValue.replace(
            textToModify,
            modifiedText,
          );
          _this4.closeAutocomplete();
        }),
        (_this4.getCurrentTriggerSettings = function() {
          return _this4.props.trigger[_this4.state.currentTrigger];
        }),
        (_this4.getValuesFromProvider = function() {
          var _this4$state2 = _this4.state,
            currentTrigger = _this4$state2.currentTrigger,
            actualToken = _this4$state2.actualToken;

          if (!currentTrigger) {
            return;
          }

          var _this4$getCurrentTrig2 = _this4.getCurrentTriggerSettings(),
            dataProvider = _this4$getCurrentTrig2.dataProvider,
            component = _this4$getCurrentTrig2.component;

          if (typeof dataProvider !== 'function') {
            new Error('RTA: Trigger provider has to be a function!');
          }

          _this4.setState({
            dataLoading: true,
            data: null,
          });

          dataProvider(actualToken).then(function(data) {
            _this4.setState({
              dataLoading: false,
              data: data,
              component: component,
            });
          });
        }),
        (_this4.cleanUpProps = function() {
          var props = _extends({}, _this4.props);
          var notSafe = [
            'loadingComponent',
            'ref',
            'onChange',
            'className',
            'value',
            'trigger',
          ];

          for (var prop in props) {
            if (notSafe.includes(prop)) delete props[prop];
          }

          return props;
        }),
        (_this4.getSuggestions = function() {
          var _this4$state3 = _this4.state,
            currentTrigger = _this4$state3.currentTrigger,
            data = _this4$state3.data;

          if (!currentTrigger || !data || (data && !data.length)) return null;

          return data;
        }),
        _temp
      )), _possibleConstructorReturn(_this4, _ret);
    }

    _createClass(ReactTextareaAutocomplete, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.update(this.props);
          Listeners.add(KEY_CODES.ESC, this.closeAutocomplete);

          var _props3 = this.props,
            loadingComponent = _props3.loadingComponent,
            trigger = _props3.trigger;

          if (!loadingComponent) {
            throw new Error('RTA: loadingComponent is not defined');
          }

          if (!trigger) {
            throw new Error('RTA: trigger is not defined');
          }
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          Listeners.removeAll();
        },
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
          this.update(prevProps, prevState);
        },
      },
      {
        key: 'render',
        value: function render() {
          var _this5 = this;

          var _props4 = this.props,
            Loader = _props4.loadingComponent,
            otherProps = _objectWithoutProperties(_props4, [
              'loadingComponent',
            ]);

          var _state = this.state,
            left = _state.left,
            top = _state.top,
            currentTrigger = _state.currentTrigger,
            dataLoading = _state.dataLoading,
            component = _state.component;

          var suggestionData = this.getSuggestions();

          return _react2.default.createElement(
            'div',
            {
              className: (0, _classnames2.default)('rta', {
                'rta--loading': dataLoading,
              }),
            },
            _react2.default.createElement(
              'textarea',
              _extends(
                {
                  ref: function ref(_ref3) {
                    return (_this5.textareaRef = _ref3);
                  },
                  className: 'rta__textarea',
                  onChange: this.changeHandler,
                },
                this.cleanUpProps(otherProps),
              ),
            ),
            (dataLoading || suggestionData) &&
              _react2.default.createElement(
                'div',
                {
                  style: { top: top, left: left },
                  className: 'rta__autocomplete',
                },
                dataLoading &&
                  _react2.default.createElement(
                    'div',
                    { className: 'rta__loader' },
                    _react2.default.createElement(Loader, null),
                  ),
                suggestionData &&
                  _react2.default.createElement(List, {
                    values: suggestionData,
                    getTextToReplace: this.getTextToReplace(),
                    component: component,
                    onSelect: this.onSelect,
                  }),
              ),
          );
        },
      },
    ]);

    return ReactTextareaAutocomplete;
  })(_react2.default.Component);

  ReactTextareaAutocomplete.propTypes = {
    trigger: _propTypes2.default.object.isRequired,
    loadingComponent: _propTypes2.default.func.isRequired,
  };

  exports.default = ReactTextareaAutocomplete;
});
