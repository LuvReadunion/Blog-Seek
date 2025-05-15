import {
  __commonJS
} from "./chunk-6PRBTMBS.js";

// browser-external:node:http
var require_node_http = __commonJS({
  "browser-external:node:http"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:http" has been externalized for browser compatibility. Cannot access "node:http.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

export {
  require_node_http
};
//# sourceMappingURL=chunk-GL6B4O4A.js.map
