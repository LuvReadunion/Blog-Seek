import {
  DevEnvironment,
  arraify,
  isInNodeModules$1,
  require_assert,
  require_buffer,
  require_child_process,
  require_crypto,
  require_dist,
  require_http,
  require_https,
  require_main,
  require_module,
  require_net,
  require_node_assert,
  require_node_buffer,
  require_node_child_process,
  require_node_crypto,
  require_node_dns,
  require_node_events,
  require_node_module,
  require_node_net,
  require_node_querystring,
  require_node_readline,
  require_node_url,
  require_node_util,
  require_node_v8,
  require_node_worker_threads,
  require_node_zlib,
  require_picomatch,
  require_tls,
  require_tty,
  require_zlib
} from "./chunk-CQBIE7UF.js";
import {
  require_events,
  require_node_os,
  require_os,
  require_stream,
  require_util
} from "./chunk-DB65TKWC.js";
import {
  require_node_fs,
  require_node_path,
  require_node_perf_hooks,
  require_node_process,
  require_promises
} from "./chunk-22N36SHE.js";
import {
  require_url
} from "./chunk-S5LLOYK2.js";
import {
  require_fs
} from "./chunk-3AHSGBK4.js";
import {
  require_path
} from "./chunk-ZB4G6MVN.js";
import {
  require_node_http
} from "./chunk-GL6B4O4A.js";
import {
  require_node_https
} from "./chunk-PS6RWICK.js";
import {
  __publicField,
  __toESM
} from "./chunk-6PRBTMBS.js";

