"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@sideway+pinpoint@2.0.0";
exports.ids = ["vendor-chunks/@sideway+pinpoint@2.0.0"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/@sideway+pinpoint@2.0.0/node_modules/@sideway/pinpoint/lib/index.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@sideway+pinpoint@2.0.0/node_modules/@sideway/pinpoint/lib/index.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nconst internals = {};\n\n\nexports.location = function (depth = 0) {\n\n    const orig = Error.prepareStackTrace;\n    Error.prepareStackTrace = (ignore, stack) => stack;\n\n    const capture = {};\n    Error.captureStackTrace(capture, this);\n    const line = capture.stack[depth + 1];\n\n    Error.prepareStackTrace = orig;\n\n    return {\n        filename: line.getFileName(),\n        line: line.getLineNumber()\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpZGV3YXkrcGlucG9pbnRAMi4wLjAvbm9kZV9tb2R1bGVzL0BzaWRld2F5L3BpbnBvaW50L2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjs7O0FBR0EsZ0JBQWdCOztBQUVoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnV0Ym9sLy4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaWRld2F5K3BpbnBvaW50QDIuMC4wL25vZGVfbW9kdWxlcy9Ac2lkZXdheS9waW5wb2ludC9saWIvaW5kZXguanM/NmU0NCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGludGVybmFscyA9IHt9O1xuXG5cbmV4cG9ydHMubG9jYXRpb24gPSBmdW5jdGlvbiAoZGVwdGggPSAwKSB7XG5cbiAgICBjb25zdCBvcmlnID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7XG4gICAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSAoaWdub3JlLCBzdGFjaykgPT4gc3RhY2s7XG5cbiAgICBjb25zdCBjYXB0dXJlID0ge307XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoY2FwdHVyZSwgdGhpcyk7XG4gICAgY29uc3QgbGluZSA9IGNhcHR1cmUuc3RhY2tbZGVwdGggKyAxXTtcblxuICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gb3JpZztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbGVuYW1lOiBsaW5lLmdldEZpbGVOYW1lKCksXG4gICAgICAgIGxpbmU6IGxpbmUuZ2V0TGluZU51bWJlcigpXG4gICAgfTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/@sideway+pinpoint@2.0.0/node_modules/@sideway/pinpoint/lib/index.js\n");

/***/ })

};
;