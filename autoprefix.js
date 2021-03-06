'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // forked from https://www.npmjs.com/package/auto-prefixer


exports.autoprefix = autoprefix;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  console.warn('[Deprecation] In glamor v3 this file will be published as a standalone package: "glamor-autoprefixer". See https://github.com/threepointone/glamor/issues/204 for more information.');
}

function capitalize(str) {
  return str && str.charAt(0).toUpperCase() + str.substring(1);
}

function includes(obj, search) {
  if (typeof obj === 'number') {
    obj = obj.toString();
  }
  if (!obj.indexOf) {
    throw new Error('this seems to be an invalid property ' + JSON.stringify(obj));
  }
  return obj.indexOf(search) !== -1;
}

function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

var webkitPrefix = 'Webkit';
var mozPrefix = 'Moz';
var msPrefix = 'ms';
var oPrefix = 'o';

var webkit = [webkitPrefix];
var webkitO = [webkitPrefix, oPrefix];
var moz = [mozPrefix];
var ms = [msPrefix];

var webkitMoz = [webkitPrefix, mozPrefix];
var webkitMozO = [webkitPrefix, mozPrefix, oPrefix];
var webkitMozMs = [webkitPrefix, mozPrefix, msPrefix];
var webkitMs = [webkitPrefix, msPrefix];
var allPrefixes = [webkitPrefix, msPrefix, mozPrefix, oPrefix];

var neededRules = {
  alignContent: webkit,
  alignItems: webkit,
  alignSelf: webkit,
  animation: webkitMoz,
  animationDelay: webkitMoz,
  animationDirection: webkitMoz,
  animationDuration: webkitMoz,
  animationFillMode: webkitMoz,
  animationIterationCount: webkitMoz,
  animationName: webkitMoz,
  animationPlayState: webkitMoz,
  animationTimingFunction: webkitMoz,
  appearance: webkitMoz,
  backfaceVisibility: webkitMoz,
  backgroundClip: webkit,
  borderImage: webkitMozO,
  borderImageSlice: webkitMozO,
  boxShadow: webkitMozMs,
  boxSizing: webkitMoz,
  clipPath: webkit,
  columns: webkitMoz,
  cursor: webkitMoz,
  flex: webkitMs, //new flex and 2012 specification , no support for old specification
  flexBasis: webkitMs,
  flexDirection: webkitMs,
  flexFlow: webkitMs,
  flexGrow: webkitMs,
  flexShrink: webkitMs,
  flexWrap: webkitMs,
  fontSmoothing: webkitMoz,
  justifyContent: webkitMoz,
  order: webkitMoz,
  perspective: webkitMoz,
  perspectiveOrigin: webkitMoz,
  transform: webkitMozMs,
  transformOrigin: webkitMozMs,
  transformOriginX: webkitMozMs,
  transformOriginY: webkitMozMs,
  transformOriginZ: webkitMozMs,
  transformStyle: webkitMozMs,
  transition: webkitMozMs,
  transitionDelay: webkitMozMs,
  transitionDuration: webkitMozMs,
  transitionProperty: webkitMozMs,
  transitionTimingFunction: webkitMozMs,
  userSelect: webkitMozMs
};

var neededCssValues = {
  calc: webkitMoz,
  flex: webkitMs
};

var clientPrefix = function () {
  if (typeof navigator === 'undefined') {
    //in server rendering
    return allPrefixes; //also default when not passing true to 'all vendors' explicitly
  }
  var sUsrAg = navigator.userAgent;

  if (includes(sUsrAg, 'Chrome')) {
    return webkit;
  } else if (includes(sUsrAg, 'Safari')) {
    return webkit;
  } else if (includes(sUsrAg, 'Opera')) {
    return webkitO;
  } else if (includes(sUsrAg, 'Firefox')) {
    return moz;
  } else if (includes(sUsrAg, 'MSIE')) {
    return ms;
  }

  return [];
}();

