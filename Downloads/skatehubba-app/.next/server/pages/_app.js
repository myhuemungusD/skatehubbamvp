/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/firebase.ts":
/*!*************************!*\
  !*** ./src/firebase.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   analytics: () => (/* binding */ analytics),\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   db: () => (/* binding */ db),\n/* harmony export */   storage: () => (/* binding */ storage)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"firebase/app\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ \"firebase/firestore\");\n/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/storage */ \"firebase/storage\");\n/* harmony import */ var firebase_analytics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/analytics */ \"firebase/analytics\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__, firebase_storage__WEBPACK_IMPORTED_MODULE_3__, firebase_analytics__WEBPACK_IMPORTED_MODULE_4__]);\n([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__, firebase_storage__WEBPACK_IMPORTED_MODULE_3__, firebase_analytics__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// src/firebase.ts\n\n\n\n\n\n// Your config\nconst firebaseConfig = {\n    apiKey: \"AIzaSyD6kLt4GKV4adX-oQ3m_aXIpL6GXBP0xZw\",\n    authDomain: \"sk8hub-d7806.firebaseapp.com\",\n    projectId: \"sk8hub-d7806\",\n    storageBucket: \"sk8hub-d7806.firebasestorage.app\",\n    messagingSenderId: \"665573979824\",\n    appId: \"1:665573979824:web:731aaae46daea5efee2d75\",\n    measurementId: \"G-7XVNF1LHZW\"\n};\n// Initialize\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(app);\nconst db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)(app);\nconst storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__.getStorage)(app);\n// Analytics must be conditional\nlet analytics;\nif (false) {}\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZmlyZWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0JBQWtCO0FBQzJCO0FBQ0w7QUFDVTtBQUNKO0FBQ2lCO0FBRS9ELGNBQWM7QUFDZCxNQUFNTSxpQkFBaUI7SUFDckJDLFFBQVE7SUFDUkMsWUFBWTtJQUNaQyxXQUFXO0lBQ1hDLGVBQWU7SUFDZkMsbUJBQW1CO0lBQ25CQyxPQUFPO0lBQ1BDLGVBQWU7QUFDakI7QUFFQSxhQUFhO0FBQ2IsTUFBTUMsTUFBTWQsMkRBQWFBLENBQUNNO0FBRW5CLE1BQU1TLE9BQU9kLHNEQUFPQSxDQUFDYSxLQUFLO0FBQzFCLE1BQU1FLEtBQUtkLGdFQUFZQSxDQUFDWSxLQUFLO0FBQzdCLE1BQU1HLFVBQVVkLDREQUFVQSxDQUFDVyxLQUFLO0FBRXZDLGdDQUFnQztBQUNoQyxJQUFJSTtBQUNKLElBQUksS0FBNkIsRUFBRSxFQU1sQztBQUNvQiIsInNvdXJjZXMiOlsid2VicGFjazovL3NrYXRlaHViYmEvLi9zcmMvZmlyZWJhc2UudHM/NWQ2YiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvZmlyZWJhc2UudHNcclxuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcclxuaW1wb3J0IHsgZ2V0QXV0aCB9IGZyb20gXCJmaXJlYmFzZS9hdXRoXCI7XHJcbmltcG9ydCB7IGdldEZpcmVzdG9yZSB9IGZyb20gXCJmaXJlYmFzZS9maXJlc3RvcmVcIjtcclxuaW1wb3J0IHsgZ2V0U3RvcmFnZSB9IGZyb20gXCJmaXJlYmFzZS9zdG9yYWdlXCI7XHJcbmltcG9ydCB7IGdldEFuYWx5dGljcywgaXNTdXBwb3J0ZWQgfSBmcm9tIFwiZmlyZWJhc2UvYW5hbHl0aWNzXCI7XHJcblxyXG4vLyBZb3VyIGNvbmZpZ1xyXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICBhcGlLZXk6IFwiQUl6YVN5RDZrTHQ0R0tWNGFkWC1vUTNtX2FYSXBMNkdYQlAweFp3XCIsXHJcbiAgYXV0aERvbWFpbjogXCJzazhodWItZDc4MDYuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgcHJvamVjdElkOiBcInNrOGh1Yi1kNzgwNlwiLFxyXG4gIHN0b3JhZ2VCdWNrZXQ6IFwic2s4aHViLWQ3ODA2LmZpcmViYXNlc3RvcmFnZS5hcHBcIixcclxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCI2NjU1NzM5Nzk4MjRcIixcclxuICBhcHBJZDogXCIxOjY2NTU3Mzk3OTgyNDp3ZWI6NzMxYWFhZTQ2ZGFlYTVlZmVlMmQ3NVwiLFxyXG4gIG1lYXN1cmVtZW50SWQ6IFwiRy03WFZORjFMSFpXXCJcclxufTtcclxuXHJcbi8vIEluaXRpYWxpemVcclxuY29uc3QgYXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcclxuZXhwb3J0IGNvbnN0IGRiID0gZ2V0RmlyZXN0b3JlKGFwcCk7XHJcbmV4cG9ydCBjb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZShhcHApO1xyXG5cclxuLy8gQW5hbHl0aWNzIG11c3QgYmUgY29uZGl0aW9uYWxcclxubGV0IGFuYWx5dGljczogUmV0dXJuVHlwZTx0eXBlb2YgZ2V0QW5hbHl0aWNzPiB8IHVuZGVmaW5lZDtcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICBpc1N1cHBvcnRlZCgpLnRoZW4oKHllcykgPT4ge1xyXG4gICAgaWYgKHllcykge1xyXG4gICAgICBhbmFseXRpY3MgPSBnZXRBbmFseXRpY3MoYXBwKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5leHBvcnQgeyBhbmFseXRpY3MgfTtcclxuIl0sIm5hbWVzIjpbImluaXRpYWxpemVBcHAiLCJnZXRBdXRoIiwiZ2V0RmlyZXN0b3JlIiwiZ2V0U3RvcmFnZSIsImdldEFuYWx5dGljcyIsImlzU3VwcG9ydGVkIiwiZmlyZWJhc2VDb25maWciLCJhcGlLZXkiLCJhdXRoRG9tYWluIiwicHJvamVjdElkIiwic3RvcmFnZUJ1Y2tldCIsIm1lc3NhZ2luZ1NlbmRlcklkIiwiYXBwSWQiLCJtZWFzdXJlbWVudElkIiwiYXBwIiwiYXV0aCIsImRiIiwic3RvcmFnZSIsImFuYWx5dGljcyIsInRoZW4iLCJ5ZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/firebase.ts\n");

