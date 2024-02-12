var F = Object.defineProperty;
var q = (e, t, s) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var h = (e, t, s) => (q(e, typeof t != "symbol" ? t + "" : t, s), s);
import { reactive as x, effect as K } from "@vue/reactivity";
const D = /* @__PURE__ */ Object.create(null);
function T(e, t, s) {
  return $(e, `return(${t})`, s);
}
function $(e, t, s, n) {
  JSON.stringify(e);
  const r = D[t] || (D[t] = X(t));
  try {
    return r(e, s, n);
  } catch (o) {
    console.error(o);
  }
}
function X(e) {
  try {
    return new Function("data", "$el", "$event", `with(data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}
class L {
  constructor(t, s, n) {
    // Store the context's root element
    h(this, "root");
    // Reactive dataset available to the entire scope
    h(this, "data");
    h(this, "init");
    // Hold all context runners for disposal
    h(this, "effects", []);
    // Stores a referene to the root app instance
    h(this, "app");
    this.root = t, this.data = x(Object.assign({ $refs: {} }, s.rootState, n)), this.init = !1, this.app = s;
  }
  /**
   * Executes the provided callback fn whenever the context's reactive
   * dataset updates
   *
   * @param fn Callback
   */
  effect(t) {
    const s = K(t);
    this.effects.push(s);
  }
  /**
   * Stores a reference to a DOM element by the provided key. This
   * allows us to use $refs object within expressions
   *
   * @param key Ref key
   * @param ref Element
   */
  addRef(t, s) {
    Object.assign(this.data.$refs, { [t]: s });
  }
  /**
   * When creating sub contexts, this allows for a parent context to
   * share its reactive properties with the child context
   *
   * @param ctx Context
   */
  extend(t) {
    Object.assign(this.data, t.data);
  }
  /**
   * Evaluates the provided expression against the context dataset
   *
   * @param expr Expression
   * @param el Optionally, make the current element available as $el
   * @returns Evaluated value
   */
  eval(t, s) {
    return T(this.data, t, s);
  }
  /**
   * Turns the scope's elements to the original static HTML. Removes
   * event listeners and stops reactive watchers.
   */
  teardown() {
    var s;
    this.effects.forEach((n) => n.effect.stop()), this.effects.length = 0;
    const t = this.root.cloneNode(!0);
    (s = this.root.parentElement) == null || s.replaceChild(t, this.root), Reflect.set(this, "data", /* @__PURE__ */ Object.create(null)), this.init = !1;
  }
}
function E(e, t) {
  const s = e.attributes.getNamedItem(t);
  return s ? (e.removeAttribute(t), s.value ?? !0) : null;
}
function j(e) {
  return e == null;
}
function N(e) {
  return !!e && e.constructor === Object;
}
const W = Array.isArray;
function G(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function k(e, t) {
  return e in t.data ? T(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
function M(e) {
  return [...e].reduce((t, s) => t += `\\${s}`, "");
}
function H(e) {
  let t = 0;
  for (; (e = e.previousSibling) != null; )
    t++;
  return t;
}
const z = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), e.addRef(s, t), new MutationObserver(() => {
    e.addRef(s, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, J = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = n;
  e.effect(() => {
    t.textContent = e.eval(r, t);
  });
}, U = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const o = e.eval(r, t);
    if (N(o))
      for (const l of Object.keys(o))
        Reflect.has(t, "style") && Reflect.set(t.style, l, o[l]);
  });
}, Q = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  Reflect.has(t, "style") && e.effect(() => {
    e.eval(r, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, Y = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const o = e.eval(r, t);
    o instanceof Element ? (t.replaceChildren(), t.append(o)) : t.innerHTML = o;
  });
}, Z = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const [r, o] = s.split(":"), l = (i, a) => {
    j(a) || a === !1 ? t.removeAttribute(i) : t.setAttribute(i, a);
  };
  o ? e.effect(() => {
    const i = e.eval(n, t);
    l(o, i);
  }) : e.effect(() => {
    const i = e.eval(n, t) ?? {};
    for (const a of Object.keys(i)) {
      const u = i[a];
      l(a, u);
    }
  });
}, ee = function(e, t, { value: s }) {
  const n = (r) => {
    for (const o of Object.keys(r))
      r[o] ? t.classList.add(o) : t.classList.remove(o);
  };
  if (s.startsWith("[")) {
    const r = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const o = e.eval(s);
      for (let l = 0; l < o.length; l++) {
        const i = o[l];
        if (i)
          typeof i == "string" ? (t.classList.add(i), r[l] = i) : N(i) && n(i);
        else {
          const a = r[l];
          a && (t.classList.remove(a), r[l] = null);
        }
      }
    });
  } else if (s.startsWith("{") && s.endsWith("}"))
    e.effect(() => {
      const r = e.eval(s, t);
      n(r);
    });
  else {
    let r;
    e.effect(() => {
      r && t.classList.remove(r), r = e.eval(s, t), t.classList.add(r);
    });
  }
}, te = {
  throttle: (e, { lastCall: t }, s = 300) => typeof s != "number" ? !1 : Date.now() - t >= s,
  if: (e, t, s) => !!s,
  only: (e, { calledTimes: t }, s = 1) => typeof s != "number" ? !1 : t < s,
  once: (e, { calledTimes: t }) => t < 1,
  self: (e) => e.target === e.currentTarget,
  left: (e) => "button" in e && e.button === 0,
  middle: (e) => "button" in e && e.button === 1,
  right: (e) => "button" in e && e.button === 2,
  prevent: (e) => (e.preventDefault(), !0),
  stop: (e) => (e.stopPropagation(), !0),
  stopImmediate: (e) => (e.stopImmediatePropagation(), !0)
}, se = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = (s.startsWith("x-on") ? s.split(":")[1] : s.substring(1)).split("."), o = r[0], l = r.slice(1).map((a) => {
    const [u, p] = a.split("[");
    let c;
    if (p) {
      const d = p.replace("]", "");
      c = k(d, e);
    }
    return { key: u, param: c };
  }).filter((a) => Object.keys(e.app.eventModifiers).includes(a.key));
  n.startsWith("(") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(o, (a) => {
    l.every((u) => e.app.eventModifiers[u.key](a, i, u.param)) && $(e.data, n, t, a), i.calledTimes++, i.lastCall = Date.now();
  });
}, re = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = t.parentElement, o = new Comment("x-if");
  r.insertBefore(o, t);
  const l = [{
    node: t,
    expr: n
  }];
  let i, a;
  for (; (i = t.nextElementSibling) !== null && ((a = E(i, "x-else")) !== null || (a = E(i, "x-else-if"))); )
    l.push({
      node: i,
      expr: a
    }), r.removeChild(i);
  r.removeChild(t);
  let u, p;
  function c() {
    p && (r.removeChild(p.node), p = null);
  }
  let d = !1;
  return e.effect(() => {
    for (let f = 0; f < l.length; f++) {
      const m = l[f];
      if (!m.expr || e.eval(m.expr, t)) {
        u !== f ? (p && c(), r.insertBefore(m.node, o), A(e, m.node), p = m, u = f) : d = !0;
        return;
      } else
        d = !0;
    }
    u = -1, c();
  }), d;
}, ne = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, ie = function(e, t, { name: s, value: n }) {
  var p;
  let r = t;
  const [o, l] = s.split("."), i = (p = r.attributes.getNamedItem("value")) == null ? void 0 : p.value, a = (c, d) => {
    if (!l)
      return c;
    const [f, m] = l.split("[");
    let b;
    if (m) {
      const g = m.replace("]", "");
      b = k(g, e);
    }
    return e.app.modelModifiers[f](c, d, b);
  }, u = () => {
    let c;
    const d = e.eval(n);
    d ? c = d : i && (c = i), Object.assign(e.data, { [s]: c }), r = r, r.value = c;
  };
  switch (r.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (r = r, r.type) {
        case "checkbox": {
          const c = Reflect.get(e.data, n), d = (f, m) => {
            W(c) ? c.includes(f) ? c.splice(c.indexOf(f), 1) : c.push(f) : Reflect.set(e.data, f, j(f) ? !m : f);
          };
          (!c || c.length === 0) && r.hasAttribute("checked") && (d(r.value, !0), r.removeAttribute("checked")), r.addEventListener("change", (f) => {
            const { checked: m, value: b } = f == null ? void 0 : f.target;
            d(b, m);
          }), e.effect(() => {
            r = r;
            const f = e.eval(n);
            f.includes(r.value) || r.value === f ? r.checked = !0 : r.checked = !1;
          });
          break;
        }
        case "radio": {
          r.hasAttribute("checked") && (r.removeAttribute("checked"), Object.assign(e.data, { [n]: r.value })), r.addEventListener("change", (c) => {
            const { checked: d, value: f } = c.target;
            d && Object.assign(e.data, { [f]: f });
          }), e.effect(() => {
            r = r;
            const c = e.eval(n);
            r.checked = r.value === c;
          });
          break;
        }
        default:
          u(), r.removeAttribute("x-model"), r.addEventListener("input", (c) => {
            const d = c.target, f = d.value, m = a(f, Reflect.get(e.data, n));
            f !== m && (d.value = String(m)), Object.assign(e.data, { [n]: m });
          }), e.effect(() => r.value = e.eval(n));
      }
      break;
    }
    case "SELECT": {
      r = r, u(), r.addEventListener("change", (c) => {
        const d = k(c.target.value, e);
        Object.assign(e.data, { [n]: d });
      }), e.effect(() => r.value = e.eval(n));
      break;
    }
    case "DETAILS": {
      r = r;
      const c = r.attributes.getNamedItem("open"), d = e.eval(n);
      r.open = j(d) ? c ?? !1 : d, r.addEventListener("toggle", (f) => {
        const m = f.target.open;
        Object.assign(e.data, { [n]: m });
      }), e.effect(() => r.open = e.eval(n));
      break;
    }
  }
}, oe = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [r, o, l] = s.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, a = t.cloneNode(!0);
  t.remove();
  const u = () => {
    const c = a.cloneNode(!0), d = new L(c, e.app);
    return d.extend(e), { newEl: c, newCtx: d };
  }, p = (c, d) => {
    i == null || i.appendChild(c), A(d);
  };
  e.effect(() => {
    const c = e.eval(l);
    if (G(i), typeof c == "number")
      for (const d in Array.from({ length: c })) {
        const { newEl: f, newCtx: m } = u();
        Object.assign(m.data, { [r]: Number(d) }), p(f, m);
      }
    else if (W(c)) {
      const [d, f] = r.replace("(", "").replace(")", "").split(","), m = d.trim(), b = f == null ? void 0 : f.trim();
      c.forEach((g, w) => {
        const { newEl: O, newCtx: v } = u();
        Object.assign(v.data, { [m]: g }), b && Object.assign(v.data, { [b]: Number(w) }), p(O, v);
      });
    } else if (N(c)) {
      const [d, f, m] = r.replace("(", "").replace(")", "").split(","), b = d.trim(), g = f == null ? void 0 : f.trim(), w = m == null ? void 0 : m.trim();
      Object.entries(c).forEach(([O, v], P) => {
        const { newEl: B, newCtx: y } = u();
        Object.assign(y.data, { [b]: v }), g && Object.assign(y.data, { [g]: O }), w && Object.assign(y.data, { [w]: Number(P) }), p(B, y);
      });
    }
  });
};
function _(e, t) {
  if (!t.textContent || t.textContent.trim().length === 0 || !t.textContent.includes(e.app.delimiters.start))
    return;
  const s = e.app.delimiters, n = t.textContent, r = new RegExp(`(?=${M(s.start)})(.*?)(?<=${M(s.end)})`, "g"), o = n.match(r);
  !o || o.length === 0 || e.effect(() => {
    let l = n;
    for (const i of o) {
      const a = i.replace(s.start, "").replace(s.end, "");
      if (!a)
        continue;
      const u = e.eval(a, t);
      l = l.replace(i, u);
    }
    t.textContent = l;
  });
}
const ae = function(e, t, { name: s, value: n }) {
  const r = t.cloneNode(!0), o = document.querySelector(n), [, l] = s.split(":");
  if (!o) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), l === "prepend" ? o.prepend(r) : l === "replace" ? o.replaceChildren(r) : o.append(r);
  const i = document.createTreeWalker(r);
  let a = i.root;
  for (; a; ) {
    if (a.nodeType === Node.ELEMENT_NODE) {
      const u = a;
      if (E(u, "x-skip") !== null) {
        a = i.nextSibling();
        continue;
      }
      if (V(e, u)) {
        a = i.nextSibling();
        continue;
      }
    } else
      a.nodeType === Node.TEXT_NODE && _(e, a);
    a = i.nextNode();
  }
};
function R() {
  throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
}
const S = function(e, t, { name: s, value: n }) {
  if (t.removeAttribute(s), s === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    n || (n = "{ }");
    const r = T({}, n);
    N(r) || R();
    for (const o of Object.keys(r))
      Object.defineProperty(e.data, o, {
        value: r[o],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch {
    console.warn("[x-scope/x-data] Error when processing attribute"), R();
  }
  return !1;
}, ce = function(e, t, { value: s }) {
  t.removeAttribute("x-switch");
  const n = [], r = Array.from(t.children).filter((i) => i.hasAttribute("x-case") || i.hasAttribute("x-default")).map((i) => {
    var a;
    return {
      isDefault: i.hasAttribute("x-default"),
      isCase: i.hasAttribute("x-case"),
      expr: ((a = i.attributes.getNamedItem("x-case")) == null ? void 0 : a.value) ?? null,
      node: i
    };
  }).map((i) => {
    const a = new Comment("x-switch");
    return t.insertBefore(a, i.node), n.push(a), i.node.removeAttribute("x-case"), i.node.removeAttribute("x-default"), i.node.remove(), i;
  });
  let o;
  function l() {
    o && (o.node.remove(), o = null);
  }
  e.effect(() => {
    const i = e.eval(s);
    let a;
    for (let u = 0; u < r.length; u++) {
      const p = r[u];
      if (u < r.length - 1 && p.isDefault && (a = [p, u]), p.expr) {
        if (k(p.expr, e) === i) {
          a = [p, u];
          break;
        }
      } else
        u === r.length - 1 && (a = [p, u]);
    }
    if (a) {
      l();
      const [u, p] = a, c = n[p];
      t.insertBefore(u.node, c), A(e, u.node), o = u;
      return;
    }
    l();
  });
}, le = function(e, t, { name: s, value: n }) {
  const [r, ...o] = s.split(":");
  let l = /* @__PURE__ */ Object.create(null);
  e.effect(() => {
    if (o.length > 0) {
      for (const i of o)
        if (Reflect.get(l, i) !== Reflect.get(e.data, i)) {
          e.eval(n, t);
          break;
        }
      l = { ...e.data };
    } else
      e.eval(n, t);
  });
}, I = (e, t, s) => {
  t.removeAttribute(s.name), e.eval(s.value, t);
};
async function A(e, t) {
  const s = t ?? e.root;
  let n = document.createTreeWalker(s), r = n.root;
  const o = s.querySelectorAll("[x-data]"), l = s.getAttributeNode("x-scope");
  l && S(e, s, l);
  for (const i of o)
    S(e, i, i.getAttributeNode("x-data"));
  for (; r; ) {
    switch (r.nodeType) {
      case Node.ELEMENT_NODE: {
        const i = r;
        if (E(i, "x-skip") !== null) {
          r = n.nextSibling();
          continue;
        }
        let a;
        (a = Array.from(i.attributes).find((p) => p.name.startsWith("x-portal"))) && ae(e, i, a);
        const u = H(r);
        if (V(e, i)) {
          const p = document.createTreeWalker(s);
          let c = p.root, d = 0;
          for (; c && d !== u; )
            c = p.nextNode(), d++;
          n = p, r = p.currentNode;
          continue;
        }
        break;
      }
      case Node.TEXT_NODE: {
        _(e, r);
        break;
      }
    }
    r = n.nextNode();
  }
}
function V(e, t) {
  for (const s of Array.from(t.attributes)) {
    if (s.name === "x-init") {
      I(e, t, s);
      continue;
    }
    if (s.name === "x-for")
      return oe(e, t, s), !0;
    if (s.name === "x-if") {
      if (re(e, t, s))
        return !0;
      continue;
    }
    if (s.name === "x-switch") {
      ce(e, t, s);
      continue;
    }
    if (s.name === "x-ref") {
      z(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-model")) {
      ie(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-bind") || s.name.startsWith(":")) {
      Z(e, t, s);
      continue;
    }
    if (s.name.startsWith("@") || s.name.startsWith("x-on")) {
      se(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-spy")) {
      le(e, t, s);
      continue;
    }
    if (s.name === "x-text") {
      J(e, t, s);
      continue;
    }
    if (s.name === "x-class") {
      ee(e, t, s);
      continue;
    }
    if (s.name === "x-html") {
      Y(e, t, s);
      continue;
    }
    if (s.name === "x-style") {
      U(e, t, s);
      continue;
    }
    if (s.name === "x-show") {
      Q(e, t, s);
      continue;
    }
    const n = Object.keys(e.app.customDirectives);
    if (n.length > 0)
      for (const r of n) {
        const o = e.app.customDirectives[r];
        s.name.startsWith(r) && o(e, t, s);
      }
    if (s.name === "x-processed") {
      I(e, t, s);
      continue;
    }
  }
}
const C = "is a reserved name or its already been defined. Please use a different name.";
class fe {
  constructor(t) {
    h(this, "modelModifiers");
    h(this, "eventModifiers");
    h(this, "customDirectives");
    h(this, "delimiters");
    h(this, "scopes");
    h(this, "rootState");
    h(this, "onInitCbs");
    h(this, "onTeardownCbs");
    this.modelModifiers = Object.assign({}, ne), this.eventModifiers = Object.assign({}, te), this.customDirectives = {}, this.delimiters = {
      start: "{{",
      end: "}}"
    }, this.scopes = [], this.rootState = x(Object.assign({}, t)), this.onInitCbs = [], this.onTeardownCbs = [];
  }
  /**
   * Define the way Beskydy will compile the delimiters {{ }} into a reactive part of a string.
   * Delimiters contain text, which usually contains an expression. Think of it was as javascript being executed within a string when it is wrapped in the delimiters {{ }}
   *
   *
   * @param start Starting delimiter
   * @param end Ending delimiter
   */
  setDelimiters(t, s) {
    this.delimiters.start = t, this.delimiters.end = s;
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(t, s) {
    if (t in this.customDirectives)
      throw new Error(`The directive "${t}" ${C}`);
    this.customDirectives[t] = s;
  }
  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineEventModifier(t, s) {
    if (t in this.eventModifiers)
      throw new Error(`The event modifier "${t}" ${C}`);
    this.eventModifiers[t] = s;
  }
  /**
   * Add a custom `x-model` modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineModelModifier(t, s) {
    if (t in this.modelModifiers)
      throw new Error(`The model modifier "${t}" ${C}`);
    this.modelModifiers[t] = s;
  }
  /**
   *  Initialize Beskydy. It starts by collecting all the scope elements
   *  and creating a context for each.
   *
   * @param selector Custom attribute selector. Defaults to 'x-scope'
   */
  collect(t = "[x-scope]") {
    const s = Array.from(document.querySelectorAll(t));
    s.length === 0 && console.warn(`No scopes were found for the selector "${t}". Make sure to define at least one.`);
    for (const n of s) {
      const r = new L(n, this, {});
      n.setAttribute("style", "display:none;"), A(r), r.init = !0, n.removeAttribute("style"), this.scopes.push(r);
    }
    for (const n of this.onInitCbs)
      n();
  }
  /**
   * Registers a function which runs when app is fully initialized
   */
  onInit(t) {
    this.onInitCbs.push(t);
  }
  /**
   * Registers a callback which runs after application has been shut down
   */
  onTeardown(t) {
    this.onTeardownCbs.push(t);
  }
  /**
   *   Stops Beskydy instance, removes reactivity and event listeners
   *   and leaves the DOM in the state it was when the app was torn down.
   */
  teardown() {
    for (const t of this.scopes)
      t.teardown();
    this.scopes.length = 0;
    for (const t of this.onTeardownCbs)
      t();
  }
}
const ue = new fe({
  selected: "people",
  loading: !1,
  data: [],
  fetchData() {
    this.loading = !0, fetch(`https://swapi.dev/api/${this.selected}`).then((e) => e.json()).then((e) => {
      this.loading = !1, this.data = e.results;
    });
  }
  // makeElement() {
  //   return document.createElement("table")
  // }
});
console.clear();
ue.collect();
export {
  fe as Beskydy
};
//# sourceMappingURL=beskydy.js.map