function checkAndAddPrefix(styleObj, key, val, allVendors) {
  var oldFlex = true;

  function valueWithPrefix(cssVal, prefix) {
    return includes(val, cssVal) && (allVendors || includes(clientPrefix, prefix)) ? val.replace(cssVal, ['', prefix.toLowerCase(), cssVal].join('-')) : null;
    //example return -> 'transition: -webkit-transition'
  }

  function createObjectOfValuesWithPrefixes(cssVal) {
    return neededCssValues[cssVal].reduce(function (o, v) {
      o[v.toLowerCase()] = valueWithPrefix(cssVal, v);
      return o;
    }, {});
    //example return -> {webkit: -webkit-calc(10% - 1px), moz: -moz-calc(10% - 1px)}
  }

  function composePrefixedValues(objOfPrefixedValues) {
    var composed = values(objOfPrefixedValues).filter(function (str) {
      return str !== null;
    }).map(function (str) {
      return key + ':' + str;
    }).join(';');

    if (composed) {
      styleObj[key] = styleObj[key] + ';' + composed;
    }
    //example do -> {display: "flex;display:-webkit-flex;display:-ms-flexbox"}
  }

  function valWithoutFlex() {
    return val.replace('flex-', '').toLowerCase();
  }

  if (val === 'flex' && key === 'display') {

    var flex = createObjectOfValuesWithPrefixes('flex');
    if (flex.ms) {
      flex.ms = flex.ms.replace('flex', 'flexbox');
    } //special case

    composePrefixedValues(flex);
    //if(oldFlex){styleObj[key] = styleObj[key] + ';display:-webkit-box'; }
    if (oldFlex) {
      styleObj[key] = '-webkit-box;display:' + styleObj[key];
    }

    //display:flex is simple case, no need for other checks
    return styleObj;
  }

  var allPrefixedCssValues = Object.keys(neededCssValues).filter(function (c) {
    return c !== 'flex';
  }).reduce(function (o, c) {
    o[c] = createObjectOfValuesWithPrefixes(c);
    return o;
  }, {});
  /*
   example allPrefixedCssValues = {
   calc: {
   webkit: "translateX(-webkit-calc(10% - 10px))",
   moz: "translateX(-moz-calc(10% - 10px))"
   },
   flex: {
   ms: null,
   webkit: null
   }
   };*/

  //if(includes(val, 'gradient')){
  //
  //}

  if (neededRules[key]) {

    var prefixes = allVendors ? neededRules[key] : neededRules[key].filter(function (vendor) {
      return includes(clientPrefix, vendor);
    });

    var prefixedProperties = prefixes.reduce(function (obj, prefix) {
      var property = val;

      //add valueWithPrefixes in their position and null the property
      Object.keys(allPrefixedCssValues).forEach(function (cssKey) {
        var cssVal = allPrefixedCssValues[cssKey];
        Object.keys(cssVal).forEach(function (vendor) {
          if (cssVal[vendor] && capitalize(prefix) === capitalize(vendor)) {
            property = cssVal[vendor];
            cssVal[vendor] = null;
          }
        });
      });

      obj[prefix + capitalize(key)] = property;
      return obj;
    }, {});

    if (oldFlex) {
      switch (key) {
        case 'flexDirection':
          if (includes(val, 'reverse')) {
            prefixedProperties.WebkitBoxDirection = 'reverse';
          } else {
            prefixedProperties.WebkitBoxDirection = 'normal';
          }
          if (includes(val, 'row')) {
            prefixedProperties.WebkitBoxOrient = prefixedProperties.boxOrient = 'horizontal';
          } else if (includes(val, 'column')) {
            prefixedProperties.WebkitBoxOrient = 'vertical';
          }
          break;
        case 'alignSelf':
          prefixedProperties.msFlexItemAlign = valWithoutFlex();break;
        case 'alignItems':
          prefixedProperties.WebkitBoxAlign = prefixedProperties.msFlexAlign = valWithoutFlex();break;
        case 'alignContent':
          if (val === 'spaceAround') {
            prefixedProperties.msFlexLinePack = 'distribute';
          } else if (val === 'spaceBetween') {
            prefixedProperties.msFlexLinePack = 'justify';
          } else {
            prefixedProperties.msFlexLinePack = valWithoutFlex();
          }
          break;
        case 'justifyContent':
          if (val === 'spaceAround') {
            prefixedProperties.msFlexPack = 'distribute';
          } else if (val === 'spaceBetween') {
            prefixedProperties.WebkitBoxPack = prefixedProperties.msFlexPack = 'justify';
          } else {
            prefixedProperties.WebkitBoxPack = prefixedProperties.msFlexPack = valWithoutFlex();
          }
          break;
        case 'flexBasis':
          prefixedProperties.msFlexPreferredSize = val;break;
        case 'order':
          prefixedProperties.msFlexOrder = '-moz-calc(' + val + ')'; //ugly hack to prevent react from adding 'px'
          prefixedProperties.WebkitBoxOrdinalGroup = '-webkit-calc(' + (parseInt(val) + 1) + ')'; //this might not work for browsers who don't support calc
          break;
        case 'flexGrow':
          prefixedProperties.WebkitBoxFlex = prefixedProperties.msFlexPositive = val;break;
        case 'flexShrink':
          prefixedProperties.msFlexNegative = val;break;
        case 'flex':
          prefixedProperties.WebkitBoxFlex = val;break;
      }
    }

    (0, _objectAssign2.default)(styleObj, prefixedProperties);
  }

  //if valueWithPrefixes were not added before
  Object.keys(allPrefixedCssValues).forEach(function (cssKey) {
    composePrefixedValues(allPrefixedCssValues[cssKey]);
  });
  return styleObj;
}

function autoPrefixer(obj, allVendors) {
  Object.keys(obj).forEach(function (key) {
    return obj = checkAndAddPrefix(_extends({}, obj), key, obj[key], allVendors);
  });
  return obj;
}

function gate(objOrBool) {
  var optionalBoolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


  if (typeof objOrBool === 'boolean') {
    return function (obj) {
      return autoPrefixer(obj, objOrBool);
    };
  }
  if (!objOrBool) {
    return {};
  } else {
    return autoPrefixer(objOrBool, optionalBoolean);
  } // default: don't include all browsers
}

var isBrowser = typeof window !== 'undefined';

function autoprefix(obj) {
  return autoPrefixer(obj, !isBrowser);
}