/***/ }),

/***/ "./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ensureAnonSignIn: () => (/* binding */ ensureAnonSignIn),\n/* harmony export */   signInWithGoogle: () => (/* binding */ signInWithGoogle)\n/* harmony export */ });\n/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../firebase */ \"./src/firebase.ts\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_firebase__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__]);\n([_firebase__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nfunction ensureAnonSignIn() {\n    return new Promise((resolve, reject)=>{\n        const unsub = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.onAuthStateChanged)(_firebase__WEBPACK_IMPORTED_MODULE_0__.auth, async (user)=>{\n            if (user) {\n                unsub();\n                resolve(user);\n            } else {\n                try {\n                    const cred = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.signInAnonymously)(_firebase__WEBPACK_IMPORTED_MODULE_0__.auth);\n                    unsub();\n                    resolve(cred.user);\n                } catch (e) {\n                    unsub();\n                    reject(e);\n                }\n            }\n        });\n    });\n}\nasync function signInWithGoogle() {\n    const provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_1__.GoogleAuthProvider();\n    return (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.signInWithPopup)(_firebase__WEBPACK_IMPORTED_MODULE_0__.auth, provider);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFtQztBQUM4RTtBQUUxRyxTQUFTSztJQUNkLE9BQU8sSUFBSUMsUUFBUSxDQUFDQyxTQUFTQztRQUMzQixNQUFNQyxRQUFRUCxpRUFBa0JBLENBQUNGLDJDQUFJQSxFQUFFLE9BQU9VO1lBQzVDLElBQUlBLE1BQU07Z0JBQ1JEO2dCQUNBRixRQUFRRztZQUNWLE9BQU87Z0JBQ0wsSUFBSTtvQkFDRixNQUFNQyxPQUFPLE1BQU1SLGdFQUFpQkEsQ0FBQ0gsMkNBQUlBO29CQUN6Q1M7b0JBQ0FGLFFBQVFJLEtBQUtELElBQUk7Z0JBQ25CLEVBQUUsT0FBT0UsR0FBRztvQkFDVkg7b0JBQ0FELE9BQU9JO2dCQUNUO1lBQ0Y7UUFDRjtJQUNGO0FBQ0Y7QUFFTyxlQUFlQztJQUNwQixNQUFNQyxXQUFXLElBQUliLDZEQUFrQkE7SUFDdkMsT0FBT0csOERBQWVBLENBQUNKLDJDQUFJQSxFQUFFYztBQUMvQiIsInNvdXJjZXMiOlsid2VicGFjazovL3NrYXRlaHViYmEvLi9zcmMvbGliL2F1dGgudHM/NjY5MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL2ZpcmViYXNlXCI7XG5pbXBvcnQgeyBHb29nbGVBdXRoUHJvdmlkZXIsIG9uQXV0aFN0YXRlQ2hhbmdlZCwgc2lnbkluQW5vbnltb3VzbHksIHNpZ25JbldpdGhQb3B1cCwgVXNlciB9IGZyb20gXCJmaXJlYmFzZS9hdXRoXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVBbm9uU2lnbkluKCk6IFByb21pc2U8VXNlcj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHVuc3ViID0gb25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB1bnN1YigpO1xuICAgICAgICByZXNvbHZlKHVzZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjcmVkID0gYXdhaXQgc2lnbkluQW5vbnltb3VzbHkoYXV0aCk7XG4gICAgICAgICAgdW5zdWIoKTtcbiAgICAgICAgICByZXNvbHZlKGNyZWQudXNlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB1bnN1YigpO1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25JbldpdGhHb29nbGUoKSB7XG4gIGNvbnN0IHByb3ZpZGVyID0gbmV3IEdvb2dsZUF1dGhQcm92aWRlcigpO1xuICByZXR1cm4gc2lnbkluV2l0aFBvcHVwKGF1dGgsIHByb3ZpZGVyKTtcbn1cbiJdLCJuYW1lcyI6WyJhdXRoIiwiR29vZ2xlQXV0aFByb3ZpZGVyIiwib25BdXRoU3RhdGVDaGFuZ2VkIiwic2lnbkluQW5vbnltb3VzbHkiLCJzaWduSW5XaXRoUG9wdXAiLCJlbnN1cmVBbm9uU2lnbkluIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ1bnN1YiIsInVzZXIiLCJjcmVkIiwiZSIsInNpZ25JbldpdGhHb29nbGUiLCJwcm92aWRlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/lib/auth.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/auth */ \"./src/lib/auth.ts\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_auth__WEBPACK_IMPORTED_MODULE_2__]);\n_lib_auth__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [ready, setReady] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.ensureAnonSignIn)().then(()=>setReady(true)).catch(()=>setReady(true));\n    }, []);\n    if (!ready) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen flex items-center justify-center\",\n        children: \"Loading…\"\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\LowAn\\\\Downloads\\\\skatehubba-app\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 9,\n        columnNumber: 22\n    }, this);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\LowAn\\\\Downloads\\\\skatehubba-app\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 10,\n        columnNumber: 10\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQzRDO0FBQ0c7QUFDaEI7QUFFaEIsU0FBU0csTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM5RCxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR04sK0NBQVFBLENBQUM7SUFDbkNELGdEQUFTQSxDQUFDO1FBQVFFLDJEQUFnQkEsR0FBR00sSUFBSSxDQUFDLElBQU1ELFNBQVMsT0FBT0UsS0FBSyxDQUFDLElBQU1GLFNBQVM7SUFBUSxHQUFHLEVBQUU7SUFDbEcsSUFBSSxDQUFDRCxPQUFPLHFCQUFPLDhEQUFDSTtRQUFJQyxXQUFVO2tCQUFnRDs7Ozs7O0lBQ2xGLHFCQUFPLDhEQUFDUDtRQUFXLEdBQUdDLFNBQVM7Ozs7OztBQUNqQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NrYXRlaHViYmEvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBlbnN1cmVBbm9uU2lnbkluIH0gZnJvbSBcIi4uL2xpYi9hdXRoXCI7XG5pbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCBbcmVhZHksIHNldFJlYWR5XSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgdXNlRWZmZWN0KCgpID0+IHsgZW5zdXJlQW5vblNpZ25JbigpLnRoZW4oKCkgPT4gc2V0UmVhZHkodHJ1ZSkpLmNhdGNoKCgpID0+IHNldFJlYWR5KHRydWUpKTsgfSwgW10pO1xuICBpZiAoIXJlYWR5KSByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5Mb2FkaW5n4oCmPC9kaXY+O1xuICByZXR1cm4gPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPjtcbn0iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJlbnN1cmVBbm9uU2lnbkluIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJyZWFkeSIsInNldFJlYWR5IiwidGhlbiIsImNhdGNoIiwiZGl2IiwiY2xhc3NOYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "firebase/analytics":
/*!*************************************!*\
  !*** external "firebase/analytics" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/analytics");;

/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/app");;

/***/ }),

/***/ "firebase/auth":
/*!********************************!*\
  !*** external "firebase/auth" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/auth");;

/***/ }),

/***/ "firebase/firestore":
/*!*************************************!*\
  !*** external "firebase/firestore" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/firestore");;

/***/ }),

/***/ "firebase/storage":
/*!***********************************!*\
  !*** external "firebase/storage" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/storage");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();