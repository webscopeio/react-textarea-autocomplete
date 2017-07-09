(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      [
        'exports',
        'babel-runtime/helpers/objectWithoutProperties',
        'babel-runtime/helpers/extends',
        'babel-runtime/regenerator',
        'babel-runtime/helpers/asyncToGenerator',
        'babel-runtime/helpers/classCallCheck',
        'babel-runtime/helpers/createClass',
        'babel-runtime/helpers/possibleConstructorReturn',
        'babel-runtime/helpers/inherits',
        'babel-runtime/helpers/typeof',
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
      require('babel-runtime/helpers/objectWithoutProperties'),
      require('babel-runtime/helpers/extends'),
      require('babel-runtime/regenerator'),
      require('babel-runtime/helpers/asyncToGenerator'),
      require('babel-runtime/helpers/classCallCheck'),
      require('babel-runtime/helpers/createClass'),
      require('babel-runtime/helpers/possibleConstructorReturn'),
      require('babel-runtime/helpers/inherits'),
      require('babel-runtime/helpers/typeof'),
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
      global.objectWithoutProperties,
      global._extends,
      global.regenerator,
      global.asyncToGenerator,
      global.classCallCheck,
      global.createClass,
      global.possibleConstructorReturn,
      global.inherits,
      global._typeof,
      global.react,
      global.propTypes,
      global.textareaCaret,
      global.classnames,
      global.style,
    );
    global.index = mod.exports;
  }
})(this, function(
  exports,
  _objectWithoutProperties2,
  _extends2,
  _regenerator,
  _asyncToGenerator2,
  _classCallCheck2,
  _createClass2,
  _possibleConstructorReturn2,
  _inherits2,
  _typeof2,
  _react,
  _propTypes,
  _textareaCaret,
  _classnames,
) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true,
  });

  var _objectWithoutProperties3 = _interopRequireDefault(
    _objectWithoutProperties2,
  );

  var _extends3 = _interopRequireDefault(_extends2);

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _possibleConstructorReturn3 = _interopRequireDefault(
    _possibleConstructorReturn2,
  );

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _typeof3 = _interopRequireDefault(_typeof2);

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
        (typeof keyCode === 'undefined'
          ? 'undefined'
          : (0, _typeof3.default)(keyCode)) !== 'object'
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
    (0, _inherits3.default)(Item, _React$Component);

    function Item() {
      var _ref2;

      var _temp, _this, _ret;

      (0, _classCallCheck3.default)(this, Item);

      for (
        var _len = arguments.length, args = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      return (_ret = (
        (_temp = (
          (_this = (0, _possibleConstructorReturn3.default)(
            this,
            (_ref2 = Item.__proto__ || Object.getPrototypeOf(Item)).call.apply(
              _ref2,
              [this].concat(args),
            ),
          )),
          _this
        )),
        (_this.onMouseEnterHandler = function() {
          var _this$props = _this.props,
            item = _this$props.item,
            onMouseEnterHandler = _this$props.onMouseEnterHandler;

          onMouseEnterHandler(item);
        }),
        _temp
      )), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Item, [
      {
        key: 'render',
        value: function render() {
          var _props = this.props,
            Component = _props.component,
            onMouseEnterHandler = _props.onMouseEnterHandler,
            onClickHandler = _props.onClickHandler,
            item = _props.item,
            selected = _props.selected;

          return _react2.default.createElement(
            'li',
            {
              className: (0, _classnames2.default)('rta__item', {
                'rta__item--selected': selected,
              }),
              onClick: onClickHandler,
              onMouseEnter: this.onMouseEnterHandler,
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
    (0, _inherits3.default)(List, _React$PureComponent);

    function List() {
      (0, _classCallCheck3.default)(this, List);

      var _this2 = (0, _possibleConstructorReturn3.default)(
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

        var values = _this2.props.values;

        _this2.modifyText(values[_this2.getPositionInList()]);
      };

      _this2.modifyText = function(value) {
        var _this2$props = _this2.props,
          onSelect = _this2$props.onSelect,
          getTextToReplace = _this2$props.getTextToReplace;

        onSelect(getTextToReplace(value));
      };

      _this2.selectItem = function(item) {
        _this2.setState({ selectedItem: item });
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

    (0, _createClass3.default)(List, [
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
                onClickHandler: _this3.onPressEnter,
                onMouseEnterHandler: _this3.selectItem,
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
    (0, _inherits3.default)(ReactTextareaAutocomplete, _React$Component2);

    function ReactTextareaAutocomplete() {
      var _ref3,
        _this5 = this;

      var _temp2, _this4, _ret2;

      (0, _classCallCheck3.default)(this, ReactTextareaAutocomplete);

      for (
        var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }

      return (_ret2 = (
        (_temp2 = (
          (_this4 = (0, _possibleConstructorReturn3.default)(
            this,
            (_ref3 =
              ReactTextareaAutocomplete.__proto__ ||
              Object.getPrototypeOf(ReactTextareaAutocomplete)).call.apply(
              _ref3,
              [this].concat(args),
            ),
          )),
          _this4
        )),
        (_this4.update = function(prevProps) {
          var trigger = _this4.props.trigger;

          _this4.tokenRegExp = new RegExp(
            '[' + Object.keys(trigger).join('') + ']\\w*$',
          );
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
          var _this4$props = _this4.props,
            trigger = _this4$props.trigger,
            onChange = _this4$props.onChange;

          var textarea = e.target;
          var selectionEnd = textarea.selectionEnd,
            selectionStart = textarea.selectionStart;

          var value = textarea.value;

          if (onChange) {
            e.persist();
            onChange(e);
          }

          _this4.setState({
            value: value,
          });

          var tokenMatch = _this4.tokenRegExp.exec(
            value.slice(0, selectionEnd),
          );
          var lastToken = tokenMatch && tokenMatch[0];

          /*
         if we lost the trigger token or there is no following character we want to close
         the autocomplete
        */
          if (!lastToken || lastToken.length <= 1) {
            _this4.closeAutocomplete();
            return;
          }

          var triggerChars = Object.keys(trigger);

          var currentTrigger =
            (lastToken &&
              triggerChars.find(function(a) {
                return a === lastToken[0];
              })) ||
            null;

          var actualToken = lastToken.slice(1);

          // if trigger is not configured step out from the function, otherwise proceed
          if (!currentTrigger) {
            return;
          }

          /* 
          JSDOM has some issue with getComputedStyles which is called by getCaretCoordinates
          so this try - catch is walk-around for Jest 
        */
          try {
            var _getCaretCoordinates = (0, _textareaCaret2.default)(
                textarea,
                selectionEnd,
              ),
              top = _getCaretCoordinates.top,
              left = _getCaretCoordinates.left;

            _this4.setState({ top: top, left: left });
          } catch (e) {
            console.warn(
              'RTA: failed to get caret coordinates. This is not a browser?',
            );
          }

          _this4.setState(
            {
              selectionEnd: selectionEnd,
              selectionStart: selectionStart,
              currentTrigger: currentTrigger,
              actualToken: actualToken,
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
              (typeof item === 'undefined'
                ? 'undefined'
                : (0, _typeof3.default)(item)) === 'object'
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
          _this4.setState({ data: null, currentTrigger: null });
        }),
        (_this4.onSelect = function(newToken) {
          var _this4$state = _this4.state,
            actualToken = _this4$state.actualToken,
            selectionEnd = _this4$state.selectionEnd,
            selectionStart = _this4$state.selectionStart,
            textareaValue = _this4$state.value;

          var offsetToEndOfToken = 0;
          while (
            textareaValue[selectionEnd + offsetToEndOfToken] &&
            /\S/.test(textareaValue[selectionEnd + offsetToEndOfToken])
          ) {
            offsetToEndOfToken++;
          }

          var textToModify = textareaValue.slice(
            0,
            selectionEnd + offsetToEndOfToken,
          );

          var startOfTokenPosition = textToModify.search(/\S*$/);
          var newCaretPosition = startOfTokenPosition + newToken.length;
          var modifiedText =
            textToModify.substring(0, startOfTokenPosition) + newToken;

          // set the new textarea value and after that set the caret back to its position
          _this4.setState(
            {
              value: textareaValue.replace(textToModify, modifiedText),
            },
            function() {
              return _this4.setTextareaCaret(newCaretPosition);
            },
          );
          _this4.closeAutocomplete();
        }),
        (_this4.setTextareaCaret = function() {
          var position =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0;

          _this4.textareaRef.setSelectionRange(position, position);
        }),
        (_this4.getCurrentTriggerSettings = function() {
          return _this4.props.trigger[_this4.state.currentTrigger];
        }),
        (_this4.getValuesFromProvider = (0, _asyncToGenerator3.default)(
          _regenerator2.default.mark(function _callee() {
            var _this4$state2,
              currentTrigger,
              actualToken,
              _this4$getCurrentTrig2,
              dataProvider,
              component,
              providedData;

            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      (_this4$state2 = _this4.state), (currentTrigger =
                        _this4$state2.currentTrigger), (actualToken =
                        _this4$state2.actualToken);

                      if (currentTrigger) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt('return');

                    case 3:
                      (_this4$getCurrentTrig2 = _this4.getCurrentTriggerSettings()), (dataProvider =
                        _this4$getCurrentTrig2.dataProvider), (component =
                        _this4$getCurrentTrig2.component);

                      if (typeof dataProvider !== 'function') {
                        new Error(
                          'RTA: Trigger provider has to be a function!',
                        );
                      }

                      _this4.setState({
                        dataLoading: true,
                        data: null,
                      });

                      providedData = dataProvider(actualToken);

                      if (!(providedData instanceof Promise)) {
                        _context.next = 11;
                        break;
                      }

                      _context.next = 10;
                      return dataProvider(actualToken);

                    case 10:
                      providedData = _context.sent;

                    case 11:
                      if (
                        (typeof dataProvider === 'undefined'
                          ? 'undefined'
                          : (0, _typeof3.default)(dataProvider)) !== 'object'
                      ) {
                        new Error(
                          'RTA: Trigger provider has to provide an array!',
                        );
                      }

                      _this4.setState({
                        dataLoading: false,
                        data: providedData,
                        component: component,
                      });

                    case 13:
                    case 'end':
                      return _context.stop();
                  }
                }
              },
              _callee,
              _this5,
            );
          }),
        )),
        (_this4.cleanUpProps = function() {
          var props = (0, _extends3.default)({}, _this4.props);
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
        _temp2
      )), (0, _possibleConstructorReturn3.default)(_this4, _ret2);
    }

    (0, _createClass3.default)(ReactTextareaAutocomplete, [
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
          var _this6 = this;

          var _props4 = this.props,
            Loader = _props4.loadingComponent,
            otherProps = (0, _objectWithoutProperties3.default)(_props4, [
              'loadingComponent',
            ]);
          var _state = this.state,
            left = _state.left,
            top = _state.top,
            currentTrigger = _state.currentTrigger,
            dataLoading = _state.dataLoading,
            component = _state.component,
            value = _state.value;

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
              (0, _extends3.default)(
                {
                  ref: function ref(_ref5) {
                    return (_this6.textareaRef = _ref5);
                  },
                  className: 'rta__textarea ' + (otherProps['className'] || ''),
                  onChange: this.changeHandler,
                  value: value,
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
