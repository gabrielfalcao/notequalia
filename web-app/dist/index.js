module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(704);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 704:
/***/ (function() {

(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{24:function(e,t,a){e.exports=a(39)},39:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),o=a(16),r=a.n(o),c=a(9),u=a(18),i=a(8),m=a(11),s=a(20),d=a(10),E=a(23),f=a(21),p=a(7),h=a(6),g=a(13),b=a(22);function w(){var e=window.localStorage.getItem("uploads");return"string"===typeof e?JSON.parse(e):[]}function v(e){var t=JSON.stringify(e);window.localStorage.setItem("uploads",t),console.log("write_cache",t)}var y=function(){var e=Object(n.useState)(0),t=Object(c.a)(e,2),a=t[0],o=t[1],r=Object(n.useState)(!1),y=Object(c.a)(r,2),O=y[0],j=y[1],k=Object(n.useState)(null),S=Object(c.a)(k,2),I=S[0],x=S[1],B=Object(n.useState)([]),C=Object(c.a)(B,2),T=C[0],D=C[1],J=Object(n.useState)(w()),F=Object(c.a)(J,2),P=F[0],U=F[1],N=Object(n.useCallback)((function(e){D((function(t){return t.concat(e)})),x(null)}),[]);Object(n.useEffect)((function(){document.title="Personal File Server",0===w().length&&L()}));var R=Object(b.a)({onDrop:N}),W=R.getRootProps,_=R.getInputProps,A=R.isDragActive;function L(){g.get("http://localhost:5000/files").end((function(e,t){e?x(e):t.body&&(U(t.body),v(t.body))}))}return l.a.createElement(u.a,{fluid:"md"},null!==I?l.a.createElement(i.a,null,l.a.createElement(p.a,{md:12},l.a.createElement(h.a,{bg:"danger",text:"white"},l.a.createElement(h.a.Body,W(),l.a.createElement(h.a.Title,null,"Error"),l.a.createElement(h.a.Text,null,"".concat(I)))))):null,l.a.createElement(i.a,null,l.a.createElement(p.a,{md:12},l.a.createElement(d.a,null,P.map((function(e){return"name"in e?l.a.createElement(d.a.Item,{key:e.name},l.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"http://localhost:5000/uploads/".concat(e.name)},e.name)):null})),l.a.createElement(d.a.Item,null,l.a.createElement(i.a,null,l.a.createElement(p.a,{md:12},P.length," files")),l.a.createElement(i.a,null,l.a.createElement(p.a,{md:9}),l.a.createElement(p.a,{md:3},l.a.createElement(s.a,null,l.a.createElement(m.a,{onClick:L},"List Files"),l.a.createElement(m.a,{variant:"danger",onClick:function(){window.localStorage.removeItem("uploads"),U([])}},"Clear Cache")))))))),l.a.createElement(i.a,null,l.a.createElement(p.a,{md:12},l.a.createElement(h.a,null,0===T.length?l.a.createElement(h.a.Body,W(),l.a.createElement(h.a.Title,null,"Upload Files"),l.a.createElement("input",_()),A?l.a.createElement(h.a.Text,null,"Drop the files here ..."):l.a.createElement(h.a.Text,null,"Drag 'n' drop some files here, or click to select files.")):O?null:l.a.createElement(h.a.Body,null,l.a.createElement("h1",null,"Ready to upload!")),T.length>0?l.a.createElement(h.a.Body,null,O?l.a.createElement(h.a.Text,null,l.a.createElement(f.a,{animation:"grow",variant:"dark"}),"Uploading ..."):l.a.createElement(m.a,{onClick:function(e){var t=g.post("http://localhost:5000/upload");T.forEach((function(e){t=t.attach("file",e)})),t.on("progress",(function(e){"upload"===e.direction&&e.percent&&(j(!0),o(e.percent),console.log(e))})).end((function(e,t){j(!1),o(0),D([]),e?x(e):(U(t.body),v(t.body))})),e.preventDefault()}},"Upload ",T.length," file(s)")):null)),l.a.createElement(p.a,{sm:!0})),a>0?l.a.createElement(i.a,null,l.a.createElement(p.a,null,l.a.createElement(E.a,{now:a,label:"".concat(a,"%")}))):null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(38);r.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[24,1,2]]]);
//# sourceMappingURL=main.16ee5a96.chunk.js.map

/***/ })

/******/ });