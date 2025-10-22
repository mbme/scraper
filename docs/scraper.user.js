
// ==UserScript==
// @name         scraper
// @version      2.12.0
// @description  Scrape the data from the page you're on. Updated on Wed Oct 22 2025 14:23:44 GMT+0300 (Eastern European Summer Time)
// @author       mbme
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @updateURL    https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js
// @downloadURL  https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js
// ==/UserScript==

"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // src/utils.ts
  function uniqArr(arr) {
    const result = [];
    for (const item of arr) {
      if (!result.includes(item)) {
        result.push(item);
      }
    }
    return result;
  }
  var waitForTimeout = (timeoutMs) => new Promise((resolve) => setTimeout(resolve, timeoutMs));
  var waitForFunction = async (callback, description, timeoutMs = 3e4) => {
    if (timeoutMs === 0) {
      throw new Error("timeoutMs must be positive number");
    }
    const ATTEMPT_TIMEOUT_MS = 500;
    const maxAttempts = Math.ceil(timeoutMs / ATTEMPT_TIMEOUT_MS);
    let attempt = 1;
    while (attempt <= maxAttempts) {
      if (callback()) {
        return;
      }
      if (attempt < maxAttempts) {
        await waitForTimeout(ATTEMPT_TIMEOUT_MS);
      }
      attempt += 1;
    }
    throw new Error(`waitForFunction: "${description}" timed out`);
  };
  var waitForSelector = async (el, selector, description, timeoutMs = 3e4) => {
    await waitForFunction(() => !!el.querySelector(selector), description, timeoutMs);
    return getEl(selector, description);
  };
  var getEl = (arg1, arg2, arg3) => {
    let selector;
    let root = document;
    let description = void 0;
    if (typeof arg1 === "string") {
      selector = arg1;
      description = arg2;
    } else {
      root = arg1;
      if (typeof arg2 !== "string") {
        throw new Error("expected second argument to be a string");
      }
      selector = arg2;
      description = arg3;
    }
    const el = root.querySelector(selector);
    if (!el) {
      if (description !== void 0) {
        throw new Error(`can't find '${description}' using selector '${selector}'`);
      }
      return el;
    }
    return el;
  };
  var getAll = (root, selector) => {
    const results = Array.from(root.querySelectorAll(selector));
    return results;
  };
  function getListValues(el, selector) {
    var _a3;
    const items = Array.from((_a3 = el == null ? void 0 : el.querySelectorAll(selector)) != null ? _a3 : []).map((el2) => el2.innerText.trim()).filter((item) => item.length > 0);
    return uniqArr(items);
  }
  function getTable(el, rowSelector, split = ":") {
    const items = getListValues(el, rowSelector);
    const table = Object.fromEntries(
      items.map(
        (item) => item.split(split).map((value) => value.trim())
      )
    );
    return table;
  }
  var getListStr = (el, selector) => {
    const values = getListValues(el, selector);
    return values.join(", ");
  };

  // node_modules/urlpattern-polyfill/dist/urlpattern.js
  var Pe = Object.defineProperty;
  var a = (e, t) => Pe(e, "name", { value: t, configurable: true });
  var P = class {
    constructor(t, r, n, c, l, f) {
      __publicField(this, "type", 3);
      __publicField(this, "name", "");
      __publicField(this, "prefix", "");
      __publicField(this, "value", "");
      __publicField(this, "suffix", "");
      __publicField(this, "modifier", 3);
      this.type = t, this.name = r, this.prefix = n, this.value = c, this.suffix = l, this.modifier = f;
    }
    hasCustomName() {
      return this.name !== "" && typeof this.name != "number";
    }
  };
  a(P, "Part");
  var Re = /[$_\p{ID_Start}]/u;
  var Ee = /[$_\u200C\u200D\p{ID_Continue}]/u;
  var v = ".*";
  function Oe(e, t) {
    return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
  }
  a(Oe, "isASCII");
  function D(e, t = false) {
    let r = [], n = 0;
    for (; n < e.length; ) {
      let c = e[n], l = a(function(f) {
        if (!t) throw new TypeError(f);
        r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
      }, "ErrorOrInvalid");
      if (c === "*") {
        r.push({ type: "ASTERISK", index: n, value: e[n++] });
        continue;
      }
      if (c === "+" || c === "?") {
        r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
        continue;
      }
      if (c === "\\") {
        r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
        continue;
      }
      if (c === "{") {
        r.push({ type: "OPEN", index: n, value: e[n++] });
        continue;
      }
      if (c === "}") {
        r.push({ type: "CLOSE", index: n, value: e[n++] });
        continue;
      }
      if (c === ":") {
        let f = "", s = n + 1;
        for (; s < e.length; ) {
          let i = e.substr(s, 1);
          if (s === n + 1 && Re.test(i) || s !== n + 1 && Ee.test(i)) {
            f += e[s++];
            continue;
          }
          break;
        }
        if (!f) {
          l(`Missing parameter name at ${n}`);
          continue;
        }
        r.push({ type: "NAME", index: n, value: f }), n = s;
        continue;
      }
      if (c === "(") {
        let f = 1, s = "", i = n + 1, o = false;
        if (e[i] === "?") {
          l(`Pattern cannot start with "?" at ${i}`);
          continue;
        }
        for (; i < e.length; ) {
          if (!Oe(e[i], false)) {
            l(`Invalid character '${e[i]}' at ${i}.`), o = true;
            break;
          }
          if (e[i] === "\\") {
            s += e[i++] + e[i++];
            continue;
          }
          if (e[i] === ")") {
            if (f--, f === 0) {
              i++;
              break;
            }
          } else if (e[i] === "(" && (f++, e[i + 1] !== "?")) {
            l(`Capturing groups are not allowed at ${i}`), o = true;
            break;
          }
          s += e[i++];
        }
        if (o) continue;
        if (f) {
          l(`Unbalanced pattern at ${n}`);
          continue;
        }
        if (!s) {
          l(`Missing pattern at ${n}`);
          continue;
        }
        r.push({ type: "REGEX", index: n, value: s }), n = i;
        continue;
      }
      r.push({ type: "CHAR", index: n, value: e[n++] });
    }
    return r.push({ type: "END", index: n, value: "" }), r;
  }
  a(D, "lexer");
  function F(e, t = {}) {
    var _a3, _b;
    let r = D(e);
    (_a3 = t.delimiter) != null ? _a3 : t.delimiter = "/#?", (_b = t.prefixes) != null ? _b : t.prefixes = "./";
    let n = `[^${x(t.delimiter)}]+?`, c = [], l = 0, f = 0, s = "", i = /* @__PURE__ */ new Set(), o = a((u) => {
      if (f < r.length && r[f].type === u) return r[f++].value;
    }, "tryConsume"), h = a(() => {
      var _a4;
      return (_a4 = o("OTHER_MODIFIER")) != null ? _a4 : o("ASTERISK");
    }, "tryConsumeModifier"), p = a((u) => {
      let d = o(u);
      if (d !== void 0) return d;
      let { type: g, index: y } = r[f];
      throw new TypeError(`Unexpected ${g} at ${y}, expected ${u}`);
    }, "mustConsume"), A = a(() => {
      var _a4;
      let u = "", d;
      for (; d = (_a4 = o("CHAR")) != null ? _a4 : o("ESCAPED_CHAR"); ) u += d;
      return u;
    }, "consumeText"), xe = a((u) => u, "DefaultEncodePart"), N = t.encodePart || xe, H = "", $ = a((u) => {
      H += u;
    }, "appendToPendingFixedValue"), M = a(() => {
      H.length && (c.push(new P(3, "", "", N(H), "", 3)), H = "");
    }, "maybeAddPartFromPendingFixedValue"), X = a((u, d, g, y, Z) => {
      let m = 3;
      switch (Z) {
        case "?":
          m = 1;
          break;
        case "*":
          m = 0;
          break;
        case "+":
          m = 2;
          break;
      }
      if (!d && !g && m === 3) {
        $(u);
        return;
      }
      if (M(), !d && !g) {
        if (!u) return;
        c.push(new P(3, "", "", N(u), "", m));
        return;
      }
      let S;
      g ? g === "*" ? S = v : S = g : S = n;
      let k = 2;
      S === n ? (k = 1, S = "") : S === v && (k = 0, S = "");
      let E;
      if (d ? E = d : g && (E = l++), i.has(E)) throw new TypeError(`Duplicate name '${E}'.`);
      i.add(E), c.push(new P(k, E, N(u), S, N(y), m));
    }, "addPart");
    for (; f < r.length; ) {
      let u = o("CHAR"), d = o("NAME"), g = o("REGEX");
      if (!d && !g && (g = o("ASTERISK")), d || g) {
        let m = u != null ? u : "";
        t.prefixes.indexOf(m) === -1 && ($(m), m = ""), M();
        let S = h();
        X(m, d, g, "", S);
        continue;
      }
      let y = u != null ? u : o("ESCAPED_CHAR");
      if (y) {
        $(y);
        continue;
      }
      if (o("OPEN")) {
        let m = A(), S = o("NAME"), k = o("REGEX");
        !S && !k && (k = o("ASTERISK"));
        let E = A();
        p("CLOSE");
        let be = h();
        X(m, S, k, E, be);
        continue;
      }
      M(), p("END");
    }
    return c;
  }
  a(F, "parse");
  function x(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  a(x, "escapeString");
  function B(e) {
    return e && e.ignoreCase ? "ui" : "u";
  }
  a(B, "flags");
  function q(e, t, r) {
    return W(F(e, r), t, r);
  }
  a(q, "stringToRegexp");
  function T(e) {
    switch (e) {
      case 0:
        return "*";
      case 1:
        return "?";
      case 2:
        return "+";
      case 3:
        return "";
    }
  }
  a(T, "modifierToString");
  function W(e, t, r = {}) {
    var _a3, _b, _c, _d2, _e3, _f;
    (_a3 = r.delimiter) != null ? _a3 : r.delimiter = "/#?", (_b = r.prefixes) != null ? _b : r.prefixes = "./", (_c = r.sensitive) != null ? _c : r.sensitive = false, (_d2 = r.strict) != null ? _d2 : r.strict = false, (_e3 = r.end) != null ? _e3 : r.end = true, (_f = r.start) != null ? _f : r.start = true, r.endsWith = "";
    let n = r.start ? "^" : "";
    for (let s of e) {
      if (s.type === 3) {
        s.modifier === 3 ? n += x(s.value) : n += `(?:${x(s.value)})${T(s.modifier)}`;
        continue;
      }
      t && t.push(s.name);
      let i = `[^${x(r.delimiter)}]+?`, o = s.value;
      if (s.type === 1 ? o = i : s.type === 0 && (o = v), !s.prefix.length && !s.suffix.length) {
        s.modifier === 3 || s.modifier === 1 ? n += `(${o})${T(s.modifier)}` : n += `((?:${o})${T(s.modifier)})`;
        continue;
      }
      if (s.modifier === 3 || s.modifier === 1) {
        n += `(?:${x(s.prefix)}(${o})${x(s.suffix)})`, n += T(s.modifier);
        continue;
      }
      n += `(?:${x(s.prefix)}`, n += `((?:${o})(?:`, n += x(s.suffix), n += x(s.prefix), n += `(?:${o}))*)${x(s.suffix)})`, s.modifier === 0 && (n += "?");
    }
    let c = `[${x(r.endsWith)}]|$`, l = `[${x(r.delimiter)}]`;
    if (r.end) return r.strict || (n += `${l}?`), r.endsWith.length ? n += `(?=${c})` : n += "$", new RegExp(n, B(r));
    r.strict || (n += `(?:${l}(?=${c}))?`);
    let f = false;
    if (e.length) {
      let s = e[e.length - 1];
      s.type === 3 && s.modifier === 3 && (f = r.delimiter.indexOf(s) > -1);
    }
    return f || (n += `(?=${l}|${c})`), new RegExp(n, B(r));
  }
  a(W, "partsToRegexp");
  var b = { delimiter: "", prefixes: "", sensitive: true, strict: true };
  var J = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
  var Q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
  function ee(e, t) {
    return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
  }
  a(ee, "isAbsolutePathname");
  function te(e, t) {
    return e.startsWith(t) ? e.substring(t.length, e.length) : e;
  }
  a(te, "maybeStripPrefix");
  function ke(e, t) {
    return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
  }
  a(ke, "maybeStripSuffix");
  function _(e) {
    return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
  }
  a(_, "treatAsIPv6Hostname");
  var re = ["ftp", "file", "http", "https", "ws", "wss"];
  function U(e) {
    if (!e) return true;
    for (let t of re) if (e.test(t)) return true;
    return false;
  }
  a(U, "isSpecialScheme");
  function ne(e, t) {
    if (e = te(e, "#"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
  }
  a(ne, "canonicalizeHash");
  function se(e, t) {
    if (e = te(e, "?"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
  }
  a(se, "canonicalizeSearch");
  function ie(e, t) {
    return t || e === "" ? e : _(e) ? K(e) : j(e);
  }
  a(ie, "canonicalizeHostname");
  function ae(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.password = e, r.password;
  }
  a(ae, "canonicalizePassword");
  function oe(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.username = e, r.username;
  }
  a(oe, "canonicalizeUsername");
  function ce(e, t, r) {
    if (r || e === "") return e;
    if (t && !re.includes(t)) return new URL(`${t}:${e}`).pathname;
    let n = e[0] == "/";
    return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
  }
  a(ce, "canonicalizePathname");
  function le(e, t, r) {
    return z(t) === e && (e = ""), r || e === "" ? e : G(e);
  }
  a(le, "canonicalizePort");
  function fe(e, t) {
    return e = ke(e, ":"), t || e === "" ? e : w(e);
  }
  a(fe, "canonicalizeProtocol");
  function z(e) {
    switch (e) {
      case "ws":
      case "http":
        return "80";
      case "wws":
      case "https":
        return "443";
      case "ftp":
        return "21";
      default:
        return "";
    }
  }
  a(z, "defaultPortForProtocol");
  function w(e) {
    if (e === "") return e;
    if (/^[-+.A-Za-z0-9]*$/.test(e)) return e.toLowerCase();
    throw new TypeError(`Invalid protocol '${e}'.`);
  }
  a(w, "protocolEncodeCallback");
  function he(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.username = e, t.username;
  }
  a(he, "usernameEncodeCallback");
  function ue(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.password = e, t.password;
  }
  a(ue, "passwordEncodeCallback");
  function j(e) {
    if (e === "") return e;
    if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e)) throw new TypeError(`Invalid hostname '${e}'`);
    let t = new URL("https://example.com");
    return t.hostname = e, t.hostname;
  }
  a(j, "hostnameEncodeCallback");
  function K(e) {
    if (e === "") return e;
    if (/[^0-9a-fA-F[\]:]/g.test(e)) throw new TypeError(`Invalid IPv6 hostname '${e}'`);
    return e.toLowerCase();
  }
  a(K, "ipv6HostnameEncodeCallback");
  function G(e) {
    if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535) return e;
    throw new TypeError(`Invalid port '${e}'.`);
  }
  a(G, "portEncodeCallback");
  function de(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
  }
  a(de, "standardURLPathnameEncodeCallback");
  function pe(e) {
    return e === "" ? e : new URL(`data:${e}`).pathname;
  }
  a(pe, "pathURLPathnameEncodeCallback");
  function ge(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.search = e, t.search.substring(1, t.search.length);
  }
  a(ge, "searchEncodeCallback");
  function me(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.hash = e, t.hash.substring(1, t.hash.length);
  }
  a(me, "hashEncodeCallback");
  var _i, _n, _t, _e, _s, _l, _o, _d, _p, _g, _C_instances, r_fn, R_fn, b_fn, u_fn, m_fn, a_fn, P_fn, E_fn, S_fn, O_fn, k_fn, x_fn, h_fn, f_fn, T_fn, A_fn, y_fn, w_fn, c_fn, C_fn, _a;
  var C = (_a = class {
    constructor(t) {
      __privateAdd(this, _C_instances);
      __privateAdd(this, _i);
      __privateAdd(this, _n, []);
      __privateAdd(this, _t, {});
      __privateAdd(this, _e, 0);
      __privateAdd(this, _s, 1);
      __privateAdd(this, _l, 0);
      __privateAdd(this, _o, 0);
      __privateAdd(this, _d, 0);
      __privateAdd(this, _p, 0);
      __privateAdd(this, _g, false);
      __privateSet(this, _i, t);
    }
    get result() {
      return __privateGet(this, _t);
    }
    parse() {
      for (__privateSet(this, _n, D(__privateGet(this, _i), true)); __privateGet(this, _e) < __privateGet(this, _n).length; __privateSet(this, _e, __privateGet(this, _e) + __privateGet(this, _s))) {
        if (__privateSet(this, _s, 1), __privateGet(this, _n)[__privateGet(this, _e)].type === "END") {
          if (__privateGet(this, _o) === 0) {
            __privateMethod(this, _C_instances, b_fn).call(this), __privateMethod(this, _C_instances, f_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 9, 1) : __privateMethod(this, _C_instances, h_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _C_instances, r_fn).call(this, 7, 0);
            continue;
          } else if (__privateGet(this, _o) === 2) {
            __privateMethod(this, _C_instances, u_fn).call(this, 5);
            continue;
          }
          __privateMethod(this, _C_instances, r_fn).call(this, 10, 0);
          break;
        }
        if (__privateGet(this, _d) > 0) if (__privateMethod(this, _C_instances, A_fn).call(this)) __privateSet(this, _d, __privateGet(this, _d) - 1);
        else continue;
        if (__privateMethod(this, _C_instances, T_fn).call(this)) {
          __privateSet(this, _d, __privateGet(this, _d) + 1);
          continue;
        }
        switch (__privateGet(this, _o)) {
          case 0:
            __privateMethod(this, _C_instances, P_fn).call(this) && __privateMethod(this, _C_instances, u_fn).call(this, 1);
            break;
          case 1:
            if (__privateMethod(this, _C_instances, P_fn).call(this)) {
              __privateMethod(this, _C_instances, C_fn).call(this);
              let t = 7, r = 1;
              __privateMethod(this, _C_instances, E_fn).call(this) ? (t = 2, r = 3) : __privateGet(this, _g) && (t = 2), __privateMethod(this, _C_instances, r_fn).call(this, t, r);
            }
            break;
          case 2:
            __privateMethod(this, _C_instances, S_fn).call(this) ? __privateMethod(this, _C_instances, u_fn).call(this, 3) : (__privateMethod(this, _C_instances, x_fn).call(this) || __privateMethod(this, _C_instances, h_fn).call(this) || __privateMethod(this, _C_instances, f_fn).call(this)) && __privateMethod(this, _C_instances, u_fn).call(this, 5);
            break;
          case 3:
            __privateMethod(this, _C_instances, O_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 4, 1) : __privateMethod(this, _C_instances, S_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 5, 1);
            break;
          case 4:
            __privateMethod(this, _C_instances, S_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 5, 1);
            break;
          case 5:
            __privateMethod(this, _C_instances, y_fn).call(this) ? __privateSet(this, _p, __privateGet(this, _p) + 1) : __privateMethod(this, _C_instances, w_fn).call(this) && __privateSet(this, _p, __privateGet(this, _p) - 1), __privateMethod(this, _C_instances, k_fn).call(this) && !__privateGet(this, _p) ? __privateMethod(this, _C_instances, r_fn).call(this, 6, 1) : __privateMethod(this, _C_instances, x_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 7, 0) : __privateMethod(this, _C_instances, h_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _C_instances, f_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 9, 1);
            break;
          case 6:
            __privateMethod(this, _C_instances, x_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 7, 0) : __privateMethod(this, _C_instances, h_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _C_instances, f_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 9, 1);
            break;
          case 7:
            __privateMethod(this, _C_instances, h_fn).call(this) ? __privateMethod(this, _C_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _C_instances, f_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 9, 1);
            break;
          case 8:
            __privateMethod(this, _C_instances, f_fn).call(this) && __privateMethod(this, _C_instances, r_fn).call(this, 9, 1);
            break;
          case 9:
            break;
          case 10:
            break;
        }
      }
      __privateGet(this, _t).hostname !== void 0 && __privateGet(this, _t).port === void 0 && (__privateGet(this, _t).port = "");
    }
  }, _i = new WeakMap(), _n = new WeakMap(), _t = new WeakMap(), _e = new WeakMap(), _s = new WeakMap(), _l = new WeakMap(), _o = new WeakMap(), _d = new WeakMap(), _p = new WeakMap(), _g = new WeakMap(), _C_instances = new WeakSet(), r_fn = function(t, r) {
    var _a3, _b, _c, _d2, _e3, _f;
    switch (__privateGet(this, _o)) {
      case 0:
        break;
      case 1:
        __privateGet(this, _t).protocol = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 2:
        break;
      case 3:
        __privateGet(this, _t).username = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 4:
        __privateGet(this, _t).password = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 5:
        __privateGet(this, _t).hostname = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 6:
        __privateGet(this, _t).port = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 7:
        __privateGet(this, _t).pathname = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 8:
        __privateGet(this, _t).search = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 9:
        __privateGet(this, _t).hash = __privateMethod(this, _C_instances, c_fn).call(this);
        break;
      case 10:
        break;
    }
    __privateGet(this, _o) !== 0 && t !== 10 && ([1, 2, 3, 4].includes(__privateGet(this, _o)) && [6, 7, 8, 9].includes(t) && ((_b = (_a3 = __privateGet(this, _t)).hostname) != null ? _b : _a3.hostname = ""), [1, 2, 3, 4, 5, 6].includes(__privateGet(this, _o)) && [8, 9].includes(t) && ((_d2 = (_c = __privateGet(this, _t)).pathname) != null ? _d2 : _c.pathname = __privateGet(this, _g) ? "/" : ""), [1, 2, 3, 4, 5, 6, 7].includes(__privateGet(this, _o)) && t === 9 && ((_f = (_e3 = __privateGet(this, _t)).search) != null ? _f : _e3.search = "")), __privateMethod(this, _C_instances, R_fn).call(this, t, r);
  }, R_fn = function(t, r) {
    __privateSet(this, _o, t), __privateSet(this, _l, __privateGet(this, _e) + r), __privateSet(this, _e, __privateGet(this, _e) + r), __privateSet(this, _s, 0);
  }, b_fn = function() {
    __privateSet(this, _e, __privateGet(this, _l)), __privateSet(this, _s, 0);
  }, u_fn = function(t) {
    __privateMethod(this, _C_instances, b_fn).call(this), __privateSet(this, _o, t);
  }, m_fn = function(t) {
    return t < 0 && (t = __privateGet(this, _n).length - t), t < __privateGet(this, _n).length ? __privateGet(this, _n)[t] : __privateGet(this, _n)[__privateGet(this, _n).length - 1];
  }, a_fn = function(t, r) {
    let n = __privateMethod(this, _C_instances, m_fn).call(this, t);
    return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
  }, P_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, E_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e) + 1, "/") && __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e) + 2, "/");
  }, S_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "@");
  }, O_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, k_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, x_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "/");
  }, h_fn = function() {
    if (__privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "?")) return true;
    if (__privateGet(this, _n)[__privateGet(this, _e)].value !== "?") return false;
    let t = __privateMethod(this, _C_instances, m_fn).call(this, __privateGet(this, _e) - 1);
    return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
  }, f_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "#");
  }, T_fn = function() {
    return __privateGet(this, _n)[__privateGet(this, _e)].type == "OPEN";
  }, A_fn = function() {
    return __privateGet(this, _n)[__privateGet(this, _e)].type == "CLOSE";
  }, y_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "[");
  }, w_fn = function() {
    return __privateMethod(this, _C_instances, a_fn).call(this, __privateGet(this, _e), "]");
  }, c_fn = function() {
    let t = __privateGet(this, _n)[__privateGet(this, _e)], r = __privateMethod(this, _C_instances, m_fn).call(this, __privateGet(this, _l)).index;
    return __privateGet(this, _i).substring(r, t.index);
  }, C_fn = function() {
    let t = {};
    Object.assign(t, b), t.encodePart = w;
    let r = q(__privateMethod(this, _C_instances, c_fn).call(this), void 0, t);
    __privateSet(this, _g, U(r));
  }, _a);
  a(C, "Parser");
  var V = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
  var O = "*";
  function Se(e, t) {
    if (typeof e != "string") throw new TypeError("parameter 1 is not of type 'string'.");
    let r = new URL(e, t);
    return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : void 0, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : void 0 };
  }
  a(Se, "extractValues");
  function R(e, t) {
    return t ? I(e) : e;
  }
  a(R, "processBaseURLString");
  function L(e, t, r) {
    let n;
    if (typeof t.baseURL == "string") try {
      n = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = R(n.protocol.substring(0, n.protocol.length - 1), r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = R(n.username, r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = R(n.password, r)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = R(n.hostname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = R(n.port, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = R(n.pathname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = R(n.search.substring(1, n.search.length), r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = R(n.hash.substring(1, n.hash.length), r));
    } catch {
      throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
    }
    if (typeof t.protocol == "string" && (e.protocol = fe(t.protocol, r)), typeof t.username == "string" && (e.username = oe(t.username, r)), typeof t.password == "string" && (e.password = ae(t.password, r)), typeof t.hostname == "string" && (e.hostname = ie(t.hostname, r)), typeof t.port == "string" && (e.port = le(t.port, e.protocol, r)), typeof t.pathname == "string") {
      if (e.pathname = t.pathname, n && !ee(e.pathname, r)) {
        let c = n.pathname.lastIndexOf("/");
        c >= 0 && (e.pathname = R(n.pathname.substring(0, c + 1), r) + e.pathname);
      }
      e.pathname = ce(e.pathname, e.protocol, r);
    }
    return typeof t.search == "string" && (e.search = se(t.search, r)), typeof t.hash == "string" && (e.hash = ne(t.hash, r)), e;
  }
  a(L, "applyInit");
  function I(e) {
    return e.replace(/([+*?:{}()\\])/g, "\\$1");
  }
  a(I, "escapePatternString");
  function Te(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  a(Te, "escapeRegexpString");
  function Ae(e, t) {
    var _a3, _b, _c, _d2, _e3, _f;
    (_a3 = t.delimiter) != null ? _a3 : t.delimiter = "/#?", (_b = t.prefixes) != null ? _b : t.prefixes = "./", (_c = t.sensitive) != null ? _c : t.sensitive = false, (_d2 = t.strict) != null ? _d2 : t.strict = false, (_e3 = t.end) != null ? _e3 : t.end = true, (_f = t.start) != null ? _f : t.start = true, t.endsWith = "";
    let r = ".*", n = `[^${Te(t.delimiter)}]+?`, c = /[$_\u200C\u200D\p{ID_Continue}]/u, l = "";
    for (let f = 0; f < e.length; ++f) {
      let s = e[f];
      if (s.type === 3) {
        if (s.modifier === 3) {
          l += I(s.value);
          continue;
        }
        l += `{${I(s.value)}}${T(s.modifier)}`;
        continue;
      }
      let i = s.hasCustomName(), o = !!s.suffix.length || !!s.prefix.length && (s.prefix.length !== 1 || !t.prefixes.includes(s.prefix)), h = f > 0 ? e[f - 1] : null, p = f < e.length - 1 ? e[f + 1] : null;
      if (!o && i && s.type === 1 && s.modifier === 3 && p && !p.prefix.length && !p.suffix.length) if (p.type === 3) {
        let A = p.value.length > 0 ? p.value[0] : "";
        o = c.test(A);
      } else o = !p.hasCustomName();
      if (!o && !s.prefix.length && h && h.type === 3) {
        let A = h.value[h.value.length - 1];
        o = t.prefixes.includes(A);
      }
      o && (l += "{"), l += I(s.prefix), i && (l += `:${s.name}`), s.type === 2 ? l += `(${s.value})` : s.type === 1 ? i || (l += `(${n})`) : s.type === 0 && (!i && (!h || h.type === 3 || h.modifier !== 3 || o || s.prefix !== "") ? l += "*" : l += `(${r})`), s.type === 1 && i && s.suffix.length && c.test(s.suffix[0]) && (l += "\\"), l += I(s.suffix), o && (l += "}"), s.modifier !== 3 && (l += T(s.modifier));
    }
    return l;
  }
  a(Ae, "partsToPattern");
  var _i2, _n2, _t2, _e2, _s2, _l2, _a2;
  var Y = (_a2 = class {
    constructor(t = {}, r, n) {
      __privateAdd(this, _i2);
      __privateAdd(this, _n2, {});
      __privateAdd(this, _t2, {});
      __privateAdd(this, _e2, {});
      __privateAdd(this, _s2, {});
      __privateAdd(this, _l2, false);
      try {
        let c;
        if (typeof r == "string" ? c = r : n = r, typeof t == "string") {
          let i = new C(t);
          if (i.parse(), t = i.result, c === void 0 && typeof t.protocol != "string") throw new TypeError("A base URL must be provided for a relative constructor string.");
          t.baseURL = c;
        } else {
          if (!t || typeof t != "object") throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
          if (c) throw new TypeError("parameter 1 is not of type 'string'.");
        }
        typeof n > "u" && (n = { ignoreCase: false });
        let l = { ignoreCase: n.ignoreCase === true }, f = { pathname: O, protocol: O, username: O, password: O, hostname: O, port: O, search: O, hash: O };
        __privateSet(this, _i2, L(f, t, true)), z(__privateGet(this, _i2).protocol) === __privateGet(this, _i2).port && (__privateGet(this, _i2).port = "");
        let s;
        for (s of V) {
          if (!(s in __privateGet(this, _i2))) continue;
          let i = {}, o = __privateGet(this, _i2)[s];
          switch (__privateGet(this, _t2)[s] = [], s) {
            case "protocol":
              Object.assign(i, b), i.encodePart = w;
              break;
            case "username":
              Object.assign(i, b), i.encodePart = he;
              break;
            case "password":
              Object.assign(i, b), i.encodePart = ue;
              break;
            case "hostname":
              Object.assign(i, J), _(o) ? i.encodePart = K : i.encodePart = j;
              break;
            case "port":
              Object.assign(i, b), i.encodePart = G;
              break;
            case "pathname":
              U(__privateGet(this, _n2).protocol) ? (Object.assign(i, Q, l), i.encodePart = de) : (Object.assign(i, b, l), i.encodePart = pe);
              break;
            case "search":
              Object.assign(i, b, l), i.encodePart = ge;
              break;
            case "hash":
              Object.assign(i, b, l), i.encodePart = me;
              break;
          }
          try {
            __privateGet(this, _s2)[s] = F(o, i), __privateGet(this, _n2)[s] = W(__privateGet(this, _s2)[s], __privateGet(this, _t2)[s], i), __privateGet(this, _e2)[s] = Ae(__privateGet(this, _s2)[s], i), __privateSet(this, _l2, __privateGet(this, _l2) || __privateGet(this, _s2)[s].some((h) => h.type === 2));
          } catch {
            throw new TypeError(`invalid ${s} pattern '${__privateGet(this, _i2)[s]}'.`);
          }
        }
      } catch (c) {
        throw new TypeError(`Failed to construct 'URLPattern': ${c.message}`);
      }
    }
    get [Symbol.toStringTag]() {
      return "URLPattern";
    }
    test(t = {}, r) {
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return false;
      try {
        typeof t == "object" ? n = L(n, t, false) : n = L(n, Se(t, r), false);
      } catch {
        return false;
      }
      let c;
      for (c of V) if (!__privateGet(this, _n2)[c].exec(n[c])) return false;
      return true;
    }
    exec(t = {}, r) {
      var _a3;
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return;
      try {
        typeof t == "object" ? n = L(n, t, false) : n = L(n, Se(t, r), false);
      } catch {
        return null;
      }
      let c = {};
      r ? c.inputs = [t, r] : c.inputs = [t];
      let l;
      for (l of V) {
        let f = __privateGet(this, _n2)[l].exec(n[l]);
        if (!f) return null;
        let s = {};
        for (let [i, o] of __privateGet(this, _t2)[l].entries()) if (typeof o == "string" || typeof o == "number") {
          let h = f[i + 1];
          s[o] = h;
        }
        c[l] = { input: (_a3 = n[l]) != null ? _a3 : "", groups: s };
      }
      return c;
    }
    static compareComponent(t, r, n) {
      let c = a((i, o) => {
        for (let h of ["type", "modifier", "prefix", "value", "suffix"]) {
          if (i[h] < o[h]) return -1;
          if (i[h] === o[h]) continue;
          return 1;
        }
        return 0;
      }, "comparePart"), l = new P(3, "", "", "", "", 3), f = new P(0, "", "", "", "", 3), s = a((i, o) => {
        var _a3, _b;
        let h = 0;
        for (; h < Math.min(i.length, o.length); ++h) {
          let p = c(i[h], o[h]);
          if (p) return p;
        }
        return i.length === o.length ? 0 : c((_a3 = i[h]) != null ? _a3 : l, (_b = o[h]) != null ? _b : l);
      }, "comparePartList");
      return !__privateGet(r, _e2)[t] && !__privateGet(n, _e2)[t] ? 0 : __privateGet(r, _e2)[t] && !__privateGet(n, _e2)[t] ? s(__privateGet(r, _s2)[t], [f]) : !__privateGet(r, _e2)[t] && __privateGet(n, _e2)[t] ? s([f], __privateGet(n, _s2)[t]) : s(__privateGet(r, _s2)[t], __privateGet(n, _s2)[t]);
    }
    get protocol() {
      return __privateGet(this, _e2).protocol;
    }
    get username() {
      return __privateGet(this, _e2).username;
    }
    get password() {
      return __privateGet(this, _e2).password;
    }
    get hostname() {
      return __privateGet(this, _e2).hostname;
    }
    get port() {
      return __privateGet(this, _e2).port;
    }
    get pathname() {
      return __privateGet(this, _e2).pathname;
    }
    get search() {
      return __privateGet(this, _e2).search;
    }
    get hash() {
      return __privateGet(this, _e2).hash;
    }
    get hasRegExpGroups() {
      return __privateGet(this, _l2);
    }
  }, _i2 = new WeakMap(), _n2 = new WeakMap(), _t2 = new WeakMap(), _e2 = new WeakMap(), _s2 = new WeakMap(), _l2 = new WeakMap(), _a2);
  a(Y, "URLPattern");

  // node_modules/urlpattern-polyfill/index.js
  if (!globalThis.URLPattern) {
    globalThis.URLPattern = Y;
  }

  // src/scrapers/scraper.ts
  var Scraper = class {
  };

  // src/scrapers/yakaboo-book.ts
  var LANGUAGE_TRANSLATIONS = {
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430": "Ukrainian",
    "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430": "English",
    "\u0420\u043E\u0441\u0456\u0439\u0441\u044C\u043A\u0430": "Russian"
  };
  var YakabooBookScraper = class extends Scraper {
    constructor() {
      super(...arguments);
      // https://yakaboo.ua/ua/stories-of-your-life-and-others.html
      this.pattern = new URLPattern({
        hostname: "www.yakaboo.ua",
        pathname: "/ua/*"
      });
    }
    async scrape() {
      var _a3, _b;
      const coverURL = getEl(".gallery img", "cover image").src;
      const rawTitle = getEl(".base-product__title h1", "title").innerText.trim();
      const title = rawTitle.replace(/^Книга[\s\u00A0]*/i, "").trim();
      (_a3 = getEl(".description__btn")) == null ? void 0 : _a3.click();
      const description = getEl(".description__content", "description").innerText;
      const toggleSelectors = [
        ".main__chars button.ui-btn-nav",
        '.main__chars [data-testid="char-toggler"]',
        '[data-testid="char-toggler"] button',
        '[data-testid="char-toggler"]'
      ];
      const toggleSelectorsQuery = toggleSelectors.join(", ");
      const expandAttrsBtn = toggleSelectors.map((selector) => document.querySelector(selector)).find((btn) => Boolean(btn));
      const isExpanded = (button) => {
        const normalizedText = button.innerText.toLowerCase();
        if (normalizedText.includes("\u043F\u0440\u0438\u0445\u043E\u0432\u0430\u0442\u0438") || normalizedText.includes("\u0437\u0433\u043E\u0440\u043D\u0443\u0442\u0438")) {
          return true;
        }
        if (button.getAttribute("aria-expanded") === "true") {
          return true;
        }
        if (button.getAttribute("aria-pressed") === "true") {
          return true;
        }
        return button.classList.contains("is-active") || button.classList.contains("active");
      };
      if (expandAttrsBtn) {
        expandAttrsBtn.scrollIntoView();
        if (!isExpanded(expandAttrsBtn)) {
          expandAttrsBtn.click();
          await waitForFunction(() => {
            const button = document.querySelector(toggleSelectorsQuery);
            if (!button) {
              return false;
            }
            return isExpanded(button);
          }, "collapse attributes button").catch(() => void 0);
        }
      }
      const table = getTable(document, ".product-chars .chars .char", "\n");
      const authors = table["\u0410\u0432\u0442\u043E\u0440"] || "";
      const language = (_b = LANGUAGE_TRANSLATIONS[table["\u041C\u043E\u0432\u0430"] || ""]) != null ? _b : "";
      const publicationDate = table["\u0420\u0456\u043A \u0432\u0438\u0434\u0430\u043D\u043D\u044F"] || "";
      const translators = table["\u041F\u0435\u0440\u0435\u043A\u043B\u0430\u0434\u0430\u0447"] || "";
      const publisher = table["\u0412\u0438\u0434\u0430\u0432\u043D\u0438\u0446\u0442\u0432\u043E"] || "";
      const pages = Number.parseInt(table["\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0441\u0442\u043E\u0440\u0456\u043D\u043E\u043A"] || "", 10);
      return {
        typeName: "YakabooBook",
        version: 1,
        coverURL,
        title,
        authors,
        publicationDate,
        description,
        translators,
        publisher,
        pages,
        language
      };
    }
  };

  // src/scrapers/steam-game.ts
  var SteamGameScraper = class extends Scraper {
    constructor() {
      super(...arguments);
      // https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice__GOTY_Edition/
      this.pattern = new URLPattern({
        hostname: "store.steampowered.com",
        pathname: "/app/*"
      });
    }
    scrape() {
      const coverURL = getEl(".game_header_image_full", "cover image").src;
      const name = getEl("#appHubAppName", "game name").innerText;
      const releaseDate = getEl(".release_date .date", "release date").innerText;
      const developers = getListStr(document, "#developers_list a");
      getEl("#game_area_description h2", "description header").remove();
      const description = getEl("#game_area_description", "description").innerText;
      return {
        typeName: "SteamGame",
        version: 1,
        coverURL,
        name,
        releaseDate,
        developers,
        description
      };
    }
  };

  // src/scrapers/myanimelist-anime.ts
  var MyAnimeListAnimeScraper = class extends Scraper {
    constructor() {
      super(...arguments);
      // https://myanimelist.net/anime/30276/One_Punch_Man
      this.pattern = new URLPattern({
        hostname: "myanimelist.net",
        pathname: "/anime/*"
      });
    }
    scrape() {
      var _a3, _b;
      const engTitle = (_a3 = getEl(".title-english")) == null ? void 0 : _a3.innerText;
      const title = engTitle || ((_b = getEl(".title-name")) == null ? void 0 : _b.innerText) || "";
      const coverURL = getEl(".leftside img", "cover image").dataset.src || "";
      const metadata = getTable(document, ".leftside .spaceit_pad");
      const releaseDate = metadata.Aired || "";
      const creators = metadata.Studios || "";
      const duration = metadata.Duration || "";
      const description = getEl("[itemprop=description]", "description").innerText;
      const related = getTable(document, ".anime_detail_related_anime tr");
      if (related.Prequel) {
        throw new Error("Can't import an anime: it has a prequel. Start from the first season.");
      }
      return {
        typeName: "MyAnimeListAnime",
        version: 1,
        title,
        coverURL,
        releaseDate,
        creators,
        duration,
        description
      };
    }
  };

  // src/scrapers/imdb-film.ts
  var IMDBFilmScraper = class extends Scraper {
    constructor() {
      super(...arguments);
      // https://www.imdb.com/title/tt0133093/
      this.pattern = new URLPattern({
        hostname: "www.imdb.com",
        pathname: "/title/*"
      });
    }
    async scrape() {
      var _a3, _b, _c;
      for (const loaderEl of document.querySelectorAll("[data-testid=storyline-loader]")) {
        loaderEl.scrollIntoView();
        await waitForTimeout(400);
      }
      await waitForFunction(
        () => document.querySelector("[data-testid=storyline-loader]") === null,
        "wait until loader is gone"
      );
      const metadata = getListValues(document, "h1[data-testid=hero__pageTitle]~.ipc-inline-list li");
      while (metadata.length < 4) {
        metadata.unshift("");
      }
      const filmType = metadata[0].toLowerCase();
      const isSeries = filmType.includes("series");
      const isMiniSeries = isSeries && filmType.includes("mini");
      const title = (await waitForSelector(document, "h1[data-testid=hero__pageTitle]", "title")).innerText;
      const originalLanguage = getEl(
        "[data-testid=title-details-languages] ul li a",
        "original language"
      ).innerText;
      const countriesOfOrigin = getListStr(document, "[data-testid=title-details-origin] ul li a");
      const coverURL = getEl(
        "[data-testid=hero-media__poster] img",
        "cover image"
      ).src;
      const summaryEl = await waitForSelector(
        document,
        "[data-testid=storyline-plot-summary]",
        "description"
      );
      (_a3 = getEl(summaryEl, "div>span")) == null ? void 0 : _a3.remove();
      const description = getEl(summaryEl, "div", "description").innerText;
      const releaseDate = (_b = metadata[1]) != null ? _b : "";
      let duration = (_c = metadata[3]) != null ? _c : "";
      const creators = [];
      const cast = [];
      const creditsEls = getAll(document, "[data-testid=title-pc-principal-credit]");
      let seasons = void 0;
      let episodes = void 0;
      if (isSeries) {
        seasons = Number.parseInt(
          getEl(
            "[data-testid=episodes-browse-episodes] >:nth-child(2) >:nth-child(2)",
            "seasons count"
          ).innerText,
          10
        );
        episodes = Number.parseInt(
          getEl("[data-testid=episodes-header] .ipc-title__subtext", "episodes count").innerText,
          10
        );
        creators.push(...getListValues(creditsEls[0], ":scope ul li a"));
        cast.push(...getListValues(creditsEls[1], ":scope ul li a"));
      } else {
        creators.push(...getListValues(creditsEls[0], ":scope ul li a"));
        creators.push(...getListValues(creditsEls[1], ":scope ul li a"));
        cast.push(...getListValues(creditsEls[2], ":scope ul li a"));
      }
      if (isMiniSeries) {
        duration = "";
      }
      const chips = getListValues(document, ".ipc-chip__text").map((item) => item.toLowerCase());
      const isAnime = chips.includes("anime");
      if (isAnime) {
        creators.length = 0;
        cast.length = 0;
      }
      const isAnimation = chips.includes("animation");
      if (isAnimation) {
        cast.length = 0;
      }
      return {
        typeName: "IMDBFilm",
        version: 1,
        title,
        coverURL,
        releaseDate,
        originalLanguage,
        countriesOfOrigin,
        creators: uniqArr(creators).join(", "),
        cast: uniqArr(cast).join(", "),
        seasons,
        episodes,
        duration,
        description
      };
    }
  };

  // src/scrapers/any-image.ts
  var ImageScraper = class extends Scraper {
    constructor() {
      super(...arguments);
      this.pattern = new URLPattern({
        pathname: "/*.:filetype(jpg|png)"
      });
    }
    scrape() {
      return {
        typeName: "Image",
        version: 1,
        imageURL: location.href
      };
    }
  };

  // src/scrapers/index.ts
  var SCRAPERS = [
    new YakabooBookScraper(),
    new SteamGameScraper(),
    new MyAnimeListAnimeScraper(),
    new IMDBFilmScraper(),
    new ImageScraper()
  ];

  // src/scraper-ui.html
  var scraper_ui_default = '<div id="_scraper-ui-panel">\n  <button id="_scraper-ui-btn-scrape">SCRAPE!</button>\n\n  <span id="_scraper-results-counter"\n    >Results: <span class="_scraper-total-count">0</span> (<span class="_scraper-errors-count"\n      >0</span\n    >\n    errors)</span\n  >\n\n  <button id="_scraper-ui-btn-done">Done</button>\n\n  <style>\n    #_scraper-ui-panel {\n      background: lightgoldenrodyellow;\n      box-shadow:\n        rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,\n        rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,\n        rgba(255, 255, 255, 0.08) 0px 1px 0px inset;\n      border-radius: 5px;\n      padding: 1em 1.2em;\n\n      display: flex;\n      align-items: center;\n\n      position: fixed;\n      top: 5%;\n      right: 10%;\n      z-index: 1000;\n    }\n\n    #_scraper-ui-panel button {\n      font-size: xx-large;\n      cursor: pointer;\n      padding: 0.5em;\n    }\n\n    #_scraper-ui-panel #_scraper-results-counter {\n      font-size: x-large;\n      margin-left: 0.5em;\n      margin-right: 3em;\n    }\n  </style>\n</div>\n';

  // src/browser-scraper.ts
  var BrowserScraper = class {
    constructor() {
      this.results = [];
    }
    injectScraperUI(onDone) {
      document.body.insertAdjacentHTML("afterbegin", scraper_ui_default);
      document.getElementById("_scraper-ui-btn-scrape").addEventListener("click", () => void this.scrape());
      document.getElementById("_scraper-ui-btn-done").addEventListener("click", () => {
        onDone();
      });
    }
    destroy() {
      var _a3;
      (_a3 = document.getElementById("_scraper-ui-panel")) == null ? void 0 : _a3.remove();
    }
    async scrape() {
      var _a3, _b;
      const result = {
        url: location.href
      };
      for (const scraper of SCRAPERS) {
        if (!scraper.pattern.test(window.location.href)) {
          continue;
        }
        try {
          const data = await scraper.scrape();
          console.info(`scraper ${scraper.constructor.name} succeeded`);
          result.scraperName = scraper.constructor.name;
          result.data = data;
          break;
        } catch (e) {
          console.error(`scraper ${scraper.constructor.name} failed:`, e);
          result.scraperName = scraper.constructor.name;
          result.error = (_b = (_a3 = e.stack) == null ? void 0 : _a3.toString()) != null ? _b : "";
          this._addResult(result);
          throw e;
        }
      }
      this._addResult(result);
      return result;
    }
    _addResult(result) {
      this.results.push(result);
      const totalCountEl = document.querySelector("#_scraper-results-counter ._scraper-total-count");
      const errorsCountEl = document.querySelector(
        "#_scraper-results-counter ._scraper-errors-count"
      );
      if (totalCountEl) {
        totalCountEl.innerHTML = this.results.length.toString();
      }
      if (errorsCountEl) {
        errorsCountEl.innerHTML = this.results.filter((result2) => Boolean(result2.error)).length.toString();
      }
    }
  };

  // src/index.ts
  function initScraper() {
    const scraper = new BrowserScraper();
    window._scraper = scraper;
    scraper.injectScraperUI(async () => {
      const container = {
        "@type": "scrape-results-container",
        results: scraper.results
      };
      try {
        await navigator.clipboard.writeText(JSON.stringify(container));
      } catch (e) {
        console.error(e);
        alert(`Failed to copy text to clipboard: ${String(e)}`);
        throw e;
      }
      scraper.destroy();
      window._scraper = void 0;
    });
  }
  if (window.GM_registerMenuCommand) {
    window.GM_registerMenuCommand("Run scraper", initScraper);
  } else {
    initScraper();
  }
})();
//# sourceMappingURL=scraper.user.js.map
