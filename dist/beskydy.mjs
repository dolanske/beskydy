var F = Object.defineProperty;
var q = (e, t, s) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var h = (e, t, s) => (q(e, typeof t != "symbol" ? t + "" : t, s), s);
import { reactive as $, effect as K } from "@vue/reactivity";
const D = /* @__PURE__ */ Object.create(null);
function T(e, t, s) {
  return L(e, `return(${t})`, s);
}
function L(e, t, s, n) {
  JSON.stringify(e);
  const r = D[t] || (D[t] = X(t));
  try {
    return r(e, s, n);
  } catch (a) {
    console.error(a);
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
class x {
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
    this.root = t, this.data = $(Object.assign({ $refs: {} }, s.rootState, n)), this.init = !1, this.app = s;
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
   * @returns 
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
function A(e) {
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
const H = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), e.addRef(s, t), new MutationObserver(() => {
    e.addRef(s, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, z = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = n;
  e.effect(() => {
    t.textContent = e.eval(r, t);
  });
}, J = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const a = e.eval(r, t);
    if (A(a))
      for (const l of Object.keys(a))
        Reflect.has(t, "style") && Reflect.set(t.style, l, a[l]);
  });
}, U = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  Reflect.has(t, "style") && e.effect(() => {
    e.eval(r, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, Q = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    t.innerHTML = e.eval(r, t);
  });
}, Y = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const [r, a] = s.split(":"), l = (i, o) => {
    j(o) || o === !1 ? t.removeAttribute(i) : t.setAttribute(i, o);
  };
  a ? e.effect(() => {
    const i = e.eval(n, t);
    l(a, i);
  }) : e.effect(() => {
    const i = e.eval(n, t) ?? {};
    for (const o of Object.keys(i)) {
      const u = i[o];
      l(o, u);
    }
  });
}, Z = function(e, t, { value: s }) {
  const n = (r) => {
    for (const a of Object.keys(r))
      r[a] ? t.classList.add(a) : t.classList.remove(a);
  };
  if (s.startsWith("[")) {
    const r = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const a = e.eval(s);
      for (let l = 0; l < a.length; l++) {
        const i = a[l];
        if (i)
          typeof i == "string" ? (t.classList.add(i), r[l] = i) : A(i) && n(i);
        else {
          const o = r[l];
          o && (t.classList.remove(o), r[l] = null);
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
}, ee = {
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
}, te = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = (s.startsWith("x-on") ? s.split(":")[1] : s.substring(1)).split("."), a = r[0], l = r.slice(1).map((o) => {
    const [u, m] = o.split("[");
    let c;
    if (m) {
      const d = m.replace("]", "");
      c = k(d, e);
    }
    return { key: u, param: c };
  }).filter((o) => Object.keys(e.app.eventModifiers).includes(o.key));
  n.startsWith("(") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(a, (o) => {
    l.every((u) => e.app.eventModifiers[u.key](o, i, u.param)) && L(e.data, n, t, o), i.calledTimes++, i.lastCall = Date.now();
  });
}, se = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = t.parentElement, a = new Comment("x-if");
  r.insertBefore(a, t);
  const l = [{
    node: t,
    expr: n
  }];
  let i, o;
  for (; (i = t.nextElementSibling) !== null && ((o = E(i, "x-else")) !== null || (o = E(i, "x-else-if"))); )
    l.push({
      node: i,
      expr: o
    }), r.removeChild(i);
  let u, m;
  function c() {
    m && (r.removeChild(m.node), m = null);
  }
  let d = !1;
  return e.effect(() => {
    for (let f = 0; f < l.length; f++) {
      const p = l[f];
      if (!p.expr || e.eval(p.expr, t)) {
        u !== f ? (m && c(), r.insertBefore(p.node, a), N(e, p.node), m = p, u = f) : d = !0;
        return;
      } else
        d = !0;
    }
    u = -1, c();
  }), requestAnimationFrame(() => {
    r.removeChild(t);
  }), d;
}, re = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, ne = function(e, t, { name: s, value: n }) {
  var m;
  let r = t;
  const [a, l] = s.split("."), i = (m = r.attributes.getNamedItem("value")) == null ? void 0 : m.value, o = (c, d) => {
    if (!l)
      return c;
    const [f, p] = l.split("[");
    let b;
    if (p) {
      const g = p.replace("]", "");
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
          const c = Reflect.get(e.data, n), d = (f, p) => {
            W(c) ? c.includes(f) ? c.splice(c.indexOf(f), 1) : c.push(f) : Reflect.set(e.data, f, j(f) ? !p : f);
          };
          (!c || c.length === 0) && r.hasAttribute("checked") && (d(r.value, !0), r.removeAttribute("checked")), r.addEventListener("change", (f) => {
            const { checked: p, value: b } = f == null ? void 0 : f.target;
            d(b, p);
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
            const d = c.target, f = d.value, p = o(f, Reflect.get(e.data, n));
            f !== p && (d.value = String(p)), Object.assign(e.data, { [n]: p });
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
        const p = f.target.open;
        Object.assign(e.data, { [n]: p });
      }), e.effect(() => r.open = e.eval(n));
      break;
    }
  }
}, ie = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [r, a, l] = s.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, o = t.cloneNode(!0);
  t.remove();
  const u = () => {
    const c = o.cloneNode(!0), d = new x(c, e.app);
    return d.extend(e), { newEl: c, newCtx: d };
  }, m = (c, d) => {
    i == null || i.appendChild(c), N(d);
  };
  e.effect(() => {
    const c = e.eval(l);
    if (G(i), typeof c == "number")
      for (const d in Array.from({ length: c })) {
        const { newEl: f, newCtx: p } = u();
        Object.assign(p.data, { [r]: Number(d) }), m(f, p);
      }
    else if (W(c)) {
      const [d, f] = r.replace("(", "").replace(")", "").split(","), p = d.trim(), b = f == null ? void 0 : f.trim();
      c.forEach((g, w) => {
        const { newEl: O, newCtx: v } = u();
        Object.assign(v.data, { [p]: g }), b && Object.assign(v.data, { [b]: Number(w) }), m(O, v);
      });
    } else if (A(c)) {
      const [d, f, p] = r.replace("(", "").replace(")", "").split(","), b = d.trim(), g = f == null ? void 0 : f.trim(), w = p == null ? void 0 : p.trim();
      Object.entries(c).forEach(([O, v], P) => {
        const { newEl: B, newCtx: y } = u();
        Object.assign(y.data, { [b]: v }), g && Object.assign(y.data, { [g]: O }), w && Object.assign(y.data, { [w]: Number(P) }), m(B, y);
      });
    }
  });
};
function _(e, t) {
  if (!t.textContent || t.textContent.trim().length === 0 || !t.textContent.includes(e.app.delimiters.start))
    return;
  const s = e.app.delimiters, n = t.textContent, r = new RegExp(`(?=${M(s.start)})(.*?)(?<=${M(s.end)})`, "g"), a = n.match(r);
  !a || a.length === 0 || e.effect(() => {
    let l = n;
    for (const i of a) {
      const o = i.replace(s.start, "").replace(s.end, "");
      if (!o)
        continue;
      const u = e.eval(o, t);
      l = l.replace(i, u);
    }
    t.textContent = l;
  });
}
const oe = function(e, t, { name: s, value: n }) {
  const r = t.cloneNode(!0), a = document.querySelector(n), [, l] = s.split(":");
  if (!a) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), l === "prepend" ? a.prepend(r) : l === "replace" ? a.replaceChildren(r) : a.append(r);
  const i = document.createTreeWalker(r);
  let o = i.root;
  for (; o; ) {
    if (o.nodeType === Node.ELEMENT_NODE) {
      const u = o;
      if (E(u, "x-skip") !== null) {
        o = i.nextSibling();
        continue;
      }
      if (V(e, u)) {
        o = i.nextSibling();
        continue;
      }
    } else
      o.nodeType === Node.TEXT_NODE && _(e, o);
    o = i.nextNode();
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
    A(r) || R();
    for (const a of Object.keys(r))
      Object.defineProperty(e.data, a, {
        value: r[a],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch (r) {
    console.warn("[x-scope/x-data] Error when processing attribute"), console.log(r), R();
  }
  return !1;
}, ae = function(e, t, { value: s }) {
  t.removeAttribute("x-switch");
  const n = [], r = Array.from(t.children).filter((i) => i.hasAttribute("x-case") || i.hasAttribute("x-default")).map((i) => {
    var o;
    return {
      isDefault: i.hasAttribute("x-default"),
      isCase: i.hasAttribute("x-case"),
      expr: ((o = i.attributes.getNamedItem("x-case")) == null ? void 0 : o.value) ?? null,
      node: i
    };
  }).map((i) => {
    const o = new Comment("x-switch");
    return t.insertBefore(o, i.node), n.push(o), i.node.removeAttribute("x-case"), i.node.removeAttribute("x-default"), i.node.remove(), i;
  });
  let a;
  function l() {
    a && (a.node.remove(), a = null);
  }
  e.effect(() => {
    const i = e.eval(s);
    let o;
    for (let u = 0; u < r.length; u++) {
      const m = r[u];
      if (u < r.length - 1 && m.isDefault && (o = [m, u]), m.expr) {
        if (k(m.expr, e) === i) {
          o = [m, u];
          break;
        }
      } else
        u === r.length - 1 && (o = [m, u]);
    }
    if (o) {
      l();
      const [u, m] = o, c = n[m];
      t.insertBefore(u.node, c), N(e, u.node), a = u;
      return;
    }
    l();
  });
}, ce = function(e, t, { name: s, value: n }) {
  const [r, ...a] = s.split(":");
  let l = /* @__PURE__ */ Object.create(null);
  e.effect(() => {
    if (a.length > 0) {
      for (const i of a)
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
function N(e, t) {
  const s = t ?? e.root, n = document.createTreeWalker(s);
  let r = n.root;
  const a = s.querySelectorAll("[x-data]"), l = s.getAttributeNode("x-scope");
  l && S(e, s, l);
  for (const i of a)
    S(e, i, i.getAttributeNode("x-data"));
  for (; r; ) {
    switch (r.nodeType) {
      case Node.ELEMENT_NODE: {
        const i = r;
        if (E(i, "x-skip") !== null) {
          r = n.nextSibling();
          continue;
        }
        let o;
        if ((o = Array.from(i.attributes).find((u) => u.name.startsWith("x-portal"))) && oe(e, i, o), V(e, i)) {
          r = n.nextSibling();
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
      return ie(e, t, s), !0;
    if (s.name === "x-if") {
      if (se(e, t, s))
        return !0;
      continue;
    }
    if (s.name === "x-switch") {
      ae(e, t, s);
      continue;
    }
    if (s.name === "x-ref") {
      H(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-model")) {
      ne(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-bind") || s.name.startsWith(":")) {
      Y(e, t, s);
      continue;
    }
    if (s.name.startsWith("@") || s.name.startsWith("x-on")) {
      te(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-spy")) {
      ce(e, t, s);
      continue;
    }
    if (s.name === "x-text") {
      z(e, t, s);
      continue;
    }
    if (s.name === "x-class") {
      Z(e, t, s);
      continue;
    }
    if (s.name === "x-html") {
      Q(e, t, s);
      continue;
    }
    if (s.name === "x-style") {
      J(e, t, s);
      continue;
    }
    if (s.name === "x-show") {
      U(e, t, s);
      continue;
    }
    const n = Object.keys(e.app.customDirectives);
    if (n.length > 0)
      for (const r of n) {
        const a = e.app.customDirectives[r];
        s.name.startsWith(r) && a(e, t, s);
      }
    if (s.name === "x-processed") {
      I(e, t, s);
      continue;
    }
  }
}
const C = "is a reserved name or its already been defined. Please use a different name.";
class le {
  constructor(t) {
    h(this, "modelModifiers");
    h(this, "eventModifiers");
    h(this, "customDirectives");
    h(this, "delimiters");
    h(this, "scopes");
    h(this, "rootState");
    h(this, "onInitCbs");
    h(this, "onTeardownCbs");
    this.modelModifiers = Object.assign({}, re), this.eventModifiers = Object.assign({}, ee), this.customDirectives = {}, this.delimiters = {
      start: "{{",
      end: "}}"
    }, this.scopes = [], this.rootState = $(Object.assign({}, t)), this.onInitCbs = [], this.onTeardownCbs = [];
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
      const r = new x(n, this, {});
      n.setAttribute("style", "display:none;"), N(r), r.init = !0, n.removeAttribute("style"), this.scopes.push(r);
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
const fe = new le({
  selected: "people",
  loading: !1,
  data: [],
  fetchData() {
    this.loading = !0, fetch(`https://swapi.dev/api/${this.selected}`).then((e) => e.json()).then((e) => {
      this.loading = !1, this.data = e.results;
    });
  }
});
fe.collect();
export {
  le as Beskydy
};
