
// ==UserScript==
// @name         scraper
// @version      2.3.0
// @description  Scrape the data from the page you're on
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
  var R = class {
    constructor(t, r, n, o, c, l) {
      __publicField(this, "type", 3);
      __publicField(this, "name", "");
      __publicField(this, "prefix", "");
      __publicField(this, "value", "");
      __publicField(this, "suffix", "");
      __publicField(this, "modifier", 3);
      this.type = t, this.name = r, this.prefix = n, this.value = o, this.suffix = c, this.modifier = l;
    }
    hasCustomName() {
      return this.name !== "" && typeof this.name != "number";
    }
  };
  var be = /[$_\p{ID_Start}]/u;
  var Pe = /[$_\u200C\u200D\p{ID_Continue}]/u;
  var M = ".*";
  function Re(e, t) {
    return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
  }
  function v(e, t = false) {
    let r = [], n = 0;
    for (; n < e.length; ) {
      let o = e[n], c = function(l) {
        if (!t) throw new TypeError(l);
        r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
      };
      if (o === "*") {
        r.push({ type: "ASTERISK", index: n, value: e[n++] });
        continue;
      }
      if (o === "+" || o === "?") {
        r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
        continue;
      }
      if (o === "\\") {
        r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
        continue;
      }
      if (o === "{") {
        r.push({ type: "OPEN", index: n, value: e[n++] });
        continue;
      }
      if (o === "}") {
        r.push({ type: "CLOSE", index: n, value: e[n++] });
        continue;
      }
      if (o === ":") {
        let l = "", s = n + 1;
        for (; s < e.length; ) {
          let i = e.substr(s, 1);
          if (s === n + 1 && be.test(i) || s !== n + 1 && Pe.test(i)) {
            l += e[s++];
            continue;
          }
          break;
        }
        if (!l) {
          c(`Missing parameter name at ${n}`);
          continue;
        }
        r.push({ type: "NAME", index: n, value: l }), n = s;
        continue;
      }
      if (o === "(") {
        let l = 1, s = "", i = n + 1, a = false;
        if (e[i] === "?") {
          c(`Pattern cannot start with "?" at ${i}`);
          continue;
        }
        for (; i < e.length; ) {
          if (!Re(e[i], false)) {
            c(`Invalid character '${e[i]}' at ${i}.`), a = true;
            break;
          }
          if (e[i] === "\\") {
            s += e[i++] + e[i++];
            continue;
          }
          if (e[i] === ")") {
            if (l--, l === 0) {
              i++;
              break;
            }
          } else if (e[i] === "(" && (l++, e[i + 1] !== "?")) {
            c(`Capturing groups are not allowed at ${i}`), a = true;
            break;
          }
          s += e[i++];
        }
        if (a) continue;
        if (l) {
          c(`Unbalanced pattern at ${n}`);
          continue;
        }
        if (!s) {
          c(`Missing pattern at ${n}`);
          continue;
        }
        r.push({ type: "REGEX", index: n, value: s }), n = i;
        continue;
      }
      r.push({ type: "CHAR", index: n, value: e[n++] });
    }
    return r.push({ type: "END", index: n, value: "" }), r;
  }
  function D(e, t = {}) {
    var _a3, _b;
    let r = v(e);
    (_a3 = t.delimiter) != null ? _a3 : t.delimiter = "/#?", (_b = t.prefixes) != null ? _b : t.prefixes = "./";
    let n = `[^${S(t.delimiter)}]+?`, o = [], c = 0, l = 0, s = "", i = /* @__PURE__ */ new Set(), a = (h) => {
      if (l < r.length && r[l].type === h) return r[l++].value;
    }, f = () => {
      var _a4;
      return (_a4 = a("OTHER_MODIFIER")) != null ? _a4 : a("ASTERISK");
    }, d = (h) => {
      let u = a(h);
      if (u !== void 0) return u;
      let { type: p, index: A } = r[l];
      throw new TypeError(`Unexpected ${p} at ${A}, expected ${h}`);
    }, T = () => {
      var _a4;
      let h = "", u;
      for (; u = (_a4 = a("CHAR")) != null ? _a4 : a("ESCAPED_CHAR"); ) h += u;
      return h;
    }, Se = (h) => h, L = t.encodePart || Se, I = "", U = (h) => {
      I += h;
    }, $ = () => {
      I.length && (o.push(new R(3, "", "", L(I), "", 3)), I = "");
    }, V = (h, u, p, A, Y) => {
      let g = 3;
      switch (Y) {
        case "?":
          g = 1;
          break;
        case "*":
          g = 0;
          break;
        case "+":
          g = 2;
          break;
      }
      if (!u && !p && g === 3) {
        U(h);
        return;
      }
      if ($(), !u && !p) {
        if (!h) return;
        o.push(new R(3, "", "", L(h), "", g));
        return;
      }
      let m;
      p ? p === "*" ? m = M : m = p : m = n;
      let O = 2;
      m === n ? (O = 1, m = "") : m === M && (O = 0, m = "");
      let P;
      if (u ? P = u : p && (P = c++), i.has(P)) throw new TypeError(`Duplicate name '${P}'.`);
      i.add(P), o.push(new R(O, P, L(h), m, L(A), g));
    };
    for (; l < r.length; ) {
      let h = a("CHAR"), u = a("NAME"), p = a("REGEX");
      if (!u && !p && (p = a("ASTERISK")), u || p) {
        let g = h != null ? h : "";
        t.prefixes.indexOf(g) === -1 && (U(g), g = ""), $();
        let m = f();
        V(g, u, p, "", m);
        continue;
      }
      let A = h != null ? h : a("ESCAPED_CHAR");
      if (A) {
        U(A);
        continue;
      }
      if (a("OPEN")) {
        let g = T(), m = a("NAME"), O = a("REGEX");
        !m && !O && (O = a("ASTERISK"));
        let P = T();
        d("CLOSE");
        let xe = f();
        V(g, m, O, P, xe);
        continue;
      }
      $(), d("END");
    }
    return o;
  }
  function S(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function X(e) {
    return e && e.ignoreCase ? "ui" : "u";
  }
  function Z(e, t, r) {
    return F(D(e, r), t, r);
  }
  function k(e) {
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
  function F(e, t, r = {}) {
    var _a3, _b, _c, _d2, _e3, _f;
    (_a3 = r.delimiter) != null ? _a3 : r.delimiter = "/#?", (_b = r.prefixes) != null ? _b : r.prefixes = "./", (_c = r.sensitive) != null ? _c : r.sensitive = false, (_d2 = r.strict) != null ? _d2 : r.strict = false, (_e3 = r.end) != null ? _e3 : r.end = true, (_f = r.start) != null ? _f : r.start = true, r.endsWith = "";
    let n = r.start ? "^" : "";
    for (let s of e) {
      if (s.type === 3) {
        s.modifier === 3 ? n += S(s.value) : n += `(?:${S(s.value)})${k(s.modifier)}`;
        continue;
      }
      t && t.push(s.name);
      let i = `[^${S(r.delimiter)}]+?`, a = s.value;
      if (s.type === 1 ? a = i : s.type === 0 && (a = M), !s.prefix.length && !s.suffix.length) {
        s.modifier === 3 || s.modifier === 1 ? n += `(${a})${k(s.modifier)}` : n += `((?:${a})${k(s.modifier)})`;
        continue;
      }
      if (s.modifier === 3 || s.modifier === 1) {
        n += `(?:${S(s.prefix)}(${a})${S(s.suffix)})`, n += k(s.modifier);
        continue;
      }
      n += `(?:${S(s.prefix)}`, n += `((?:${a})(?:`, n += S(s.suffix), n += S(s.prefix), n += `(?:${a}))*)${S(s.suffix)})`, s.modifier === 0 && (n += "?");
    }
    let o = `[${S(r.endsWith)}]|$`, c = `[${S(r.delimiter)}]`;
    if (r.end) return r.strict || (n += `${c}?`), r.endsWith.length ? n += `(?=${o})` : n += "$", new RegExp(n, X(r));
    r.strict || (n += `(?:${c}(?=${o}))?`);
    let l = false;
    if (e.length) {
      let s = e[e.length - 1];
      s.type === 3 && s.modifier === 3 && (l = r.delimiter.indexOf(s) > -1);
    }
    return l || (n += `(?=${c}|${o})`), new RegExp(n, X(r));
  }
  var x = { delimiter: "", prefixes: "", sensitive: true, strict: true };
  var B = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
  var q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
  function J(e, t) {
    return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
  }
  function Q(e, t) {
    return e.startsWith(t) ? e.substring(t.length, e.length) : e;
  }
  function Ee(e, t) {
    return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
  }
  function W(e) {
    return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
  }
  var ee = ["ftp", "file", "http", "https", "ws", "wss"];
  function N(e) {
    if (!e) return true;
    for (let t of ee) if (e.test(t)) return true;
    return false;
  }
  function te(e, t) {
    if (e = Q(e, "#"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
  }
  function re(e, t) {
    if (e = Q(e, "?"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
  }
  function ne(e, t) {
    return t || e === "" ? e : W(e) ? j(e) : z(e);
  }
  function se(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.password = e, r.password;
  }
  function ie(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.username = e, r.username;
  }
  function ae(e, t, r) {
    if (r || e === "") return e;
    if (t && !ee.includes(t)) return new URL(`${t}:${e}`).pathname;
    let n = e[0] == "/";
    return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
  }
  function oe(e, t, r) {
    return _(t) === e && (e = ""), r || e === "" ? e : K(e);
  }
  function ce(e, t) {
    return e = Ee(e, ":"), t || e === "" ? e : y(e);
  }
  function _(e) {
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
  function y(e) {
    if (e === "") return e;
    if (/^[-+.A-Za-z0-9]*$/.test(e)) return e.toLowerCase();
    throw new TypeError(`Invalid protocol '${e}'.`);
  }
  function le(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.username = e, t.username;
  }
  function fe(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.password = e, t.password;
  }
  function z(e) {
    if (e === "") return e;
    if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e)) throw new TypeError(`Invalid hostname '${e}'`);
    let t = new URL("https://example.com");
    return t.hostname = e, t.hostname;
  }
  function j(e) {
    if (e === "") return e;
    if (/[^0-9a-fA-F[\]:]/g.test(e)) throw new TypeError(`Invalid IPv6 hostname '${e}'`);
    return e.toLowerCase();
  }
  function K(e) {
    if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535) return e;
    throw new TypeError(`Invalid port '${e}'.`);
  }
  function he(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
  }
  function ue(e) {
    return e === "" ? e : new URL(`data:${e}`).pathname;
  }
  function de(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.search = e, t.search.substring(1, t.search.length);
  }
  function pe(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.hash = e, t.hash.substring(1, t.hash.length);
  }
  var _i, _n, _t, _e, _s, _l, _o, _d, _p, _g, _H_instances, r_fn, R_fn, b_fn, u_fn, m_fn, a_fn, P_fn, E_fn, S_fn, O_fn, k_fn, x_fn, h_fn, f_fn, T_fn, A_fn, y_fn, w_fn, c_fn, C_fn, _a;
  var H = (_a = class {
    constructor(t) {
      __privateAdd(this, _H_instances);
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
      for (__privateSet(this, _n, v(__privateGet(this, _i), true)); __privateGet(this, _e) < __privateGet(this, _n).length; __privateSet(this, _e, __privateGet(this, _e) + __privateGet(this, _s))) {
        if (__privateSet(this, _s, 1), __privateGet(this, _n)[__privateGet(this, _e)].type === "END") {
          if (__privateGet(this, _o) === 0) {
            __privateMethod(this, _H_instances, b_fn).call(this), __privateMethod(this, _H_instances, f_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 9, 1) : __privateMethod(this, _H_instances, h_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _H_instances, r_fn).call(this, 7, 0);
            continue;
          } else if (__privateGet(this, _o) === 2) {
            __privateMethod(this, _H_instances, u_fn).call(this, 5);
            continue;
          }
          __privateMethod(this, _H_instances, r_fn).call(this, 10, 0);
          break;
        }
        if (__privateGet(this, _d) > 0) if (__privateMethod(this, _H_instances, A_fn).call(this)) __privateSet(this, _d, __privateGet(this, _d) - 1);
        else continue;
        if (__privateMethod(this, _H_instances, T_fn).call(this)) {
          __privateSet(this, _d, __privateGet(this, _d) + 1);
          continue;
        }
        switch (__privateGet(this, _o)) {
          case 0:
            __privateMethod(this, _H_instances, P_fn).call(this) && __privateMethod(this, _H_instances, u_fn).call(this, 1);
            break;
          case 1:
            if (__privateMethod(this, _H_instances, P_fn).call(this)) {
              __privateMethod(this, _H_instances, C_fn).call(this);
              let t = 7, r = 1;
              __privateMethod(this, _H_instances, E_fn).call(this) ? (t = 2, r = 3) : __privateGet(this, _g) && (t = 2), __privateMethod(this, _H_instances, r_fn).call(this, t, r);
            }
            break;
          case 2:
            __privateMethod(this, _H_instances, S_fn).call(this) ? __privateMethod(this, _H_instances, u_fn).call(this, 3) : (__privateMethod(this, _H_instances, x_fn).call(this) || __privateMethod(this, _H_instances, h_fn).call(this) || __privateMethod(this, _H_instances, f_fn).call(this)) && __privateMethod(this, _H_instances, u_fn).call(this, 5);
            break;
          case 3:
            __privateMethod(this, _H_instances, O_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 4, 1) : __privateMethod(this, _H_instances, S_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 5, 1);
            break;
          case 4:
            __privateMethod(this, _H_instances, S_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 5, 1);
            break;
          case 5:
            __privateMethod(this, _H_instances, y_fn).call(this) ? __privateSet(this, _p, __privateGet(this, _p) + 1) : __privateMethod(this, _H_instances, w_fn).call(this) && __privateSet(this, _p, __privateGet(this, _p) - 1), __privateMethod(this, _H_instances, k_fn).call(this) && !__privateGet(this, _p) ? __privateMethod(this, _H_instances, r_fn).call(this, 6, 1) : __privateMethod(this, _H_instances, x_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 7, 0) : __privateMethod(this, _H_instances, h_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _H_instances, f_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 9, 1);
            break;
          case 6:
            __privateMethod(this, _H_instances, x_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 7, 0) : __privateMethod(this, _H_instances, h_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _H_instances, f_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 9, 1);
            break;
          case 7:
            __privateMethod(this, _H_instances, h_fn).call(this) ? __privateMethod(this, _H_instances, r_fn).call(this, 8, 1) : __privateMethod(this, _H_instances, f_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 9, 1);
            break;
          case 8:
            __privateMethod(this, _H_instances, f_fn).call(this) && __privateMethod(this, _H_instances, r_fn).call(this, 9, 1);
            break;
          case 9:
            break;
          case 10:
            break;
        }
      }
      __privateGet(this, _t).hostname !== void 0 && __privateGet(this, _t).port === void 0 && (__privateGet(this, _t).port = "");
    }
  }, _i = new WeakMap(), _n = new WeakMap(), _t = new WeakMap(), _e = new WeakMap(), _s = new WeakMap(), _l = new WeakMap(), _o = new WeakMap(), _d = new WeakMap(), _p = new WeakMap(), _g = new WeakMap(), _H_instances = new WeakSet(), r_fn = function(t, r) {
    var _a3, _b, _c, _d2, _e3, _f;
    switch (__privateGet(this, _o)) {
      case 0:
        break;
      case 1:
        __privateGet(this, _t).protocol = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 2:
        break;
      case 3:
        __privateGet(this, _t).username = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 4:
        __privateGet(this, _t).password = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 5:
        __privateGet(this, _t).hostname = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 6:
        __privateGet(this, _t).port = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 7:
        __privateGet(this, _t).pathname = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 8:
        __privateGet(this, _t).search = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 9:
        __privateGet(this, _t).hash = __privateMethod(this, _H_instances, c_fn).call(this);
        break;
      case 10:
        break;
    }
    __privateGet(this, _o) !== 0 && t !== 10 && ([1, 2, 3, 4].includes(__privateGet(this, _o)) && [6, 7, 8, 9].includes(t) && ((_b = (_a3 = __privateGet(this, _t)).hostname) != null ? _b : _a3.hostname = ""), [1, 2, 3, 4, 5, 6].includes(__privateGet(this, _o)) && [8, 9].includes(t) && ((_d2 = (_c = __privateGet(this, _t)).pathname) != null ? _d2 : _c.pathname = __privateGet(this, _g) ? "/" : ""), [1, 2, 3, 4, 5, 6, 7].includes(__privateGet(this, _o)) && t === 9 && ((_f = (_e3 = __privateGet(this, _t)).search) != null ? _f : _e3.search = "")), __privateMethod(this, _H_instances, R_fn).call(this, t, r);
  }, R_fn = function(t, r) {
    __privateSet(this, _o, t), __privateSet(this, _l, __privateGet(this, _e) + r), __privateSet(this, _e, __privateGet(this, _e) + r), __privateSet(this, _s, 0);
  }, b_fn = function() {
    __privateSet(this, _e, __privateGet(this, _l)), __privateSet(this, _s, 0);
  }, u_fn = function(t) {
    __privateMethod(this, _H_instances, b_fn).call(this), __privateSet(this, _o, t);
  }, m_fn = function(t) {
    return t < 0 && (t = __privateGet(this, _n).length - t), t < __privateGet(this, _n).length ? __privateGet(this, _n)[t] : __privateGet(this, _n)[__privateGet(this, _n).length - 1];
  }, a_fn = function(t, r) {
    let n = __privateMethod(this, _H_instances, m_fn).call(this, t);
    return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
  }, P_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, E_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e) + 1, "/") && __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e) + 2, "/");
  }, S_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "@");
  }, O_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, k_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), ":");
  }, x_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "/");
  }, h_fn = function() {
    if (__privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "?")) return true;
    if (__privateGet(this, _n)[__privateGet(this, _e)].value !== "?") return false;
    let t = __privateMethod(this, _H_instances, m_fn).call(this, __privateGet(this, _e) - 1);
    return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
  }, f_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "#");
  }, T_fn = function() {
    return __privateGet(this, _n)[__privateGet(this, _e)].type == "OPEN";
  }, A_fn = function() {
    return __privateGet(this, _n)[__privateGet(this, _e)].type == "CLOSE";
  }, y_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "[");
  }, w_fn = function() {
    return __privateMethod(this, _H_instances, a_fn).call(this, __privateGet(this, _e), "]");
  }, c_fn = function() {
    let t = __privateGet(this, _n)[__privateGet(this, _e)], r = __privateMethod(this, _H_instances, m_fn).call(this, __privateGet(this, _l)).index;
    return __privateGet(this, _i).substring(r, t.index);
  }, C_fn = function() {
    let t = {};
    Object.assign(t, x), t.encodePart = y;
    let r = Z(__privateMethod(this, _H_instances, c_fn).call(this), void 0, t);
    __privateSet(this, _g, N(r));
  }, _a);
  var G = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
  var E = "*";
  function ge(e, t) {
    if (typeof e != "string") throw new TypeError("parameter 1 is not of type 'string'.");
    let r = new URL(e, t);
    return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : void 0, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : void 0 };
  }
  function b(e, t) {
    return t ? C(e) : e;
  }
  function w(e, t, r) {
    let n;
    if (typeof t.baseURL == "string") try {
      n = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = b(n.protocol.substring(0, n.protocol.length - 1), r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = b(n.username, r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = b(n.password, r)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = b(n.hostname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = b(n.port, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = b(n.pathname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = b(n.search.substring(1, n.search.length), r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = b(n.hash.substring(1, n.hash.length), r));
    } catch {
      throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
    }
    if (typeof t.protocol == "string" && (e.protocol = ce(t.protocol, r)), typeof t.username == "string" && (e.username = ie(t.username, r)), typeof t.password == "string" && (e.password = se(t.password, r)), typeof t.hostname == "string" && (e.hostname = ne(t.hostname, r)), typeof t.port == "string" && (e.port = oe(t.port, e.protocol, r)), typeof t.pathname == "string") {
      if (e.pathname = t.pathname, n && !J(e.pathname, r)) {
        let o = n.pathname.lastIndexOf("/");
        o >= 0 && (e.pathname = b(n.pathname.substring(0, o + 1), r) + e.pathname);
      }
      e.pathname = ae(e.pathname, e.protocol, r);
    }
    return typeof t.search == "string" && (e.search = re(t.search, r)), typeof t.hash == "string" && (e.hash = te(t.hash, r)), e;
  }
  function C(e) {
    return e.replace(/([+*?:{}()\\])/g, "\\$1");
  }
  function Oe(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function ke(e, t) {
    var _a3, _b, _c, _d2, _e3, _f;
    (_a3 = t.delimiter) != null ? _a3 : t.delimiter = "/#?", (_b = t.prefixes) != null ? _b : t.prefixes = "./", (_c = t.sensitive) != null ? _c : t.sensitive = false, (_d2 = t.strict) != null ? _d2 : t.strict = false, (_e3 = t.end) != null ? _e3 : t.end = true, (_f = t.start) != null ? _f : t.start = true, t.endsWith = "";
    let r = ".*", n = `[^${Oe(t.delimiter)}]+?`, o = /[$_\u200C\u200D\p{ID_Continue}]/u, c = "";
    for (let l = 0; l < e.length; ++l) {
      let s = e[l];
      if (s.type === 3) {
        if (s.modifier === 3) {
          c += C(s.value);
          continue;
        }
        c += `{${C(s.value)}}${k(s.modifier)}`;
        continue;
      }
      let i = s.hasCustomName(), a = !!s.suffix.length || !!s.prefix.length && (s.prefix.length !== 1 || !t.prefixes.includes(s.prefix)), f = l > 0 ? e[l - 1] : null, d = l < e.length - 1 ? e[l + 1] : null;
      if (!a && i && s.type === 1 && s.modifier === 3 && d && !d.prefix.length && !d.suffix.length) if (d.type === 3) {
        let T = d.value.length > 0 ? d.value[0] : "";
        a = o.test(T);
      } else a = !d.hasCustomName();
      if (!a && !s.prefix.length && f && f.type === 3) {
        let T = f.value[f.value.length - 1];
        a = t.prefixes.includes(T);
      }
      a && (c += "{"), c += C(s.prefix), i && (c += `:${s.name}`), s.type === 2 ? c += `(${s.value})` : s.type === 1 ? i || (c += `(${n})`) : s.type === 0 && (!i && (!f || f.type === 3 || f.modifier !== 3 || a || s.prefix !== "") ? c += "*" : c += `(${r})`), s.type === 1 && i && s.suffix.length && o.test(s.suffix[0]) && (c += "\\"), c += C(s.suffix), a && (c += "}"), s.modifier !== 3 && (c += k(s.modifier));
    }
    return c;
  }
  var _i2, _n2, _t2, _e2, _s2, _l2, _a2;
  var me = (_a2 = class {
    constructor(t = {}, r, n) {
      __privateAdd(this, _i2);
      __privateAdd(this, _n2, {});
      __privateAdd(this, _t2, {});
      __privateAdd(this, _e2, {});
      __privateAdd(this, _s2, {});
      __privateAdd(this, _l2, false);
      try {
        let o;
        if (typeof r == "string" ? o = r : n = r, typeof t == "string") {
          let i = new H(t);
          if (i.parse(), t = i.result, o === void 0 && typeof t.protocol != "string") throw new TypeError("A base URL must be provided for a relative constructor string.");
          t.baseURL = o;
        } else {
          if (!t || typeof t != "object") throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
          if (o) throw new TypeError("parameter 1 is not of type 'string'.");
        }
        typeof n > "u" && (n = { ignoreCase: false });
        let c = { ignoreCase: n.ignoreCase === true }, l = { pathname: E, protocol: E, username: E, password: E, hostname: E, port: E, search: E, hash: E };
        __privateSet(this, _i2, w(l, t, true)), _(__privateGet(this, _i2).protocol) === __privateGet(this, _i2).port && (__privateGet(this, _i2).port = "");
        let s;
        for (s of G) {
          if (!(s in __privateGet(this, _i2))) continue;
          let i = {}, a = __privateGet(this, _i2)[s];
          switch (__privateGet(this, _t2)[s] = [], s) {
            case "protocol":
              Object.assign(i, x), i.encodePart = y;
              break;
            case "username":
              Object.assign(i, x), i.encodePart = le;
              break;
            case "password":
              Object.assign(i, x), i.encodePart = fe;
              break;
            case "hostname":
              Object.assign(i, B), W(a) ? i.encodePart = j : i.encodePart = z;
              break;
            case "port":
              Object.assign(i, x), i.encodePart = K;
              break;
            case "pathname":
              N(__privateGet(this, _n2).protocol) ? (Object.assign(i, q, c), i.encodePart = he) : (Object.assign(i, x, c), i.encodePart = ue);
              break;
            case "search":
              Object.assign(i, x, c), i.encodePart = de;
              break;
            case "hash":
              Object.assign(i, x, c), i.encodePart = pe;
              break;
          }
          try {
            __privateGet(this, _s2)[s] = D(a, i), __privateGet(this, _n2)[s] = F(__privateGet(this, _s2)[s], __privateGet(this, _t2)[s], i), __privateGet(this, _e2)[s] = ke(__privateGet(this, _s2)[s], i), __privateSet(this, _l2, __privateGet(this, _l2) || __privateGet(this, _s2)[s].some((f) => f.type === 2));
          } catch {
            throw new TypeError(`invalid ${s} pattern '${__privateGet(this, _i2)[s]}'.`);
          }
        }
      } catch (o) {
        throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`);
      }
    }
    test(t = {}, r) {
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return false;
      try {
        typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
      } catch {
        return false;
      }
      let o;
      for (o of G) if (!__privateGet(this, _n2)[o].exec(n[o])) return false;
      return true;
    }
    exec(t = {}, r) {
      var _a3;
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return;
      try {
        typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
      } catch {
        return null;
      }
      let o = {};
      r ? o.inputs = [t, r] : o.inputs = [t];
      let c;
      for (c of G) {
        let l = __privateGet(this, _n2)[c].exec(n[c]);
        if (!l) return null;
        let s = {};
        for (let [i, a] of __privateGet(this, _t2)[c].entries()) if (typeof a == "string" || typeof a == "number") {
          let f = l[i + 1];
          s[a] = f;
        }
        o[c] = { input: (_a3 = n[c]) != null ? _a3 : "", groups: s };
      }
      return o;
    }
    static compareComponent(t, r, n) {
      let o = (i, a) => {
        for (let f of ["type", "modifier", "prefix", "value", "suffix"]) {
          if (i[f] < a[f]) return -1;
          if (i[f] === a[f]) continue;
          return 1;
        }
        return 0;
      }, c = new R(3, "", "", "", "", 3), l = new R(0, "", "", "", "", 3), s = (i, a) => {
        var _a3, _b;
        let f = 0;
        for (; f < Math.min(i.length, a.length); ++f) {
          let d = o(i[f], a[f]);
          if (d) return d;
        }
        return i.length === a.length ? 0 : o((_a3 = i[f]) != null ? _a3 : c, (_b = a[f]) != null ? _b : c);
      };
      return !__privateGet(r, _e2)[t] && !__privateGet(n, _e2)[t] ? 0 : __privateGet(r, _e2)[t] && !__privateGet(n, _e2)[t] ? s(__privateGet(r, _s2)[t], [l]) : !__privateGet(r, _e2)[t] && __privateGet(n, _e2)[t] ? s([l], __privateGet(n, _s2)[t]) : s(__privateGet(r, _s2)[t], __privateGet(n, _s2)[t]);
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

  // node_modules/urlpattern-polyfill/index.js
  if (!globalThis.URLPattern) {
    globalThis.URLPattern = me;
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
      this.scrape = async () => {
        var _a3, _b;
        const coverURL = getEl(".gallery [aria-hidden=false] img", "cover image").src;
        const title = getEl(".base-product__title h1", "title").innerText.substring("\u041A\u043D\u0438\u0433\u0430 ".length).trim();
        (_a3 = getEl(".description__btn")) == null ? void 0 : _a3.click();
        const description = getEl(".description__content", "description").innerText;
        const expandAttrsBtn = getEl(".main__chars button.ui-btn-nav", "expand attributes button");
        expandAttrsBtn.scrollIntoView();
        expandAttrsBtn.click();
        await waitForFunction(
          () => {
            var _a4, _b2;
            return (_b2 = (_a4 = document.querySelector(".main__chars button.ui-btn-nav")) == null ? void 0 : _a4.innerText.includes("\u041F\u0440\u0438\u0445\u043E\u0432\u0430\u0442\u0438")) != null ? _b2 : false;
          },
          "collapse attributes button"
        );
        const table = getTable(document, ".product-chars .chars .char", "\n");
        const authors = table["\u0410\u0432\u0442\u043E\u0440"] || "";
        const language = (_b = LANGUAGE_TRANSLATIONS[table["\u041C\u043E\u0432\u0430"] || ""]) != null ? _b : "";
        const publicationDate = table["\u0420\u0456\u043A \u0432\u0438\u0434\u0430\u043D\u043D\u044F"] || "";
        const translators = table["\u041F\u0435\u0440\u0435\u043A\u043B\u0430\u0434\u0430\u0447"] || "";
        const publisher = table["\u0412\u0438\u0434\u0430\u0432\u043D\u0438\u0446\u0442\u0432\u043E"] || "";
        const pages = Number.parseInt(table["\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0441\u0442\u043E\u0440\u0456\u043D\u043E\u043A"] || "", 10);
        return {
          typeName: "YakabooBook",
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
      this.scrape = () => {
        const coverURL = getEl(".game_header_image_full", "cover image").src;
        const name = getEl("#appHubAppName", "game name").innerText;
        const releaseDate = getEl(".release_date .date", "release date").innerText;
        const developers = getListStr(document, "#developers_list a");
        getEl("#game_area_description h2", "description header").remove();
        const description = getEl("#game_area_description", "description").innerText;
        return {
          typeName: "SteamGame",
          coverURL,
          name,
          releaseDate,
          developers,
          description
        };
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
      this.scrape = () => {
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
          title,
          coverURL,
          releaseDate,
          creators,
          duration,
          description
        };
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
      this.scrape = async () => {
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
      this.scrape = () => ({
        typeName: "Image",
        imageURL: location.href
      });
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
  var scraper_ui_default = '<div id="_scraper-ui-panel">\n  <button id="_scraper-ui-btn-scrape">SCRAPE!</button>\n\n  <span id="_scraper-results-counter">Results: <span>0</span></span>\n\n  <button id="_scraper-ui-btn-done">Done</button>\n\n  <style>\n    #_scraper-ui-panel {\n      background: lightgoldenrodyellow;\n      box-shadow:\n        rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,\n        rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,\n        rgba(255, 255, 255, 0.08) 0px 1px 0px inset;\n      border-radius: 5px;\n      padding: 1em 1.2em;\n\n      display: flex;\n      align-items: center;\n\n      position: fixed;\n      top: 5%;\n      right: 10%;\n      z-index: 1000;\n    }\n\n    #_scraper-ui-panel button {\n      font-size: xx-large;\n      cursor: pointer;\n      padding: 0.5em;\n    }\n\n    #_scraper-ui-panel #_scraper-results-counter {\n      font-size: x-large;\n      margin-left: 0.5em;\n      margin-right: 3em;\n    }\n  </style>\n</div>\n';

  // src/browser-scraper.ts
  var ScrapingDoneEvent = class extends CustomEvent {
    constructor() {
      super("scraping-done");
    }
  };
  var BrowserScraper = class {
    constructor() {
      this.results = [];
    }
    injectScraperUI() {
      document.body.insertAdjacentHTML("afterbegin", scraper_ui_default);
      document.getElementById("_scraper-ui-btn-scrape").addEventListener("click", () => void this.scrape());
      document.getElementById("_scraper-ui-btn-done").addEventListener("click", () => {
        document.body.dispatchEvent(new ScrapingDoneEvent());
      });
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
      const counterEl = document.querySelector("#_scraper-results-counter span");
      if (counterEl) {
        counterEl.innerHTML = this.results.length.toString();
      }
    }
  };

  // src/index.ts
  function initScraper() {
    window._scraper = new BrowserScraper();
    window._scraper.injectScraperUI();
  }
  if (window.GM_registerMenuCommand) {
    window.GM_registerMenuCommand("Run scraper", initScraper);
  } else {
    initScraper();
  }
})();
//# sourceMappingURL=scraper.user.js.map
