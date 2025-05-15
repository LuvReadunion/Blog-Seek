import {
  isCSSRequest
} from "./chunk-CRVGY2LA.js";
import {
  createFilter$1,
  formatPostcssSourceMap,
  normalizePath$3,
  require_node_crypto,
  require_node_module,
  require_tty,
  transformWithEsbuild
} from "./chunk-CQBIE7UF.js";
import {
  require_util
} from "./chunk-DB65TKWC.js";
import {
  require_node_fs,
  require_node_path
} from "./chunk-22N36SHE.js";
import "./chunk-S5LLOYK2.js";
import "./chunk-3AHSGBK4.js";
import "./chunk-ZB4G6MVN.js";
import {
  computed,
  shallowRef
} from "./chunk-IJV5NOMV.js";
import "./chunk-GL6B4O4A.js";
import "./chunk-PS6RWICK.js";
import {
  __require,
  __toESM
} from "./chunk-6PRBTMBS.js";

// node_modules/@vitejs/plugin-vue/dist/index.mjs
var import_node_fs = __toESM(require_node_fs(), 1);
var import_node_module = __toESM(require_node_module(), 1);
var import_node_path = __toESM(require_node_path(), 1);
var import_node_crypto = __toESM(require_node_crypto(), 1);
var import_tty = __toESM(require_tty(), 1);
var import_util = __toESM(require_util(), 1);
var version = "5.2.4";
function resolveCompiler(root) {
  const compiler = tryResolveCompiler(root) || tryResolveCompiler();
  if (!compiler) {
    throw new Error(
      `Failed to resolve vue/compiler-sfc.
@vitejs/plugin-vue requires vue (>=3.2.25) to be present in the dependency tree.`
    );
  }
  return compiler;
}
function tryResolveCompiler(root) {
  const vueMeta = tryRequire("vue/package.json", root);
  if (vueMeta && vueMeta.version.split(".")[0] >= 3) {
    return tryRequire("vue/compiler-sfc", root);
  }
}
var _require = (0, import_node_module.createRequire)(import.meta.url);
function tryRequire(id, from) {
  try {
    return from ? _require(_require.resolve(id, { paths: [from] })) : _require(id);
  } catch (e) {
  }
}
function parseVueRequest(id) {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query = Object.fromEntries(new URLSearchParams(rawQuery));
  if (query.vue != null) {
    query.vue = true;
  }
  if (query.index != null) {
    query.index = Number(query.index);
  }
  if (query.raw != null) {
    query.raw = true;
  }
  if (query.url != null) {
    query.url = true;
  }
  if (query.scoped != null) {
    query.scoped = true;
  }
  return {
    filename,
    query
  };
}
var cache = /* @__PURE__ */ new Map();
var hmrCache = /* @__PURE__ */ new Map();
var prevCache = /* @__PURE__ */ new Map();
function createDescriptor(filename, source, {
  root,
  isProduction,
  sourceMap,
  compiler,
  template,
  features
}, hmr = false) {
  const { descriptor, errors } = compiler.parse(source, {
    filename,
    sourceMap,
    templateParseOptions: template == null ? void 0 : template.compilerOptions
  });
  const normalizedPath = normalizePath$3(import_node_path.default.relative(root, filename));
  const componentIdGenerator = features == null ? void 0 : features.componentIdGenerator;
  if (componentIdGenerator === "filepath") {
    descriptor.id = getHash(normalizedPath);
  } else if (componentIdGenerator === "filepath-source") {
    descriptor.id = getHash(normalizedPath + source);
  } else if (typeof componentIdGenerator === "function") {
    descriptor.id = componentIdGenerator(
      normalizedPath,
      source,
      isProduction,
      getHash
    );
  } else {
    descriptor.id = getHash(normalizedPath + (isProduction ? source : ""));
  }
  (hmr ? hmrCache : cache).set(filename, descriptor);
  return { descriptor, errors };
}
function getPrevDescriptor(filename) {
  return prevCache.get(filename);
}
function invalidateDescriptor(filename, hmr = false) {
  const _cache = hmr ? hmrCache : cache;
  const prev = _cache.get(filename);
  _cache.delete(filename);
  if (prev) {
    prevCache.set(filename, prev);
  }
}
function getDescriptor(filename, options, createIfNotFound = true, hmr = false, code) {
  const _cache = hmr ? hmrCache : cache;
  if (_cache.has(filename)) {
    return _cache.get(filename);
  }
  if (createIfNotFound) {
    const { descriptor, errors } = createDescriptor(
      filename,
      code ?? import_node_fs.default.readFileSync(filename, "utf-8"),
      options,
      hmr
    );
    if (errors.length && !hmr) {
      throw errors[0];
    }
    return descriptor;
  }
}
function getSrcDescriptor(filename, query) {
  if (query.scoped) {
    return cache.get(`${filename}?src=${query.src}`);
  }
  return cache.get(filename);
}
function getTempSrcDescriptor(filename, query) {
  return {
    filename,
    id: query.id || "",
    styles: [
      {
        scoped: query.scoped,
        loc: {
          start: { line: 0, column: 0 }
        }
      }
    ],
    isTemp: true
  };
}
function setSrcDescriptor(filename, entry, scoped) {
  if (scoped) {
    cache.set(`${filename}?src=${entry.id}`, entry);
    return;
  }
  cache.set(filename, entry);
}
var hash = (
  // eslint-disable-next-line n/no-unsupported-features/node-builtins -- crypto.hash is supported in Node 21.7.0+, 20.12.0+
  import_node_crypto.default.hash ?? ((algorithm, data, outputEncoding) => import_node_crypto.default.createHash(algorithm).update(data).digest(outputEncoding))
);
function getHash(text) {
  return hash("sha256", text, "hex").substring(0, 8);
}
function slash(path2) {
  const isExtendedLengthPath = path2.startsWith("\\\\?\\");
  if (isExtendedLengthPath) {
    return path2;
  }
  return path2.replace(/\\/g, "/");
}
function createRollupError(id, error) {
  const { message, name, stack } = error;
  const rollupError = {
    id,
    plugin: "vue",
    message,
    name,
    stack
  };
  if ("code" in error && error.loc) {
    rollupError.loc = {
      file: id,
      line: error.loc.start.line,
      column: error.loc.start.column
    };
  }
  return rollupError;
}
async function transformTemplateAsModule(code, descriptor, options, pluginContext, ssr, customElement) {
  const result = compile(
    code,
    descriptor,
    options,
    pluginContext,
    ssr,
    customElement
  );
  let returnCode = result.code;
  if (options.devServer && options.devServer.config.server.hmr !== false && !ssr && !options.isProduction) {
    returnCode += `
import.meta.hot.accept(({ render }) => {
      __VUE_HMR_RUNTIME__.rerender(${JSON.stringify(descriptor.id)}, render)
    })`;
  }
  return {
    code: returnCode,
    map: result.map
  };
}
function transformTemplateInMain(code, descriptor, options, pluginContext, ssr, customElement) {
  const result = compile(
    code,
    descriptor,
    options,
    pluginContext,
    ssr,
    customElement
  );
  return {
    ...result,
    code: result.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      "\n$1 _sfc_$2"
    )
  };
}
function compile(code, descriptor, options, pluginContext, ssr, customElement) {
  const filename = descriptor.filename;
  resolveScript(descriptor, options, ssr, customElement);
  const result = options.compiler.compileTemplate({
    ...resolveTemplateCompilerOptions(descriptor, options, ssr),
    source: code
  });
  if (result.errors.length) {
    result.errors.forEach(
      (error) => pluginContext.error(
        typeof error === "string" ? { id: filename, message: error } : createRollupError(filename, error)
      )
    );
  }
  if (result.tips.length) {
    result.tips.forEach(
      (tip) => pluginContext.warn({
        id: filename,
        message: tip
      })
    );
  }
  return result;
}
function resolveTemplateCompilerOptions(descriptor, options, ssr) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const block = descriptor.template;
  if (!block) {
    return;
  }
  const resolvedScript = getResolvedScript(descriptor, ssr);
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  const { id, filename, cssVars } = descriptor;
  let transformAssetUrls = (_a = options.template) == null ? void 0 : _a.transformAssetUrls;
  let assetUrlOptions;
  if (transformAssetUrls === false) ;
  else if (options.devServer) {
    if (filename.startsWith(options.root)) {
      const devBase = options.devServer.config.base;
      assetUrlOptions = {
        base: (((_b = options.devServer.config.server) == null ? void 0 : _b.origin) ?? "") + devBase + slash(import_node_path.default.relative(options.root, import_node_path.default.dirname(filename))),
        includeAbsolute: !!devBase
      };
    }
  } else {
    assetUrlOptions = {
      includeAbsolute: true
    };
  }
  if (transformAssetUrls && typeof transformAssetUrls === "object") {
    if (Object.values(transformAssetUrls).some((val) => Array.isArray(val))) {
      transformAssetUrls = {
        ...assetUrlOptions,
        tags: transformAssetUrls
      };
    } else {
      transformAssetUrls = { ...assetUrlOptions, ...transformAssetUrls };
    }
  } else {
    transformAssetUrls = assetUrlOptions;
  }
  let preprocessOptions = block.lang && ((_c = options.template) == null ? void 0 : _c.preprocessOptions);
  if (block.lang === "pug") {
    preprocessOptions = {
      doctype: "html",
      ...preprocessOptions
    };
  }
  const expressionPlugins = ((_e = (_d = options.template) == null ? void 0 : _d.compilerOptions) == null ? void 0 : _e.expressionPlugins) || [];
  const lang = ((_f = descriptor.scriptSetup) == null ? void 0 : _f.lang) || ((_g = descriptor.script) == null ? void 0 : _g.lang);
  if (lang && /tsx?$/.test(lang) && !expressionPlugins.includes("typescript")) {
    expressionPlugins.push("typescript");
  }
  return {
    ...options.template,
    // @ts-expect-error TODO remove when 3.6 is out
    vapor: descriptor.vapor,
    id,
    ast: canReuseAST(options.compiler.version) ? (_h = descriptor.template) == null ? void 0 : _h.ast : void 0,
    filename,
    scoped: hasScoped,
    slotted: descriptor.slotted,
    isProd: options.isProduction,
    inMap: block.src ? void 0 : block.map,
    ssr,
    ssrCssVars: cssVars,
    transformAssetUrls,
    preprocessLang: block.lang === "html" ? void 0 : block.lang,
    preprocessOptions,
    compilerOptions: {
      ...(_i = options.template) == null ? void 0 : _i.compilerOptions,
      scopeId: hasScoped ? `data-v-${id}` : void 0,
      bindingMetadata: resolvedScript ? resolvedScript.bindings : void 0,
      expressionPlugins,
      sourceMap: options.sourceMap
    }
  };
}
function canReuseAST(version2) {
  if (version2) {
    const [_, minor, patch] = version2.split(".").map(Number);
    if (minor >= 4 && patch >= 3) {
      return true;
    }
  }
  return false;
}
var clientCache = /* @__PURE__ */ new WeakMap();
var ssrCache = /* @__PURE__ */ new WeakMap();
var typeDepToSFCMap = /* @__PURE__ */ new Map();
function invalidateScript(filename) {
  const desc = cache.get(filename);
  if (desc) {
    clientCache.delete(desc);
    ssrCache.delete(desc);
  }
}
function getResolvedScript(descriptor, ssr) {
  return (ssr ? ssrCache : clientCache).get(descriptor);
}
function setResolvedScript(descriptor, script, ssr) {
  (ssr ? ssrCache : clientCache).set(descriptor, script);
}
function clearScriptCache() {
  clientCache = /* @__PURE__ */ new WeakMap();
  ssrCache = /* @__PURE__ */ new WeakMap();
}
function isUseInlineTemplate(descriptor, options) {
  var _a;
  return !options.devServer && !options.devToolsEnabled && !!descriptor.scriptSetup && !((_a = descriptor.template) == null ? void 0 : _a.src);
}
var scriptIdentifier = `_sfc_main`;
function resolveScript(descriptor, options, ssr, customElement) {
  var _a, _b;
  if (!descriptor.script && !descriptor.scriptSetup) {
    return null;
  }
  const cached = getResolvedScript(descriptor, ssr);
  if (cached) {
    return cached;
  }
  const resolved = options.compiler.compileScript(descriptor, {
    ...options.script,
    id: descriptor.id,
    isProd: options.isProduction,
    inlineTemplate: isUseInlineTemplate(descriptor, options),
    templateOptions: resolveTemplateCompilerOptions(descriptor, options, ssr),
    sourceMap: options.sourceMap,
    genDefaultAs: canInlineMain(descriptor, options) ? scriptIdentifier : void 0,
    customElement,
    propsDestructure: ((_a = options.features) == null ? void 0 : _a.propsDestructure) ?? ((_b = options.script) == null ? void 0 : _b.propsDestructure)
  });
  if (!options.isProduction && (resolved == null ? void 0 : resolved.deps)) {
    for (const [key, sfcs] of typeDepToSFCMap) {
      if (sfcs.has(descriptor.filename) && !resolved.deps.includes(key)) {
        sfcs.delete(descriptor.filename);
      }
    }
    for (const dep of resolved.deps) {
      const existingSet = typeDepToSFCMap.get(dep);
      if (!existingSet) {
        typeDepToSFCMap.set(dep, /* @__PURE__ */ new Set([descriptor.filename]));
      } else {
        existingSet.add(descriptor.filename);
      }
    }
  }
  setResolvedScript(descriptor, resolved, ssr);
  return resolved;
}
function canInlineMain(descriptor, options) {
  var _a, _b, _c, _d;
  if (((_a = descriptor.script) == null ? void 0 : _a.src) || ((_b = descriptor.scriptSetup) == null ? void 0 : _b.src)) {
    return false;
  }
  const lang = ((_c = descriptor.script) == null ? void 0 : _c.lang) || ((_d = descriptor.scriptSetup) == null ? void 0 : _d.lang);
  if (!lang || lang === "js") {
    return true;
  }
  if (lang === "ts" && options.devServer) {
    return true;
  }
  return false;
}
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
function decodeInteger(reader, relative) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c = reader.next();
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) {
    value = -2147483648 | -value;
  }
  return relative + value;
}
function encodeInteger(builder, num, relative) {
  let delta = num - relative;
  delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
  do {
    let clamped = delta & 31;
    delta >>>= 5;
    if (delta > 0)
      clamped |= 32;
    builder.write(intToChar[clamped]);
  } while (delta > 0);
  return num;
}
function hasMoreVlq(reader, max) {
  if (reader.pos >= max)
    return false;
  return reader.peek() !== comma;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? new TextDecoder() : typeof Buffer !== "undefined" ? {
  decode(buf) {
    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    return out.toString();
  }
} : {
  decode(buf) {
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }
};
var StringWriter = class {
  constructor() {
    this.pos = 0;
    this.out = "";
    this.buffer = new Uint8Array(bufLength);
  }
  write(v) {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }
  flush() {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
};
var StringReader = class {
  constructor(buffer) {
    this.pos = 0;
    this.buffer = buffer;
  }
  next() {
    return this.buffer.charCodeAt(this.pos++);
  }
  peek() {
    return this.buffer.charCodeAt(this.pos);
  }
  indexOf(char) {
    const { buffer, pos } = this;
    const idx = buffer.indexOf(char, pos);
    return idx === -1 ? buffer.length : idx;
  }
};
function decode(mappings) {
  const { length } = mappings;
  const reader = new StringReader(mappings);
  const decoded = [];
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  do {
    const semi = reader.indexOf(";");
    const line = [];
    let sorted = true;
    let lastCol = 0;
    genColumn = 0;
    while (reader.pos < semi) {
      let seg;
      genColumn = decodeInteger(reader, genColumn);
      if (genColumn < lastCol)
        sorted = false;
      lastCol = genColumn;
      if (hasMoreVlq(reader, semi)) {
        sourcesIndex = decodeInteger(reader, sourcesIndex);
        sourceLine = decodeInteger(reader, sourceLine);
        sourceColumn = decodeInteger(reader, sourceColumn);
        if (hasMoreVlq(reader, semi)) {
          namesIndex = decodeInteger(reader, namesIndex);
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
        } else {
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
        }
      } else {
        seg = [genColumn];
      }
      line.push(seg);
      reader.pos++;
    }
    if (!sorted)
      sort(line);
    decoded.push(line);
    reader.pos = semi + 1;
  } while (reader.pos <= length);
  return decoded;
}
function sort(line) {
  line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
  return a[0] - b[0];
}
function encode(decoded) {
  const writer = new StringWriter();
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0)
      writer.write(semicolon);
    if (line.length === 0)
      continue;
    let genColumn = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (j > 0)
        writer.write(comma);
      genColumn = encodeInteger(writer, segment[0], genColumn);
      if (segment.length === 1)
        continue;
      sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
      sourceLine = encodeInteger(writer, segment[2], sourceLine);
      sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
      if (segment.length === 4)
        continue;
      namesIndex = encodeInteger(writer, segment[4], namesIndex);
    }
  }
  return writer.flush();
}
var schemeRegex = /^[\w+.-]+:\/\//;
var urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
var fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function isAbsoluteUrl(input) {
  return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
  return input.startsWith("//");
}
function isAbsolutePath(input) {
  return input.startsWith("/");
}
function isFileUrl(input) {
  return input.startsWith("file:");
}
function isRelative(input) {
  return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
  const match = urlRegex.exec(input);
  return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
  const match = fileRegex.exec(input);
  const path2 = match[2];
  return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path2) ? path2 : "/" + path2, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path2, query, hash2) {
  return {
    scheme,
    user,
    host,
    port,
    path: path2,
    query,
    hash: hash2,
    type: 7
  };
}
function parseUrl(input) {
  if (isSchemeRelativeUrl(input)) {
    const url2 = parseAbsoluteUrl("http:" + input);
    url2.scheme = "";
    url2.type = 6;
    return url2;
  }
  if (isAbsolutePath(input)) {
    const url2 = parseAbsoluteUrl("http://foo.com" + input);
    url2.scheme = "";
    url2.host = "";
    url2.type = 5;
    return url2;
  }
  if (isFileUrl(input))
    return parseFileUrl(input);
  if (isAbsoluteUrl(input))
    return parseAbsoluteUrl(input);
  const url = parseAbsoluteUrl("http://foo.com/" + input);
  url.scheme = "";
  url.host = "";
  url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
  return url;
}
function stripPathFilename(path2) {
  if (path2.endsWith("/.."))
    return path2;
  const index = path2.lastIndexOf("/");
  return path2.slice(0, index + 1);
}
function mergePaths(url, base) {
  normalizePath(base, base.type);
  if (url.path === "/") {
    url.path = base.path;
  } else {
    url.path = stripPathFilename(base.path) + url.path;
  }
}
function normalizePath(url, type) {
  const rel = type <= 4;
  const pieces = url.path.split("/");
  let pointer = 1;
  let positive = 0;
  let addTrailingSlash = false;
  for (let i = 1; i < pieces.length; i++) {
    const piece = pieces[i];
    if (!piece) {
      addTrailingSlash = true;
      continue;
    }
    addTrailingSlash = false;
    if (piece === ".")
      continue;
    if (piece === "..") {
      if (positive) {
        addTrailingSlash = true;
        positive--;
        pointer--;
      } else if (rel) {
        pieces[pointer++] = piece;
      }
      continue;
    }
    pieces[pointer++] = piece;
    positive++;
  }
  let path2 = "";
  for (let i = 1; i < pointer; i++) {
    path2 += "/" + pieces[i];
  }
  if (!path2 || addTrailingSlash && !path2.endsWith("/..")) {
    path2 += "/";
  }
  url.path = path2;
}
function resolve$1(input, base) {
  if (!input && !base)
    return "";
  const url = parseUrl(input);
  let inputType = url.type;
  if (base && inputType !== 7) {
    const baseUrl = parseUrl(base);
    const baseType = baseUrl.type;
    switch (inputType) {
      case 1:
        url.hash = baseUrl.hash;
      // fall through
      case 2:
        url.query = baseUrl.query;
      // fall through
      case 3:
      case 4:
        mergePaths(url, baseUrl);
      // fall through
      case 5:
        url.user = baseUrl.user;
        url.host = baseUrl.host;
        url.port = baseUrl.port;
      // fall through
      case 6:
        url.scheme = baseUrl.scheme;
    }
    if (baseType > inputType)
      inputType = baseType;
  }
  normalizePath(url, inputType);
  const queryHash = url.query + url.hash;
  switch (inputType) {
    // This is impossible, because of the empty checks at the start of the function.
    // case UrlType.Empty:
    case 2:
    case 3:
      return queryHash;
    case 4: {
      const path2 = url.path.slice(1);
      if (!path2)
        return queryHash || ".";
      if (isRelative(base || input) && !isRelative(path2)) {
        return "./" + path2 + queryHash;
      }
      return path2 + queryHash;
    }
    case 5:
      return url.path + queryHash;
    default:
      return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
  }
}
function resolve(input, base) {
  if (base && !base.endsWith("/"))
    base += "/";
  return resolve$1(input, base);
}
function stripFilename(path2) {
  if (!path2)
    return "";
  const index = path2.lastIndexOf("/");
  return path2.slice(0, index + 1);
}
var COLUMN$1 = 0;
function maybeSort(mappings, owned) {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length)
    return mappings;
  if (!owned)
    mappings = mappings.slice();
  for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
    mappings[i] = sortSegments(mappings[i], owned);
  }
  return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
  for (let i = start; i < mappings.length; i++) {
    if (!isSorted(mappings[i]))
      return i;
  }
  return mappings.length;
}
function isSorted(line) {
  for (let j = 1; j < line.length; j++) {
    if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) {
      return false;
    }
  }
  return true;
}
function sortSegments(line, owned) {
  if (!owned)
    line = line.slice();
  return line.sort(sortComparator);
}
function sortComparator(a, b) {
  return a[COLUMN$1] - b[COLUMN$1];
}
function memoizedState() {
  return {
    lastKey: -1,
    lastNeedle: -1,
    lastIndex: -1
  };
}
var TraceMap = class {
  constructor(map, mapUrl) {
    const isString = typeof map === "string";
    if (!isString && map._decodedMemo)
      return map;
    const parsed = isString ? JSON.parse(map) : map;
    const { version: version2, file, names, sourceRoot, sources, sourcesContent } = parsed;
    this.version = version2;
    this.file = file;
    this.names = names || [];
    this.sourceRoot = sourceRoot;
    this.sources = sources;
    this.sourcesContent = sourcesContent;
    this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
    const from = resolve(sourceRoot || "", stripFilename(mapUrl));
    this.resolvedSources = sources.map((s) => resolve(s || "", from));
    const { mappings } = parsed;
    if (typeof mappings === "string") {
      this._encoded = mappings;
      this._decoded = void 0;
    } else {
      this._encoded = void 0;
      this._decoded = maybeSort(mappings, isString);
    }
    this._decodedMemo = memoizedState();
    this._bySources = void 0;
    this._bySourceMemos = void 0;
  }
};
function cast$2(map) {
  return map;
}
function decodedMappings(map) {
  var _a;
  return (_a = cast$2(map))._decoded || (_a._decoded = decode(cast$2(map)._encoded));
}
function eachMapping(map, cb) {
  const decoded = decodedMappings(map);
  const { names, resolvedSources } = map;
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      const generatedLine = i + 1;
      const generatedColumn = seg[0];
      let source = null;
      let originalLine = null;
      let originalColumn = null;
      let name = null;
      if (seg.length !== 1) {
        source = resolvedSources[seg[1]];
        originalLine = seg[2] + 1;
        originalColumn = seg[3];
      }
      if (seg.length === 5)
        name = names[seg[4]];
      cb({
        generatedLine,
        generatedColumn,
        source,
        originalLine,
        originalColumn,
        name
      });
    }
  }
}
var SetArray = class {
  constructor() {
    this._indexes = { __proto__: null };
    this.array = [];
  }
};
function cast$1(set) {
  return set;
}
function get(setarr, key) {
  return cast$1(setarr)._indexes[key];
}
function put(setarr, key) {
  const index = get(setarr, key);
  if (index !== void 0)
    return index;
  const { array, _indexes: indexes } = cast$1(setarr);
  const length = array.push(key);
  return indexes[key] = length - 1;
}
var COLUMN = 0;
var NO_NAME = -1;
var GenMapping = class {
  constructor({ file, sourceRoot } = {}) {
    this._names = new SetArray();
    this._sources = new SetArray();
    this._sourcesContent = [];
    this._mappings = [];
    this.file = file;
    this.sourceRoot = sourceRoot;
    this._ignoreList = new SetArray();
  }
};
function cast(map) {
  return map;
}
function addMapping(map, mapping) {
  return addMappingInternal(false, map, mapping);
}
function toDecodedMap(map) {
  const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names, _ignoreList: ignoreList2 } = cast(map);
  removeEmptyFinalLines(mappings);
  return {
    version: 3,
    file: map.file || void 0,
    names: names.array,
    sourceRoot: map.sourceRoot || void 0,
    sources: sources.array,
    sourcesContent,
    mappings,
    ignoreList: ignoreList2.array
  };
}
function toEncodedMap(map) {
  const decoded = toDecodedMap(map);
  return Object.assign(Object.assign({}, decoded), { mappings: encode(decoded.mappings) });
}
function fromMap(input) {
  const map = new TraceMap(input);
  const gen = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });
  putAll(cast(gen)._names, map.names);
  putAll(cast(gen)._sources, map.sources);
  cast(gen)._sourcesContent = map.sourcesContent || map.sources.map(() => null);
  cast(gen)._mappings = decodedMappings(map);
  if (map.ignoreList)
    putAll(cast(gen)._ignoreList, map.ignoreList);
  return gen;
}
function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
  const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = cast(map);
  const line = getLine(mappings, genLine);
  const index = getColumnIndex(line, genColumn);
  if (!source) {
    return insert(line, index, [genColumn]);
  }
  const sourcesIndex = put(sources, source);
  const namesIndex = name ? put(names, name) : NO_NAME;
  if (sourcesIndex === sourcesContent.length)
    sourcesContent[sourcesIndex] = content !== null && content !== void 0 ? content : null;
  return insert(line, index, name ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex] : [genColumn, sourcesIndex, sourceLine, sourceColumn]);
}
function getLine(mappings, index) {
  for (let i = mappings.length; i <= index; i++) {
    mappings[i] = [];
  }
  return mappings[index];
}
function getColumnIndex(line, genColumn) {
  let index = line.length;
  for (let i = index - 1; i >= 0; index = i--) {
    const current = line[i];
    if (genColumn >= current[COLUMN])
      break;
  }
  return index;
}
function insert(array, index, value) {
  for (let i = array.length; i > index; i--) {
    array[i] = array[i - 1];
  }
  array[index] = value;
}
function removeEmptyFinalLines(mappings) {
  const { length } = mappings;
  let len = length;
  for (let i = len - 1; i >= 0; len = i, i--) {
    if (mappings[i].length > 0)
      break;
  }
  if (len < length)
    mappings.length = len;
}
function putAll(setarr, array) {
  for (let i = 0; i < array.length; i++)
    put(setarr, array[i]);
}
function addMappingInternal(skipable, map, mapping) {
  const { generated, source, original, name, content } = mapping;
  if (!source) {
    return addSegmentInternal(skipable, map, generated.line - 1, generated.column, null, null, null, null, null);
  }
  return addSegmentInternal(skipable, map, generated.line - 1, generated.column, source, original.line - 1, original.column, name, content);
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash2 = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
        hash2 |= 0;
      }
      return createDebug.colors[Math.abs(hash2) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(" ", ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    const tty = import_tty.default;
    const util = import_util.default;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = __require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    src.exports = requireBrowser();
  } else {
    src.exports = requireNode();
  }
  return src.exports;
}
var srcExports = requireSrc();
var _debug = getDefaultExportFromCjs(srcExports);
var debug = _debug("vite:hmr");
var directRequestRE = /(?:\?|&)direct\b/;
async function handleHotUpdate({ file, modules, read }, options, customElement, typeDepModules) {
  const prevDescriptor = getDescriptor(file, options, false, true);
  if (!prevDescriptor) {
    return;
  }
  const content = await read();
  const { descriptor } = createDescriptor(file, content, options, true);
  let needRerender = false;
  const affectedModules = /* @__PURE__ */ new Set();
  const mainModule = getMainModule(modules);
  const templateModule = modules.find((m) => /type=template/.test(m.url));
  resolveScript(descriptor, options, false, customElement);
  const scriptChanged = hasScriptChanged(prevDescriptor, descriptor);
  if (scriptChanged) {
    affectedModules.add(getScriptModule(modules) || mainModule);
  }
  if (!isEqualBlock(descriptor.template, prevDescriptor.template)) {
    if (!scriptChanged) {
      setResolvedScript(
        descriptor,
        getResolvedScript(prevDescriptor, false),
        false
      );
    }
    affectedModules.add(templateModule);
    needRerender = true;
  }
  let didUpdateStyle = false;
  const prevStyles = prevDescriptor.styles || [];
  const nextStyles = descriptor.styles || [];
  if (prevDescriptor.cssVars.join("") !== descriptor.cssVars.join("")) {
    affectedModules.add(mainModule);
  }
  if (prevStyles.some((s) => s.scoped) !== nextStyles.some((s) => s.scoped)) {
    affectedModules.add(templateModule);
    affectedModules.add(mainModule);
  }
  for (let i = 0; i < nextStyles.length; i++) {
    const prev = prevStyles[i];
    const next = nextStyles[i];
    if (!prev || !isEqualBlock(prev, next)) {
      didUpdateStyle = true;
      const mod = modules.find(
        (m) => m.url.includes(`type=style&index=${i}`) && m.url.endsWith(`.${next.lang || "css"}`) && !directRequestRE.test(m.url)
      );
      if (mod) {
        affectedModules.add(mod);
        if (mod.url.includes("&inline")) {
          affectedModules.add(mainModule);
        }
      } else {
        affectedModules.add(mainModule);
      }
    }
  }
  if (prevStyles.length > nextStyles.length) {
    affectedModules.add(mainModule);
  }
  const prevCustoms = prevDescriptor.customBlocks || [];
  const nextCustoms = descriptor.customBlocks || [];
  if (prevCustoms.length !== nextCustoms.length) {
    affectedModules.add(mainModule);
  } else {
    for (let i = 0; i < nextCustoms.length; i++) {
      const prev = prevCustoms[i];
      const next = nextCustoms[i];
      if (!prev || !isEqualBlock(prev, next)) {
        const mod = modules.find(
          (m) => m.url.includes(`type=${prev.type}&index=${i}`)
        );
        if (mod) {
          affectedModules.add(mod);
        } else {
          affectedModules.add(mainModule);
        }
      }
    }
  }
  const updateType = [];
  if (needRerender) {
    updateType.push(`template`);
    if (!templateModule) {
      affectedModules.add(mainModule);
    } else if (mainModule && !affectedModules.has(mainModule)) {
      const styleImporters = [...mainModule.importers].filter(
        (m) => isCSSRequest(m.url)
      );
      styleImporters.forEach((m) => affectedModules.add(m));
    }
  }
  if (didUpdateStyle) {
    updateType.push(`style`);
  }
  if (updateType.length) {
    if (file.endsWith(".vue")) {
      invalidateDescriptor(file);
    } else {
      cache.set(file, descriptor);
    }
    debug(`[vue:update(${updateType.join("&")})] ${file}`);
  }
  return [...affectedModules, ...typeDepModules || []].filter(
    Boolean
  );
}
function isEqualBlock(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.src && b.src && a.src === b.src) return true;
  if (a.content !== b.content) return false;
  const keysA = Object.keys(a.attrs);
  const keysB = Object.keys(b.attrs);
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((key) => a.attrs[key] === b.attrs[key]);
}
function isOnlyTemplateChanged(prev, next) {
  return !hasScriptChanged(prev, next) && prev.styles.length === next.styles.length && prev.styles.every((s, i) => isEqualBlock(s, next.styles[i])) && prev.customBlocks.length === next.customBlocks.length && prev.customBlocks.every((s, i) => isEqualBlock(s, next.customBlocks[i]));
}
function deepEqual(obj1, obj2, excludeProps = [], deepParentsOfObj1 = []) {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  if (obj1 == null || obj2 == null || typeof obj1 !== "object" || deepParentsOfObj1.includes(obj1)) {
    return obj1 === obj2;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (excludeProps.includes(key)) {
      continue;
    }
    if (!deepEqual(obj1[key], obj2[key], excludeProps, [
      ...deepParentsOfObj1,
      obj1
    ])) {
      return false;
    }
  }
  return true;
}
function isEqualAst(prev, next) {
  if (typeof prev === "undefined" || typeof next === "undefined") {
    return prev === next;
  }
  if (prev.length !== next.length) {
    return false;
  }
  for (let i = 0; i < prev.length; i++) {
    const prevNode = prev[i];
    const nextNode = next[i];
    if (
      // deep equal, but ignore start/end/loc/range/leadingComments/trailingComments/innerComments
      !deepEqual(prevNode, nextNode, [
        "start",
        "end",
        "loc",
        "range",
        "leadingComments",
        "trailingComments",
        "innerComments",
        // https://github.com/vuejs/core/issues/11923
        // avoid comparing the following properties of typeParameters
        // as it may be imported from 3rd lib and complex to compare
        "_ownerScope",
        "_resolvedReference",
        "_resolvedElements"
      ])
    ) {
      return false;
    }
  }
  return true;
}
function hasScriptChanged(prev, next) {
  const prevScript = getResolvedScript(prev, false);
  const nextScript = getResolvedScript(next, false);
  if (!isEqualBlock(prev.script, next.script) && !isEqualAst(prevScript == null ? void 0 : prevScript.scriptAst, nextScript == null ? void 0 : nextScript.scriptAst)) {
    return true;
  }
  if (!isEqualBlock(prev.scriptSetup, next.scriptSetup) && !isEqualAst(prevScript == null ? void 0 : prevScript.scriptSetupAst, nextScript == null ? void 0 : nextScript.scriptSetupAst)) {
    return true;
  }
  const prevResolvedScript = getResolvedScript(prev, false);
  const prevImports = prevResolvedScript == null ? void 0 : prevResolvedScript.imports;
  if (prevImports) {
    return !next.template || next.shouldForceReload(prevImports);
  }
  return false;
}
function getMainModule(modules) {
  return modules.filter((m) => !/type=/.test(m.url) || /type=script/.test(m.url)).sort((m1, m2) => {
    return m1.url.length - m2.url.length;
  })[0];
}
function getScriptModule(modules) {
  return modules.find((m) => /type=script.*&lang\.\w+$/.test(m.url));
}
function handleTypeDepChange(affectedComponents, { modules, server: { moduleGraph } }) {
  const affected = /* @__PURE__ */ new Set();
  for (const file of affectedComponents) {
    invalidateScript(file);
    const mods = moduleGraph.getModulesByFile(file);
    if (mods) {
      const arr = [...mods];
      affected.add(getScriptModule(arr) || getMainModule(arr));
    }
  }
  return [...modules, ...affected];
}
var EXPORT_HELPER_ID = "\0plugin-vue:export-helper";
var helperCode = `
export default (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
}
`;
async function transformMain(code, filename, options, pluginContext, ssr, customElement) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { devServer, isProduction, devToolsEnabled } = options;
  const prevDescriptor = getPrevDescriptor(filename);
  const { descriptor, errors } = createDescriptor(filename, code, options);
  if (import_node_fs.default.existsSync(filename)) {
    getDescriptor(
      filename,
      options,
      true,
      true,
      // for vue files, create descriptor from fs read to be consistent with
      // logic in handleHotUpdate()
      // for non vue files, e.g. md files in vitepress, we assume
      // `hmrContext.read` is overwritten so handleHotUpdate() is dealing with
      // post-transform code, so we populate the descriptor with post-transform
      // code here as well.
      filename.endsWith(".vue") ? void 0 : code
    );
  }
  if (errors.length) {
    errors.forEach(
      (error) => pluginContext.error(createRollupError(filename, error))
    );
    return null;
  }
  const attachedProps = [];
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  const { code: scriptCode, map: scriptMap } = await genScriptCode(
    descriptor,
    options,
    pluginContext,
    ssr,
    customElement
  );
  const hasTemplateImport = descriptor.template && !isUseInlineTemplate(descriptor, options);
  let templateCode = "";
  let templateMap = void 0;
  if (hasTemplateImport) {
    ({ code: templateCode, map: templateMap } = await genTemplateCode(
      descriptor,
      options,
      pluginContext,
      ssr,
      customElement
    ));
  }
  if (hasTemplateImport) {
    attachedProps.push(
      ssr ? ["ssrRender", "_sfc_ssrRender"] : ["render", "_sfc_render"]
    );
  } else {
    if (prevDescriptor && !isEqualBlock(descriptor.template, prevDescriptor.template)) {
      attachedProps.push([ssr ? "ssrRender" : "render", "() => {}"]);
    }
  }
  const stylesCode = await genStyleCode(
    descriptor,
    pluginContext,
    customElement,
    attachedProps
  );
  const customBlocksCode = await genCustomBlockCode(descriptor, pluginContext);
  const output = [
    scriptCode,
    templateCode,
    stylesCode,
    customBlocksCode
  ];
  if (hasScoped) {
    attachedProps.push([`__scopeId`, JSON.stringify(`data-v-${descriptor.id}`)]);
  }
  if (devToolsEnabled || devServer && !isProduction) {
    attachedProps.push([
      `__file`,
      JSON.stringify(isProduction ? import_node_path.default.basename(filename) : filename)
    ]);
  }
  if (devServer && devServer.config.server.hmr !== false && !ssr && !isProduction) {
    output.push(`_sfc_main.__hmrId = ${JSON.stringify(descriptor.id)}`);
    output.push(
      `typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)`
    );
    output.push(
      `import.meta.hot.on('file-changed', ({ file }) => {`,
      `  __VUE_HMR_RUNTIME__.CHANGED_FILE = file`,
      `})`
    );
    if (prevDescriptor && isOnlyTemplateChanged(prevDescriptor, descriptor)) {
      output.push(
        `export const _rerender_only = __VUE_HMR_RUNTIME__.CHANGED_FILE === ${JSON.stringify(normalizePath$3(filename))}`
      );
    }
    output.push(
      `import.meta.hot.accept(mod => {`,
      `  if (!mod) return`,
      `  const { default: updated, _rerender_only } = mod`,
      `  if (_rerender_only) {`,
      `    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)`,
      `  } else {`,
      `    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)`,
      `  }`,
      `})`
    );
  }
  if (ssr) {
    const normalizedFilename = normalizePath$3(
      import_node_path.default.relative(options.root, filename)
    );
    output.push(
      `import { useSSRContext as __vite_useSSRContext } from 'vue'`,
      `const _sfc_setup = _sfc_main.setup`,
      `_sfc_main.setup = (props, ctx) => {`,
      `  const ssrContext = __vite_useSSRContext()`,
      `  ;(ssrContext.modules || (ssrContext.modules = new Set())).add(${JSON.stringify(
        normalizedFilename
      )})`,
      `  return _sfc_setup ? _sfc_setup(props, ctx) : undefined`,
      `}`
    );
  }
  let resolvedMap = void 0;
  if (options.sourceMap) {
    if (templateMap) {
      const from = scriptMap ?? {
        file: filename,
        sourceRoot: "",
        version: 3,
        sources: [],
        sourcesContent: [],
        names: [],
        mappings: ""
      };
      const gen = fromMap(
        // version property of result.map is declared as string
        // but actually it is `3`
        from
      );
      const tracer = new TraceMap(
        // same above
        templateMap
      );
      const offset = (((_a = scriptCode.match(/\r?\n/g)) == null ? void 0 : _a.length) ?? 0) + 1;
      eachMapping(tracer, (m) => {
        if (m.source == null) return;
        addMapping(gen, {
          source: m.source,
          original: { line: m.originalLine, column: m.originalColumn },
          generated: {
            line: m.generatedLine + offset,
            column: m.generatedColumn
          }
        });
      });
      resolvedMap = toEncodedMap(gen);
      resolvedMap.sourcesContent = templateMap.sourcesContent;
    } else {
      resolvedMap = scriptMap;
    }
  }
  if (!attachedProps.length) {
    output.push(`export default _sfc_main`);
  } else {
    output.push(
      `import _export_sfc from '${EXPORT_HELPER_ID}'`,
      `export default /*#__PURE__*/_export_sfc(_sfc_main, [${attachedProps.map(([key, val]) => `['${key}',${val}]`).join(",")}])`
    );
  }
  let resolvedCode = output.join("\n");
  const lang = ((_b = descriptor.scriptSetup) == null ? void 0 : _b.lang) || ((_c = descriptor.script) == null ? void 0 : _c.lang);
  if (lang && /tsx?$/.test(lang) && !((_d = descriptor.script) == null ? void 0 : _d.src)) {
    const { transformWithOxc } = await import("./node-STQJ6BBR.js");
    if (transformWithOxc) {
      const { code: code2, map } = await transformWithOxc(
        resolvedCode,
        filename,
        {
          // #430 support decorators in .vue file
          // target can be overridden by oxc config target
          // @ts-ignore Rolldown-specific
          ...(_e = options.devServer) == null ? void 0 : _e.config.oxc,
          lang: "ts",
          sourcemap: options.sourceMap
        },
        resolvedMap
      );
      resolvedCode = code2;
      resolvedMap = resolvedMap ? map : resolvedMap;
    } else {
      const { code: code2, map } = await transformWithEsbuild(
        resolvedCode,
        filename,
        {
          target: "esnext",
          charset: "utf8",
          // #430 support decorators in .vue file
          // target can be overridden by esbuild config target
          ...(_f = options.devServer) == null ? void 0 : _f.config.esbuild,
          loader: "ts",
          sourcemap: options.sourceMap
        },
        resolvedMap
      );
      resolvedCode = code2;
      resolvedMap = resolvedMap ? map : resolvedMap;
    }
  }
  return {
    code: resolvedCode,
    map: resolvedMap || {
      mappings: ""
    },
    meta: {
      vite: {
        lang: ((_g = descriptor.script) == null ? void 0 : _g.lang) || ((_h = descriptor.scriptSetup) == null ? void 0 : _h.lang) || "js"
      }
    }
  };
}
async function genTemplateCode(descriptor, options, pluginContext, ssr, customElement) {
  const template = descriptor.template;
  const hasScoped = descriptor.styles.some((style) => style.scoped);
  if ((!template.lang || template.lang === "html") && !template.src) {
    return transformTemplateInMain(
      template.content,
      descriptor,
      options,
      pluginContext,
      ssr,
      customElement
    );
  } else {
    if (template.src) {
      await linkSrcToDescriptor(
        template.src,
        descriptor,
        pluginContext,
        hasScoped
      );
    }
    const src2 = template.src || descriptor.filename;
    const srcQuery = template.src ? hasScoped ? `&src=${descriptor.id}` : "&src=true" : "";
    const scopedQuery = hasScoped ? `&scoped=${descriptor.id}` : ``;
    const attrsQuery = attrsToQuery(template.attrs, "js", true);
    const query = `?vue&type=template${srcQuery}${scopedQuery}${attrsQuery}`;
    const request = JSON.stringify(src2 + query);
    const renderFnName = ssr ? "ssrRender" : "render";
    return {
      code: `import { ${renderFnName} as _sfc_${renderFnName} } from ${request}`,
      map: void 0
    };
  }
}
async function genScriptCode(descriptor, options, pluginContext, ssr, customElement) {
  var _a;
  const vaporFlag = descriptor.vapor ? "__vapor: true" : "";
  let scriptCode = `const ${scriptIdentifier} = { ${vaporFlag} }`;
  let map;
  const script = resolveScript(descriptor, options, ssr, customElement);
  if (script) {
    if (canInlineMain(descriptor, options)) {
      if (!options.compiler.version) {
        const userPlugins = ((_a = options.script) == null ? void 0 : _a.babelParserPlugins) || [];
        const defaultPlugins = script.lang === "ts" ? userPlugins.includes("decorators") ? ["typescript"] : ["typescript", "decorators-legacy"] : [];
        scriptCode = options.compiler.rewriteDefault(
          script.content,
          scriptIdentifier,
          [...defaultPlugins, ...userPlugins]
        );
      } else {
        scriptCode = script.content;
      }
      map = script.map;
    } else {
      if (script.src) {
        await linkSrcToDescriptor(script.src, descriptor, pluginContext, false);
      }
      const src2 = script.src || descriptor.filename;
      const langFallback = script.src && import_node_path.default.extname(src2).slice(1) || "js";
      const attrsQuery = attrsToQuery(script.attrs, langFallback);
      const srcQuery = script.src ? `&src=true` : ``;
      const query = `?vue&type=script${srcQuery}${attrsQuery}`;
      const request = JSON.stringify(src2 + query);
      scriptCode = `import _sfc_main from ${request}
export * from ${request}`;
    }
  }
  return {
    code: scriptCode,
    map
  };
}
async function genStyleCode(descriptor, pluginContext, customElement, attachedProps) {
  let stylesCode = ``;
  let cssModulesMap;
  if (descriptor.styles.length) {
    for (let i = 0; i < descriptor.styles.length; i++) {
      const style = descriptor.styles[i];
      if (style.src) {
        await linkSrcToDescriptor(
          style.src,
          descriptor,
          pluginContext,
          style.scoped
        );
      }
      const src2 = style.src || descriptor.filename;
      const attrsQuery = attrsToQuery(style.attrs, "css");
      const srcQuery = style.src ? style.scoped ? `&src=${descriptor.id}` : "&src=true" : "";
      const directQuery = customElement ? `&inline` : ``;
      const scopedQuery = style.scoped ? `&scoped=${descriptor.id}` : ``;
      const query = `?vue&type=style&index=${i}${srcQuery}${directQuery}${scopedQuery}`;
      const styleRequest = src2 + query + attrsQuery;
      if (style.module) {
        if (customElement) {
          throw new Error(
            `<style module> is not supported in custom elements mode.`
          );
        }
        const [importCode, nameMap] = genCSSModulesCode(
          i,
          styleRequest,
          style.module
        );
        stylesCode += importCode;
        Object.assign(cssModulesMap || (cssModulesMap = {}), nameMap);
      } else {
        if (customElement) {
          stylesCode += `
import _style_${i} from ${JSON.stringify(
            styleRequest
          )}`;
        } else {
          stylesCode += `
import ${JSON.stringify(styleRequest)}`;
        }
      }
    }
    if (customElement) {
      attachedProps.push([
        `styles`,
        `[${descriptor.styles.map((_, i) => `_style_${i}`).join(",")}]`
      ]);
    }
  }
  if (cssModulesMap) {
    const mappingCode = Object.entries(cssModulesMap).reduce(
      (code, [key, value]) => code + `"${key}":${value},
`,
      "{\n"
    ) + "}";
    stylesCode += `
const cssModules = ${mappingCode}`;
    attachedProps.push([`__cssModules`, `cssModules`]);
  }
  return stylesCode;
}
function genCSSModulesCode(index, request, moduleName) {
  const styleVar = `style${index}`;
  const exposedName = typeof moduleName === "string" ? moduleName : "$style";
  const moduleRequest = request.replace(/\.(\w+)$/, ".module.$1");
  return [
    `
import ${styleVar} from ${JSON.stringify(moduleRequest)}`,
    { [exposedName]: styleVar }
  ];
}
async function genCustomBlockCode(descriptor, pluginContext) {
  let code = "";
  for (let index = 0; index < descriptor.customBlocks.length; index++) {
    const block = descriptor.customBlocks[index];
    if (block.src) {
      await linkSrcToDescriptor(block.src, descriptor, pluginContext, false);
    }
    const src2 = block.src || descriptor.filename;
    const attrsQuery = attrsToQuery(block.attrs, block.type);
    const srcQuery = block.src ? `&src=true` : ``;
    const query = `?vue&type=${block.type}&index=${index}${srcQuery}${attrsQuery}`;
    const request = JSON.stringify(src2 + query);
    code += `import block${index} from ${request}
`;
    code += `if (typeof block${index} === 'function') block${index}(_sfc_main)
`;
  }
  return code;
}
async function linkSrcToDescriptor(src2, descriptor, pluginContext, scoped) {
  var _a;
  const srcFile = ((_a = await pluginContext.resolve(src2, descriptor.filename)) == null ? void 0 : _a.id) || src2;
  setSrcDescriptor(srcFile.replace(/\?.*$/, ""), descriptor, scoped);
}
var ignoreList = [
  "id",
  "index",
  "src",
  "type",
  "lang",
  "module",
  "scoped",
  "generic"
];
function attrsToQuery(attrs, langFallback, forceLangFallback = false) {
  let query = ``;
  for (const name in attrs) {
    const value = attrs[name];
    if (!ignoreList.includes(name)) {
      query += `&${encodeURIComponent(name)}${value ? `=${encodeURIComponent(value)}` : ``}`;
    }
  }
  if (langFallback || attrs.lang) {
    query += `lang` in attrs ? forceLangFallback ? `&lang.${langFallback}` : `&lang.${attrs.lang}` : `&lang.${langFallback}`;
  }
  return query;
}
async function transformStyle(code, descriptor, index, options, pluginContext, filename) {
  const block = descriptor.styles[index];
  const result = await options.compiler.compileStyleAsync({
    ...options.style,
    filename: descriptor.filename,
    id: `data-v-${descriptor.id}`,
    isProd: options.isProduction,
    source: code,
    scoped: block.scoped,
    ...options.cssDevSourcemap ? {
      postcssOptions: {
        map: {
          from: filename,
          inline: false,
          annotation: false
        }
      }
    } : {}
  });
  if (result.errors.length) {
    result.errors.forEach((error) => {
      if (error.line && error.column) {
        error.loc = {
          file: descriptor.filename,
          line: error.line + block.loc.start.line,
          column: error.column
        };
      }
      pluginContext.error(error);
    });
    return null;
  }
  const map = result.map ? await formatPostcssSourceMap(
    // version property of result.map is declared as string
    // but actually it is a number
    result.map,
    filename
  ) : { mappings: "" };
  return {
    code: result.code,
    map,
    meta: block.scoped && !descriptor.isTemp ? {
      vite: {
        cssScopeTo: [descriptor.filename, "default"]
      }
    } : void 0
  };
}
function vuePlugin(rawOptions = {}) {
  clearScriptCache();
  const options = shallowRef({
    isProduction: false,
    compiler: null,
    // to be set in buildStart
    include: /\.vue$/,
    customElement: /\.ce\.vue$/,
    ...rawOptions,
    root: process.cwd(),
    sourceMap: true,
    cssDevSourcemap: false
  });
  const filter = computed(
    () => createFilter$1(options.value.include, options.value.exclude)
  );
  const customElementFilter = computed(() => {
    var _a;
    const customElement = ((_a = options.value.features) == null ? void 0 : _a.customElement) || options.value.customElement;
    return typeof customElement === "boolean" ? () => customElement : createFilter$1(customElement);
  });
  let transformCachedModule = false;
  return {
    name: "vite:vue",
    api: {
      get options() {
        return options.value;
      },
      set options(value) {
        options.value = value;
      },
      version
    },
    handleHotUpdate(ctx) {
      ctx.server.ws.send({
        type: "custom",
        event: "file-changed",
        data: { file: normalizePath$3(ctx.file) }
      });
      if (options.value.compiler.invalidateTypeCache) {
        options.value.compiler.invalidateTypeCache(ctx.file);
      }
      let typeDepModules;
      const matchesFilter = filter.value(ctx.file);
      if (typeDepToSFCMap.has(ctx.file)) {
        typeDepModules = handleTypeDepChange(
          typeDepToSFCMap.get(ctx.file),
          ctx
        );
        if (!matchesFilter) return typeDepModules;
      }
      if (matchesFilter) {
        return handleHotUpdate(
          ctx,
          options.value,
          customElementFilter.value(ctx.file),
          typeDepModules
        );
      }
    },
    config(config) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const parseDefine = (v) => {
        try {
          return typeof v === "string" ? JSON.parse(v) : v;
        } catch (err) {
          return v;
        }
      };
      return {
        resolve: {
          dedupe: ((_a = config.build) == null ? void 0 : _a.ssr) ? [] : ["vue"]
        },
        define: {
          __VUE_OPTIONS_API__: ((_b = options.value.features) == null ? void 0 : _b.optionsAPI) ?? parseDefine((_c = config.define) == null ? void 0 : _c.__VUE_OPTIONS_API__) ?? true,
          __VUE_PROD_DEVTOOLS__: (((_d = options.value.features) == null ? void 0 : _d.prodDevtools) || parseDefine((_e = config.define) == null ? void 0 : _e.__VUE_PROD_DEVTOOLS__)) ?? false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: (((_f = options.value.features) == null ? void 0 : _f.prodHydrationMismatchDetails) || parseDefine(
            (_g = config.define) == null ? void 0 : _g.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__
          )) ?? false
        },
        ssr: {
          // @ts-ignore -- config.legacy.buildSsrCjsExternalHeuristics will be removed in Vite 5
          external: ((_h = config.legacy) == null ? void 0 : _h.buildSsrCjsExternalHeuristics) ? ["vue", "@vue/server-renderer"] : []
        }
      };
    },
    configResolved(config) {
      var _a, _b;
      options.value = {
        ...options.value,
        root: config.root,
        sourceMap: config.command === "build" ? !!config.build.sourcemap : true,
        cssDevSourcemap: ((_a = config.css) == null ? void 0 : _a.devSourcemap) ?? false,
        isProduction: config.isProduction,
        devToolsEnabled: !!(((_b = options.value.features) == null ? void 0 : _b.prodDevtools) || config.define.__VUE_PROD_DEVTOOLS__ || !config.isProduction)
      };
      const _warn = config.logger.warn;
      config.logger.warn = (...args) => {
        const msg = args[0];
        if (msg.match(
          /\[lightningcss\] '(deep|slotted|global)' is not recognized as a valid pseudo-/
        )) {
          return;
        }
        _warn(...args);
      };
      transformCachedModule = config.command === "build" && options.value.sourceMap && config.build.watch != null;
    },
    shouldTransformCachedModule({ id }) {
      if (transformCachedModule && parseVueRequest(id).query.vue) {
        return true;
      }
      return false;
    },
    configureServer(server) {
      options.value.devServer = server;
    },
    buildStart() {
      var _a;
      const compiler = options.value.compiler = options.value.compiler || resolveCompiler(options.value.root);
      if (compiler.invalidateTypeCache) {
        (_a = options.value.devServer) == null ? void 0 : _a.watcher.on("unlink", (file) => {
          compiler.invalidateTypeCache(file);
        });
      }
    },
    async resolveId(id) {
      if (id === EXPORT_HELPER_ID) {
        return id;
      }
      if (parseVueRequest(id).query.vue) {
        return id;
      }
    },
    load(id, opt) {
      if (id === EXPORT_HELPER_ID) {
        return helperCode;
      }
      const ssr = (opt == null ? void 0 : opt.ssr) === true;
      const { filename, query } = parseVueRequest(id);
      if (query.vue) {
        if (query.src) {
          return import_node_fs.default.readFileSync(filename, "utf-8");
        }
        const descriptor = getDescriptor(filename, options.value);
        let block;
        if (query.type === "script") {
          block = resolveScript(
            descriptor,
            options.value,
            ssr,
            customElementFilter.value(filename)
          );
        } else if (query.type === "template") {
          block = descriptor.template;
        } else if (query.type === "style") {
          block = descriptor.styles[query.index];
        } else if (query.index != null) {
          block = descriptor.customBlocks[query.index];
        }
        if (block) {
          return {
            code: block.content,
            map: block.map
          };
        }
      }
    },
    transform(code, id, opt) {
      const ssr = (opt == null ? void 0 : opt.ssr) === true;
      const { filename, query } = parseVueRequest(id);
      if (query.raw || query.url) {
        return;
      }
      if (!filter.value(filename) && !query.vue) {
        return;
      }
      if (!query.vue) {
        return transformMain(
          code,
          filename,
          options.value,
          this,
          ssr,
          customElementFilter.value(filename)
        );
      } else {
        const descriptor = query.src ? getSrcDescriptor(filename, query) || getTempSrcDescriptor(filename, query) : getDescriptor(filename, options.value);
        if (query.src) {
          this.addWatchFile(filename);
        }
        if (query.type === "template") {
          return transformTemplateAsModule(
            code,
            descriptor,
            options.value,
            this,
            ssr,
            customElementFilter.value(filename)
          );
        } else if (query.type === "style") {
          return transformStyle(
            code,
            descriptor,
            Number(query.index || 0),
            options.value,
            this,
            filename
          );
        }
      }
    }
  };
}
export {
  vuePlugin as default,
  parseVueRequest
};
//# sourceMappingURL=@vitejs_plugin-vue.js.map
