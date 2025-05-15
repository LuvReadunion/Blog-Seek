import {
  lib
} from "./chunk-SAJSMXRP.js";
import {
  getDefaultExportFromCjs,
  require_node_module
} from "./chunk-CQBIE7UF.js";
import "./chunk-DB65TKWC.js";
import "./chunk-22N36SHE.js";
import "./chunk-S5LLOYK2.js";
import "./chunk-3AHSGBK4.js";
import {
  require_path
} from "./chunk-ZB4G6MVN.js";
import "./chunk-GL6B4O4A.js";
import "./chunk-PS6RWICK.js";
import {
  __toESM
} from "./chunk-6PRBTMBS.js";

// node_modules/vite/dist/node/chunks/dep-SOJpRpBL.js
var import_path = __toESM(require_path(), 1);
var import_node_module = __toESM(require_node_module(), 1);
var __require = (0, import_node_module.createRequire)(import.meta.url);
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    var e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (var k in e) {
        if (k !== "default" && !(k in n)) {
          n[k] = e[k];
        }
      }
    }
  }
  return n;
}
var formatImportPrelude$2 = function formatImportPrelude(layer, media, supports) {
  const parts = [];
  if (typeof layer !== "undefined") {
    let layerParams = "layer";
    if (layer) {
      layerParams = `layer(${layer})`;
    }
    parts.push(layerParams);
  }
  if (typeof supports !== "undefined") {
    parts.push(`supports(${supports})`);
  }
  if (typeof media !== "undefined") {
    parts.push(media);
  }
  return parts.join(" ");
};
var formatImportPrelude$1 = formatImportPrelude$2;
var base64EncodedImport = function base64EncodedConditionalImport(prelude, conditions) {
  conditions.reverse();
  const first = conditions.pop();
  let params = `${prelude} ${formatImportPrelude$1(
    first.layer,
    first.media,
    first.supports
  )}`;
  for (const condition of conditions) {
    params = `'data:text/css;base64,${Buffer.from(`@import ${params}`).toString(
      "base64"
    )}' ${formatImportPrelude$1(
      condition.layer,
      condition.media,
      condition.supports
    )}`;
  }
  return params;
};
var base64EncodedConditionalImport2 = base64EncodedImport;
var applyConditions$1 = function applyConditions(bundle, atRule) {
  bundle.forEach((stmt) => {
    var _a;
    if (stmt.type === "charset" || stmt.type === "warning" || !((_a = stmt.conditions) == null ? void 0 : _a.length)) {
      return;
    }
    if (stmt.type === "import") {
      stmt.node.params = base64EncodedConditionalImport2(
        stmt.fullUri,
        stmt.conditions
      );
      return;
    }
    const { nodes } = stmt;
    const { parent } = nodes[0];
    const atRules = [];
    for (const condition of stmt.conditions) {
      if (typeof condition.media !== "undefined") {
        const mediaNode = atRule({
          name: "media",
          params: condition.media,
          source: parent.source
        });
        atRules.push(mediaNode);
      }
      if (typeof condition.supports !== "undefined") {
        const supportsNode = atRule({
          name: "supports",
          params: `(${condition.supports})`,
          source: parent.source
        });
        atRules.push(supportsNode);
      }
      if (typeof condition.layer !== "undefined") {
        const layerNode = atRule({
          name: "layer",
          params: condition.layer,
          source: parent.source
        });
        atRules.push(layerNode);
      }
    }
    const outerAtRule = atRules.shift();
    const innerAtRule = atRules.reduce((previous, next) => {
      previous.append(next);
      return next;
    }, outerAtRule);
    parent.insertBefore(nodes[0], outerAtRule);
    nodes.forEach((node) => {
      node.parent = void 0;
    });
    nodes[0].raws.before = nodes[0].raws.before || "\n";
    innerAtRule.append(nodes);
    stmt.type = "nodes";
    stmt.nodes = [outerAtRule];
    delete stmt.node;
  });
};
var applyRaws$1 = function applyRaws(bundle) {
  bundle.forEach((stmt, index2) => {
    if (index2 === 0) return;
    if (stmt.parent) {
      const { before } = stmt.parent.node.raws;
      if (stmt.type === "nodes") stmt.nodes[0].raws.before = before;
      else stmt.node.raws.before = before;
    } else if (stmt.type === "nodes") {
      stmt.nodes[0].raws.before = stmt.nodes[0].raws.before || "\n";
    }
  });
};
var applyStyles$1 = function applyStyles(bundle, styles) {
  styles.nodes = [];
  bundle.forEach((stmt) => {
    if (["charset", "import"].includes(stmt.type)) {
      stmt.node.parent = void 0;
      styles.append(stmt.node);
    } else if (stmt.type === "nodes") {
      stmt.nodes.forEach((node) => {
        node.parent = void 0;
        styles.append(node);
      });
    }
  });
};
var anyDataURLRegexp = /^data:text\/css(?:;(base64|plain))?,/i;
var base64DataURLRegexp = /^data:text\/css;base64,/i;
var plainDataURLRegexp = /^data:text\/css;plain,/i;
function isValid(url) {
  return anyDataURLRegexp.test(url);
}
function contents(url) {
  if (base64DataURLRegexp.test(url)) {
    return Buffer.from(url.slice(21), "base64").toString();
  }
  if (plainDataURLRegexp.test(url)) {
    return decodeURIComponent(url.slice(20));
  }
  return decodeURIComponent(url.slice(14));
}
var dataUrl = {
  isValid,
  contents
};
var valueParser = lib;
var { stringify } = valueParser;
var parseStatements$1 = function parseStatements(result, styles, conditions, from) {
  const statements = [];
  let nodes = [];
  styles.each((node) => {
    let stmt;
    if (node.type === "atrule") {
      if (node.name === "import")
        stmt = parseImport(result, node, conditions, from);
      else if (node.name === "charset")
        stmt = parseCharset(result, node, conditions, from);
    }
    if (stmt) {
      if (nodes.length) {
        statements.push({
          type: "nodes",
          nodes,
          conditions: [...conditions],
          from
        });
        nodes = [];
      }
      statements.push(stmt);
    } else nodes.push(node);
  });
  if (nodes.length) {
    statements.push({
      type: "nodes",
      nodes,
      conditions: [...conditions],
      from
    });
  }
  return statements;
};
function parseCharset(result, atRule, conditions, from) {
  if (atRule.prev()) {
    return result.warn("@charset must precede all other statements", {
      node: atRule
    });
  }
  return {
    type: "charset",
    node: atRule,
    conditions: [...conditions],
    from
  };
}
function parseImport(result, atRule, conditions, from) {
  var _a, _b;
  let prev = atRule.prev();
  if (prev) {
    do {
      if (prev.type === "comment" || prev.type === "atrule" && prev.name === "import") {
        prev = prev.prev();
        continue;
      }
      break;
    } while (prev);
  }
  if (prev) {
    do {
      if (prev.type === "comment" || prev.type === "atrule" && (prev.name === "charset" || prev.name === "layer" && !prev.nodes)) {
        prev = prev.prev();
        continue;
      }
      return result.warn(
        "@import must precede all other statements (besides @charset or empty @layer)",
        { node: atRule }
      );
    } while (prev);
  }
  if (atRule.nodes) {
    return result.warn(
      "It looks like you didn't end your @import statement correctly. Child nodes are attached to it.",
      { node: atRule }
    );
  }
  const params = valueParser(atRule.params).nodes;
  const stmt = {
    type: "import",
    uri: "",
    fullUri: "",
    node: atRule,
    conditions: [...conditions],
    from
  };
  let layer;
  let media;
  let supports;
  for (let i = 0; i < params.length; i++) {
    const node = params[i];
    if (node.type === "space" || node.type === "comment") continue;
    if (node.type === "string") {
      if (stmt.uri) {
        return result.warn(`Multiple url's in '${atRule.toString()}'`, {
          node: atRule
        });
      }
      if (!node.value) {
        return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
          node: atRule
        });
      }
      stmt.uri = node.value;
      stmt.fullUri = stringify(node);
      continue;
    }
    if (node.type === "function" && /^url$/i.test(node.value)) {
      if (stmt.uri) {
        return result.warn(`Multiple url's in '${atRule.toString()}'`, {
          node: atRule
        });
      }
      if (!((_b = (_a = node.nodes) == null ? void 0 : _a[0]) == null ? void 0 : _b.value)) {
        return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
          node: atRule
        });
      }
      stmt.uri = node.nodes[0].value;
      stmt.fullUri = stringify(node);
      continue;
    }
    if (!stmt.uri) {
      return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
        node: atRule
      });
    }
    if ((node.type === "word" || node.type === "function") && /^layer$/i.test(node.value)) {
      if (typeof layer !== "undefined") {
        return result.warn(`Multiple layers in '${atRule.toString()}'`, {
          node: atRule
        });
      }
      if (typeof supports !== "undefined") {
        return result.warn(
          `layers must be defined before support conditions in '${atRule.toString()}'`,
          {
            node: atRule
          }
        );
      }
      if (node.nodes) {
        layer = stringify(node.nodes);
      } else {
        layer = "";
      }
      continue;
    }
    if (node.type === "function" && /^supports$/i.test(node.value)) {
      if (typeof supports !== "undefined") {
        return result.warn(
          `Multiple support conditions in '${atRule.toString()}'`,
          {
            node: atRule
          }
        );
      }
      supports = stringify(node.nodes);
      continue;
    }
    media = stringify(params.slice(i));
    break;
  }
  if (!stmt.uri) {
    return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
      node: atRule
    });
  }
  if (typeof media !== "undefined" || typeof layer !== "undefined" || typeof supports !== "undefined") {
    stmt.conditions.push({
      layer,
      media,
      supports
    });
  }
  return stmt;
}
var path$2 = import_path.default;
var sugarss;
var processContent$1 = function processContent(result, content, filename, options, postcss) {
  var _a;
  const { plugins } = options;
  const ext = path$2.extname(filename);
  const parserList = [];
  if (ext === ".sss") {
    if (!sugarss) {
      try {
        sugarss = __require("sugarss");
      } catch {
      }
    }
    if (sugarss)
      return runPostcss(postcss, content, filename, plugins, [sugarss]);
  }
  if ((_a = result.opts.syntax) == null ? void 0 : _a.parse) {
    parserList.push(result.opts.syntax.parse);
  }
  if (result.opts.parser) parserList.push(result.opts.parser);
  parserList.push(null);
  return runPostcss(postcss, content, filename, plugins, parserList);
};
function runPostcss(postcss, content, filename, plugins, parsers, index2) {
  if (!index2) index2 = 0;
  return postcss(plugins).process(content, {
    from: filename,
    parser: parsers[index2]
  }).catch((err) => {
    index2++;
    if (index2 === parsers.length) throw err;
    return runPostcss(postcss, content, filename, plugins, parsers, index2);
  });
}
var path$1 = import_path.default;
var dataURL = dataUrl;
var parseStatements2 = parseStatements$1;
var processContent2 = processContent$1;
var resolveId$1 = (id) => id;
var formatImportPrelude2 = formatImportPrelude$2;
async function parseStyles$1(result, styles, options, state, conditions, from, postcss) {
  const statements = parseStatements2(result, styles, conditions, from);
  for (const stmt of statements) {
    if (stmt.type !== "import" || !isProcessableURL(stmt.uri)) {
      continue;
    }
    if (options.filter && !options.filter(stmt.uri)) {
      continue;
    }
    await resolveImportId(result, stmt, options, state, postcss);
  }
  let charset;
  const imports = [];
  const bundle = [];
  function handleCharset(stmt) {
    if (!charset) charset = stmt;
    else if (stmt.node.params.toLowerCase() !== charset.node.params.toLowerCase()) {
      throw stmt.node.error(
        `Incompatible @charset statements:
  ${stmt.node.params} specified in ${stmt.node.source.input.file}
  ${charset.node.params} specified in ${charset.node.source.input.file}`
      );
    }
  }
  statements.forEach((stmt) => {
    if (stmt.type === "charset") handleCharset(stmt);
    else if (stmt.type === "import") {
      if (stmt.children) {
        stmt.children.forEach((child, index2) => {
          if (child.type === "import") imports.push(child);
          else if (child.type === "charset") handleCharset(child);
          else bundle.push(child);
          if (index2 === 0) child.parent = stmt;
        });
      } else imports.push(stmt);
    } else if (stmt.type === "nodes") {
      bundle.push(stmt);
    }
  });
  return charset ? [charset, ...imports.concat(bundle)] : imports.concat(bundle);
}
async function resolveImportId(result, stmt, options, state, postcss) {
  var _a, _b;
  if (dataURL.isValid(stmt.uri)) {
    stmt.children = await loadImportContent(
      result,
      stmt,
      stmt.uri,
      options,
      state,
      postcss
    );
    return;
  } else if (dataURL.isValid(stmt.from.slice(-1))) {
    throw stmt.node.error(
      `Unable to import '${stmt.uri}' from a stylesheet that is embedded in a data url`
    );
  }
  const atRule = stmt.node;
  let sourceFile;
  if ((_b = (_a = atRule.source) == null ? void 0 : _a.input) == null ? void 0 : _b.file) {
    sourceFile = atRule.source.input.file;
  }
  const base = sourceFile ? path$1.dirname(atRule.source.input.file) : options.root;
  const paths = [await options.resolve(stmt.uri, base, options, atRule)].flat();
  const resolved = await Promise.all(
    paths.map((file) => {
      return !path$1.isAbsolute(file) ? resolveId$1(file) : file;
    })
  );
  resolved.forEach((file) => {
    result.messages.push({
      type: "dependency",
      plugin: "postcss-import",
      file,
      parent: sourceFile
    });
  });
  const importedContent = await Promise.all(
    resolved.map((file) => {
      return loadImportContent(result, stmt, file, options, state, postcss);
    })
  );
  stmt.children = importedContent.flat().filter((x) => !!x);
}
async function loadImportContent(result, stmt, filename, options, state, postcss) {
  var _a, _b;
  const atRule = stmt.node;
  const { conditions, from } = stmt;
  const stmtDuplicateCheckKey = conditions.map(
    (condition) => formatImportPrelude2(condition.layer, condition.media, condition.supports)
  ).join(":");
  if (options.skipDuplicates) {
    if ((_a = state.importedFiles[filename]) == null ? void 0 : _a[stmtDuplicateCheckKey]) {
      return;
    }
    if (!state.importedFiles[filename]) {
      state.importedFiles[filename] = {};
    }
    state.importedFiles[filename][stmtDuplicateCheckKey] = true;
  }
  if (from.includes(filename)) {
    return;
  }
  const content = await options.load(filename, options);
  if (content.trim() === "" && options.warnOnEmpty) {
    result.warn(`${filename} is empty`, { node: atRule });
    return;
  }
  if (options.skipDuplicates && ((_b = state.hashFiles[content]) == null ? void 0 : _b[stmtDuplicateCheckKey])) {
    return;
  }
  const importedResult = await processContent2(
    result,
    content,
    filename,
    options,
    postcss
  );
  const styles = importedResult.root;
  result.messages = result.messages.concat(importedResult.messages);
  if (options.skipDuplicates) {
    const hasImport = styles.some((child) => {
      return child.type === "atrule" && child.name === "import";
    });
    if (!hasImport) {
      if (!state.hashFiles[content]) {
        state.hashFiles[content] = {};
      }
      state.hashFiles[content][stmtDuplicateCheckKey] = true;
    }
  }
  return parseStyles$1(
    result,
    styles,
    options,
    state,
    conditions,
    [...from, filename],
    postcss
  );
}
function isProcessableURL(uri) {
  if (/^(?:[a-z]+:)?\/\//i.test(uri)) {
    return false;
  }
  try {
    const url = new URL(uri, "https://example.com");
    if (url.search) {
      return false;
    }
  } catch {
  }
  return true;
}
var parseStyles_1 = parseStyles$1;
var path = import_path.default;
var applyConditions2 = applyConditions$1;
var applyRaws2 = applyRaws$1;
var applyStyles2 = applyStyles$1;
var loadContent = () => "";
var parseStyles = parseStyles_1;
var resolveId = (id) => id;
function AtImport(options) {
  options = {
    root: process.cwd(),
    path: [],
    skipDuplicates: true,
    resolve: resolveId,
    load: loadContent,
    plugins: [],
    addModulesDirectories: [],
    warnOnEmpty: true,
    ...options
  };
  options.root = path.resolve(options.root);
  if (typeof options.path === "string") options.path = [options.path];
  if (!Array.isArray(options.path)) options.path = [];
  options.path = options.path.map((p) => path.resolve(options.root, p));
  return {
    postcssPlugin: "postcss-import",
    async Once(styles, { result, atRule, postcss }) {
      var _a, _b;
      const state = {
        importedFiles: {},
        hashFiles: {}
      };
      if ((_b = (_a = styles.source) == null ? void 0 : _a.input) == null ? void 0 : _b.file) {
        state.importedFiles[styles.source.input.file] = {};
      }
      if (options.plugins && !Array.isArray(options.plugins)) {
        throw new Error("plugins option must be an array");
      }
      const bundle = await parseStyles(
        result,
        styles,
        options,
        state,
        [],
        [],
        postcss
      );
      applyRaws2(bundle);
      applyConditions2(bundle, atRule);
      applyStyles2(bundle, styles);
    }
  };
}
AtImport.postcss = true;
var postcssImport = AtImport;
var index = getDefaultExportFromCjs(postcssImport);
var index$1 = _mergeNamespaces({
  __proto__: null,
  default: index
}, [postcssImport]);
export {
  index$1 as i
};
//# sourceMappingURL=dep-SOJpRpBL-3AJAJPU3.js.map
