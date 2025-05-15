// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// node_modules/ant-design-vue/es/style/operationUnit.js
var operationUnit = (token) => ({
  // FIXME: This use link but is a operation unit. Seems should be a colorPrimary.
  // And Typography use this to generate link style which should not do this.
  color: token.colorLink,
  textDecoration: "none",
  outline: "none",
  cursor: "pointer",
  transition: `color ${token.motionDurationSlow}`,
  "&:focus, &:hover": {
    color: token.colorLinkHover
  },
  "&:active": {
    color: token.colorLinkActive
  }
});

// node_modules/ant-design-vue/es/style/roundedArrow.js
var roundedArrow = (width, innerRadius, outerRadius, bgColor, boxShadow) => {
  const unitWidth = width / 2;
  const ax = 0;
  const ay = unitWidth;
  const bx = outerRadius * 1 / Math.sqrt(2);
  const by = unitWidth - outerRadius * (1 - 1 / Math.sqrt(2));
  const cx = unitWidth - innerRadius * (1 / Math.sqrt(2));
  const cy = outerRadius * (Math.sqrt(2) - 1) + innerRadius * (1 / Math.sqrt(2));
  const dx = 2 * unitWidth - cx;
  const dy = cy;
  const ex = 2 * unitWidth - bx;
  const ey = by;
  const fx = 2 * unitWidth - ax;
  const fy = ay;
  const shadowWidth = unitWidth * Math.sqrt(2) + outerRadius * (Math.sqrt(2) - 2);
  const polygonOffset = outerRadius * (Math.sqrt(2) - 1);
  return {
    pointerEvents: "none",
    width,
    height: width,
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      width: shadowWidth,
      height: shadowWidth,
      bottom: 0,
      insetInline: 0,
      margin: "auto",
      borderRadius: {
        _skip_check_: true,
        value: `0 0 ${innerRadius}px 0`
      },
      transform: "translateY(50%) rotate(-135deg)",
      boxShadow,
      zIndex: 0,
      background: "transparent"
    },
    "&::before": {
      position: "absolute",
      bottom: 0,
      insetInlineStart: 0,
      width,
      height: width / 2,
      background: bgColor,
      clipPath: {
        _multi_value_: true,
        value: [`polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${2 * unitWidth - polygonOffset}px 100%, ${polygonOffset}px 100%)`, `path('M ${ax} ${ay} A ${outerRadius} ${outerRadius} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${innerRadius} ${innerRadius} 0 0 1 ${dx} ${dy} L ${ex} ${ey} A ${outerRadius} ${outerRadius} 0 0 0 ${fx} ${fy} Z')`]
      },
      content: '""'
    }
  };
};

// node_modules/ant-design-vue/es/theme/interface/presetColors.js
var PresetColors = ["blue", "purple", "cyan", "green", "magenta", "pink", "red", "orange", "yellow", "volcano", "geekblue", "lime", "gold"];

// node_modules/ant-design-vue/es/style/presetColor.js
function genPresetColor(token, genCss) {
  return PresetColors.reduce((prev, colorKey) => {
    const lightColor = token[`${colorKey}-1`];
    const lightBorderColor = token[`${colorKey}-3`];
    const darkColor = token[`${colorKey}-6`];
    const textColor = token[`${colorKey}-7`];
    return _extends(_extends({}, prev), genCss(colorKey, {
      lightColor,
      lightBorderColor,
      darkColor,
      textColor
    }));
  }, {});
}

// node_modules/ant-design-vue/es/style/index.js
var textEllipsis = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
};
var resetComponent = (token) => ({
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  color: token.colorText,
  fontSize: token.fontSize,
  // font-variant: @font-variant-base;
  lineHeight: token.lineHeight,
  listStyle: "none",
  // font-feature-settings: @font-feature-settings-base;
  fontFamily: token.fontFamily
});
var resetIcon = () => ({
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  fontStyle: "normal",
  lineHeight: 0,
  textAlign: "center",
  textTransform: "none",
  // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
  verticalAlign: "-0.125em",
  textRendering: "optimizeLegibility",
  "-webkit-font-smoothing": "antialiased",
  "-moz-osx-font-smoothing": "grayscale",
  "> *": {
    lineHeight: 1
  },
  svg: {
    display: "inline-block"
  }
});
var clearFix = () => ({
  // https://github.com/ant-design/ant-design/issues/21301#issuecomment-583955229
  "&::before": {
    display: "table",
    content: '""'
  },
  "&::after": {
    // https://github.com/ant-design/ant-design/issues/21864
    display: "table",
    clear: "both",
    content: '""'
  }
});
var genLinkStyle = (token) => ({
  a: {
    color: token.colorLink,
    textDecoration: token.linkDecoration,
    backgroundColor: "transparent",
    outline: "none",
    cursor: "pointer",
    transition: `color ${token.motionDurationSlow}`,
    "-webkit-text-decoration-skip": "objects",
    "&:hover": {
      color: token.colorLinkHover
    },
    "&:active": {
      color: token.colorLinkActive
    },
    [`&:active,
  &:hover`]: {
      textDecoration: token.linkHoverDecoration,
      outline: 0
    },
    // https://github.com/ant-design/ant-design/issues/22503
    "&:focus": {
      textDecoration: token.linkFocusDecoration,
      outline: 0
    },
    "&[disabled]": {
      color: token.colorTextDisabled,
      cursor: "not-allowed"
    }
  }
});
var genCommonStyle = (token, componentPrefixCls) => {
  const {
    fontFamily,
    fontSize
  } = token;
  const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
  return {
    [rootPrefixSelector]: {
      fontFamily,
      fontSize,
      boxSizing: "border-box",
      "&::before, &::after": {
        boxSizing: "border-box"
      },
      [rootPrefixSelector]: {
        boxSizing: "border-box",
        "&::before, &::after": {
          boxSizing: "border-box"
        }
      }
    }
  };
};
var genFocusOutline = (token) => ({
  outline: `${token.lineWidthBold}px solid ${token.colorPrimaryBorder}`,
  outlineOffset: 1,
  transition: "outline-offset 0s, outline 0s"
});
var genFocusStyle = (token) => ({
  "&:focus-visible": _extends({}, genFocusOutline(token))
});

export {
  _extends,
  PresetColors,
  operationUnit,
  roundedArrow,
  genPresetColor,
  textEllipsis,
  resetComponent,
  resetIcon,
  clearFix,
  genLinkStyle,
  genCommonStyle,
  genFocusOutline,
  genFocusStyle
};
//# sourceMappingURL=chunk-TTCHSHZX.js.map