// node_modules/vite/dist/node/index.js
var import_esbuild = __toESM(require_main());
var import_node_fs = __toESM(require_node_fs());
var import_node_path = __toESM(require_node_path());
var import_promises = __toESM(require_promises());
var import_node_url = __toESM(require_node_url());
var import_node_util = __toESM(require_node_util());
var import_node_perf_hooks = __toESM(require_node_perf_hooks());
var import_node_module = __toESM(require_node_module());
var import_node_crypto = __toESM(require_node_crypto());
var import_picomatch = __toESM(require_picomatch());
var import_path = __toESM(require_path());
var import_fs = __toESM(require_fs());
var import_fdir = __toESM(require_dist());
var import_node_child_process = __toESM(require_node_child_process());
var import_node_http = __toESM(require_node_http());
var import_node_https = __toESM(require_node_https());
var import_tty = __toESM(require_tty());
var import_util = __toESM(require_util());
var import_net = __toESM(require_net());
var import_events = __toESM(require_events());
var import_url = __toESM(require_url());
var import_http = __toESM(require_http());
var import_stream = __toESM(require_stream());
var import_os = __toESM(require_os());
var import_child_process = __toESM(require_child_process());
var import_node_os = __toESM(require_node_os());
var import_node_net = __toESM(require_node_net());
var import_node_dns = __toESM(require_node_dns());
var import_node_buffer = __toESM(require_node_buffer());
var import_module = __toESM(require_module());
var import_node_readline = __toESM(require_node_readline());
var import_node_process = __toESM(require_node_process());
var import_node_events = __toESM(require_node_events());
var import_crypto = __toESM(require_crypto());
var import_node_assert = __toESM(require_node_assert());
var import_node_v8 = __toESM(require_node_v8());
var import_node_worker_threads = __toESM(require_node_worker_threads());
var import_https = __toESM(require_https());
var import_tls = __toESM(require_tls());
var import_zlib = __toESM(require_zlib());
var import_buffer = __toESM(require_buffer());
var import_assert = __toESM(require_assert());
var import_node_querystring = __toESM(require_node_querystring());
var import_node_zlib = __toESM(require_node_zlib());
var CSS_LANGS_RE = (
  // eslint-disable-next-line regexp/no-unused-capturing-group
  /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
);
var isCSSRequest = (request) => CSS_LANGS_RE.test(request);
var SplitVendorChunkCache = class {
  constructor() {
    __publicField(this, "cache");
    this.cache = /* @__PURE__ */ new Map();
  }
  reset() {
    this.cache = /* @__PURE__ */ new Map();
  }
};
function splitVendorChunk(options = {}) {
  const cache = options.cache ?? new SplitVendorChunkCache();
  return (id, { getModuleInfo }) => {
    if (isInNodeModules$1(id) && !isCSSRequest(id) && staticImportedByEntry(id, getModuleInfo, cache.cache)) {
      return "vendor";
    }
  };
}
function staticImportedByEntry(id, getModuleInfo, cache, importStack = []) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  if (importStack.includes(id)) {
    cache.set(id, false);
    return false;
  }
  const mod = getModuleInfo(id);
  if (!mod) {
    cache.set(id, false);
    return false;
  }
  if (mod.isEntry) {
    cache.set(id, true);
    return true;
  }
  const someImporterIs = mod.importers.some(
    (importer) => staticImportedByEntry(
      importer,
      getModuleInfo,
      cache,
      importStack.concat(id)
    )
  );
  cache.set(id, someImporterIs);
  return someImporterIs;
}
function splitVendorChunkPlugin() {
  const caches = [];
  function createSplitVendorChunk(output, config) {
    const cache = new SplitVendorChunkCache();
    caches.push(cache);
    const build2 = config.build ?? {};
    const format = output.format;
    if (!build2.ssr && !build2.lib && format !== "umd" && format !== "iife") {
      return splitVendorChunk({ cache });
    }
  }
  return {
    name: "vite:split-vendor-chunk",
    config(config) {
      var _a, _b;
      let outputs = (_b = (_a = config.build) == null ? void 0 : _a.rollupOptions) == null ? void 0 : _b.output;
      if (outputs) {
        outputs = arraify(outputs);
        for (const output of outputs) {
          const viteManualChunks = createSplitVendorChunk(output, config);
          if (viteManualChunks) {
            if (output.manualChunks) {
              if (typeof output.manualChunks === "function") {
                const userManualChunks = output.manualChunks;
                output.manualChunks = (id, api) => {
                  return userManualChunks(id, api) ?? viteManualChunks(id, api);
                };
              } else {
                console.warn(
                  "(!) the `splitVendorChunk` plugin doesn't have any effect when using the object form of `build.rollupOptions.output.manualChunks`. Consider using the function form instead."
                );
              }
            } else {
              output.manualChunks = viteManualChunks;
            }
          }
        }
      } else {
        return {
          build: {
            rollupOptions: {
              output: {
                manualChunks: createSplitVendorChunk({}, config)
              }
            }
          }
        };
      }
    },
    buildStart() {
      caches.forEach((cache) => cache.reset());
    }
  };
}
function createFetchableDevEnvironment(name, config, context) {
  if (typeof Request === "undefined" || typeof Response === "undefined") {
    throw new TypeError(
      "FetchableDevEnvironment requires a global `Request` and `Response` object."
    );
  }
  if (!context.handleRequest) {
    throw new TypeError(
      "FetchableDevEnvironment requires a `handleRequest` method during initialisation."
    );
  }
  return new FetchableDevEnvironment(name, config, context);
}
function isFetchableDevEnvironment(environment) {
  return environment instanceof FetchableDevEnvironment;
}
var FetchableDevEnvironment = class extends DevEnvironment {
  constructor(name, config, context) {
    super(name, config, context);
    __publicField(this, "_handleRequest");
    this._handleRequest = context.handleRequest;
  }
  async dispatchFetch(request) {
    if (!(request instanceof Request)) {
      throw new TypeError(
        "FetchableDevEnvironment `dispatchFetch` must receive a `Request` object."
      );
    }
    const response = await this._handleRequest(request);
    if (!(response instanceof Response)) {
      throw new TypeError(
        "FetchableDevEnvironment `context.handleRequest` must return a `Response` object."
      );
    }
    return response;
  }
};

export {
  isCSSRequest,
  splitVendorChunk,
  splitVendorChunkPlugin,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
  import_esbuild
};
//# sourceMappingURL=chunk-CRVGY2LA.js.map
