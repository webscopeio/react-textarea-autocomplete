/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Jakub Beneš <benes@webscope.io>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ('object' !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
		// register as 'classnames', consistent with npm package name
		undefined('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());
});

var index$1 = createCommonjsModule(function (module) {
/* jshint browser: true */

(function () {

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if(!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if ( el ) { el.parentNode.removeChild(el); }
  }

  // mirrored div
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT')
    style.wordWrap = 'break-word';  // only for textarea-s

  // position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (element.nodeName === 'INPUT')
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // for inputs, just '.' would be enough, but why bother?
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

{
  module.exports = getCaretCoordinates;
}

}());
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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







var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
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
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13
};

// This is self-made key shortcuts manager, used for caching key strokes

var Listener = function Listener() {
  var _this = this;

  classCallCheck(this, Listener);

  this.add = function (keyCodes, fn) {
    var keyCode = keyCodes;

    if ((typeof keyCode === 'undefined' ? 'undefined' : _typeof(keyCode)) !== 'object') keyCode = [keyCode];

    _this.listeners[_this.index] = {
      keyCode: keyCode,
      fn: fn
    };

    return _this.index += 1;
  };

  this.remove = function (id) {
    delete _this.listeners[id];
    _this.index -= 1;
  };

  this.removeAll = function () {
    return document.removeEventListener('keydown', _this.f);
  };

  this.index = 0;
  this.listeners = {};

  this.f = function (e) {
    var code = e.keyCode || e.which;
    for (var i = 0; i < _this.index; i += 1) {
      var _listeners$i = _this.listeners[i],
          _keyCode = _listeners$i.keyCode,
          _fn = _listeners$i.fn;

      if (_keyCode.includes(code)) _fn(e);
    }
  };

  document.addEventListener('keydown', this.f);
};

var Listeners = new Listener();

var Item = function (_React$Component) {
  inherits(Item, _React$Component);

  function Item() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Item);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Item.__proto__ || Object.getPrototypeOf(Item)).call.apply(_ref, [this].concat(args))), _this), _this.onMouseEnterHandler = function () {
      var _this$props = _this.props,
          item = _this$props.item,
          onMouseEnterHandler = _this$props.onMouseEnterHandler;

      onMouseEnterHandler(item);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Item, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Component = _props.component,
          onClickHandler = _props.onClickHandler,
          item = _props.item,
          selected = _props.selected;


      return React.createElement(
        'li',
        { className: index('rta__item', { 'rta__item--selected': selected }) },
        React.createElement(
          'button',
          { onClick: onClickHandler, onMouseEnter: this.onMouseEnterHandler },
          React.createElement(Component, { selected: selected, entity: item })
        )
      );
    }
  }]);
  return Item;
}(React.Component);

var List = function (_React$PureComponent) {
  inherits(List, _React$PureComponent);

  function List() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selected: null,
      selectedItem: null
    }, _this.onPressEnter = function (e) {
      e.preventDefault();

      var values = _this.props.values;


      _this.modifyText(values[_this.getPositionInList()]);
    }, _this.getPositionInList = function () {
      var values = _this.props.values;
      var selectedItem = _this.state.selectedItem;


      if (!selectedItem) return 0;

      return values.findIndex(function (a) {
        return _this.getId(a) === _this.getId(selectedItem);
      });
    }, _this.getId = function (item) {
      return _this.props.getTextToReplace(item);
    }, _this.listeners = [], _this.modifyText = function (value) {
      if (!value) return;

      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          getTextToReplace = _this$props.getTextToReplace;


      onSelect(getTextToReplace(value));
    }, _this.selectItem = function (item) {
      _this.setState({ selectedItem: item });
    }, _this.scroll = function (e) {
      e.preventDefault();

      var values = _this.props.values;


      var code = e.keyCode || e.which;

      var oldPosition = _this.getPositionInList();
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

      newPosition = (newPosition % values.length + values.length) % values.length; // eslint-disable-line
      _this.setState({ selectedItem: values[newPosition] });
    }, _this.isSelected = function (item) {
      var selectedItem = _this.state.selectedItem;

      if (!selectedItem) return false;

      return _this.getId(selectedItem) === _this.getId(item);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(List, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.listeners.push(Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll), Listeners.add([KEY_CODES.ENTER], this.onPressEnter));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var listener = void 0;
      while (this.listeners.length) {
        listener = this.listeners.pop();
        Listeners.remove(listener);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          values = _props.values,
          component = _props.component;


      return React.createElement(
        'ul',
        { className: 'rta__list' },
        values.map(function (item) {
          return React.createElement(Item, {
            key: _this2.getId(item),
            selected: _this2.isSelected(item),
            item: item,
            onClickHandler: _this2.onPressEnter,
            onMouseEnterHandler: _this2.selectItem,
            component: component
          });
        })
      );
    }
  }]);
  return List;
}(React.PureComponent);

var ReactTextareaAutocomplete = function (_React$Component) {
  inherits(ReactTextareaAutocomplete, _React$Component);

  function ReactTextareaAutocomplete() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ReactTextareaAutocomplete);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ReactTextareaAutocomplete.__proto__ || Object.getPrototypeOf(ReactTextareaAutocomplete)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      top: 0,
      left: 0,
      currentTrigger: null,
      actualToken: '',
      data: null,
      value: '',
      dataLoading: false,
      selectionEnd: 0,
      selectionStart: 0,
      component: null
    }, _this.onSelect = function (newToken) {
      var _this$state = _this.state,
          selectionEnd = _this$state.selectionEnd,
          textareaValue = _this$state.value;


      var offsetToEndOfToken = 0;
      while (textareaValue[selectionEnd + offsetToEndOfToken] && /\S/.test(textareaValue[selectionEnd + offsetToEndOfToken])) {
        offsetToEndOfToken += 1;
      }

      var textToModify = textareaValue.slice(0, selectionEnd + offsetToEndOfToken);

      var startOfTokenPosition = textToModify.search(/\S*$/);
      var newCaretPosition = startOfTokenPosition + newToken.length;
      var modifiedText = textToModify.substring(0, startOfTokenPosition) + newToken;

      // set the new textarea value and after that set the caret back to its position
      _this.setState({
        value: textareaValue.replace(textToModify, modifiedText)
      }, function () {
        return _this.setTextareaCaret(newCaretPosition);
      });
      _this.closeAutocomplete();
    }, _this.getTextToReplace = function () {
      var currentTrigger = _this.state.currentTrigger;

      var triggerSettings = _this.getCurrentTriggerSettings();

      if (!currentTrigger || !triggerSettings) return function () {
        return '';
      };

      var output = triggerSettings.output;


      return function (item) {
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          if (!output || typeof output !== 'function') {
            throw new Error('RTA: Output function is not defined!');
          }

          return output(item, currentTrigger);
        }

        return currentTrigger + item;
      };
    }, _this.setTextareaCaret = function () {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (!_this.textareaRef) return;

      _this.textareaRef.setSelectionRange(position, position);
    }, _this.getCurrentTriggerSettings = function () {
      var currentTrigger = _this.state.currentTrigger;


      if (!currentTrigger) return null;

      return _this.props.trigger[currentTrigger];
    }, _this.getValuesFromProvider = function () {
      var _this$state2 = _this.state,
          currentTrigger = _this$state2.currentTrigger,
          actualToken = _this$state2.actualToken;

      var triggerSettings = _this.getCurrentTriggerSettings();

      if (!currentTrigger || !triggerSettings) {
        return;
      }

      var dataProvider = triggerSettings.dataProvider,
          component = triggerSettings.component;


      if (typeof dataProvider !== 'function') {
        throw new Error('RTA: Trigger provider has to be a function!');
      }

      _this.setState({
        dataLoading: true,
        data: null
      });

      var providedData = dataProvider(actualToken);

      if (!(providedData instanceof Promise)) {
        providedData = Promise.resolve(providedData);
      }

      providedData.then(function (data) {
        if ((typeof providedData === 'undefined' ? 'undefined' : _typeof(providedData)) !== 'object') {
          throw new Error('RTA: Trigger provider has to provide an array!');
        }

        if (typeof component !== 'function') {
          throw new Error('RTA: Component should be defined!');
        }

        _this.setState({
          dataLoading: false,
          data: data,
          component: component
        });
      }).catch(function (e) {
        throw new Error('RTA: dataProvider fails: ' + e.message);
      });
    }, _this.getSuggestions = function () {
      var _this$state3 = _this.state,
          currentTrigger = _this$state3.currentTrigger,
          data = _this$state3.data;


      if (!currentTrigger || !data || data && !data.length) return null;

      return data;
    }, _this.closeAutocomplete = function () {
      if (!_this.getSuggestions()) return;

      _this.setState({ data: null });
    }, _this.cleanUpProps = function () {
      var props = _extends({}, _this.props);
      var notSafe = ['loadingComponent', 'ref', 'onChange', 'className', 'value', 'trigger'];

      //eslint-disable-next-line
      for (var prop in props) {
        if (notSafe.includes(prop)) delete props[prop];
      }

      return props;
    }, _this.changeHandler = function (e) {
      var _this$props = _this.props,
          trigger = _this$props.trigger,
          onChange = _this$props.onChange;

      var textarea = e.target;
      var selectionEnd = textarea.selectionEnd,
          selectionStart = textarea.selectionStart;

      var value = textarea.value;

      if (onChange) {
        e.persist();
        onChange(e);
      }

      _this.setState({
        value: value
      });

      var tokenMatch = _this.tokenRegExp.exec(value.slice(0, selectionEnd));
      var lastToken = tokenMatch && tokenMatch[0];

      /*
       if we lost the trigger token or there is no following character we want to close
       the autocomplete
      */
      if (!lastToken || lastToken.length <= 1) {
        _this.closeAutocomplete();
        return;
      }

      var triggerChars = Object.keys(trigger);

      var currentTrigger = lastToken && triggerChars.find(function (a) {
        return a === lastToken[0];
      }) || null;

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
        var _getCaretCoordinates = index$1(textarea, selectionEnd),
            _top = _getCaretCoordinates.top,
            _left = _getCaretCoordinates.left;

        _this.setState({ top: _top, left: _left });
      } catch (err) {
        //eslint-disable-next-line
        console.warn('RTA: failed to get caret coordinates. This is not a browser?');
      }

      _this.setState({
        selectionEnd: selectionEnd,
        selectionStart: selectionStart,
        currentTrigger: currentTrigger,
        actualToken: actualToken
      }, _this.getValuesFromProvider);
    }, _this.update = function () {
      var trigger = _this.props.trigger;

      _this.tokenRegExp = new RegExp('[' + Object.keys(trigger).join('') + ']\\w*$');
    }, _this.textareaRef = null, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ReactTextareaAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.update();
      Listeners.add(KEY_CODES.ESC, function () {
        return _this2.closeAutocomplete();
      });

      var _props = this.props,
          loadingComponent = _props.loadingComponent,
          trigger = _props.trigger;


      if (!loadingComponent) {
        throw new Error('RTA: loadingComponent is not defined');
      }

      if (!trigger) {
        throw new Error('RTA: trigger is not defined');
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.update();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      Listeners.removeAll();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          Loader = _props2.loadingComponent,
          otherProps = objectWithoutProperties(_props2, ['loadingComponent']);
      var _state = this.state,
          left = _state.left,
          top = _state.top,
          dataLoading = _state.dataLoading,
          component = _state.component,
          value = _state.value;


      var suggestionData = this.getSuggestions();
      var textToReplace = this.getTextToReplace();

      return React.createElement(
        'div',
        { className: index('rta', { 'rta--loading': dataLoading }) },
        React.createElement('textarea', _extends({
          ref: function ref(_ref2) {
            return _this3.textareaRef = _ref2;
          },
          className: 'rta__textarea ' + (otherProps.className || ''),
          onChange: this.changeHandler,
          value: value
        }, this.cleanUpProps())),
        (dataLoading || suggestionData) && React.createElement(
          'div',
          { style: { top: top, left: left }, className: 'rta__autocomplete' },
          dataLoading && React.createElement(
            'div',
            { className: 'rta__loader' },
            React.createElement(Loader, null)
          ),
          suggestionData && component && textToReplace && React.createElement(List, {
            values: suggestionData,
            component: component,
            getTextToReplace: textToReplace,
            onSelect: this.onSelect
          })
        )
      );
    }
  }]);
  return ReactTextareaAutocomplete;
}(React.Component);

var triggerPropsCheck = function triggerPropsCheck(_ref3) {
  var trigger = _ref3.trigger;

  if (!trigger) return Error('Invalid prop trigger. Prop missing.');

  var triggers = Object.entries(trigger);

  for (var i = 0; i < triggers.length; i += 1) {
    var _triggers$i = slicedToArray(triggers[i], 2),
        triggerChar = _triggers$i[0],
        settings = _triggers$i[1];

    if (typeof triggerChar !== 'string' || triggerChar.length !== 1) {
      return Error('Invalid prop trigger. Keys of the object has to be string.');
    }

    //$FlowFixMe
    var _component = settings.component,
        _dataProvider = settings.dataProvider;


    if (!_component || typeof _component !== 'function') {
      return Error('Invalid prop trigger: component should be defined.');
    }

    if (!_dataProvider || typeof _dataProvider !== 'function') {
      return Error('Invalid prop trigger: dataProvider should be defined.');
    }
  }

  return null;
};

ReactTextareaAutocomplete.propTypes = {
  trigger: triggerPropsCheck, //eslint-disable-line
  loadingComponent: PropTypes.func.isRequired
};

// import basic styles

module.exports = ReactTextareaAutocomplete;
