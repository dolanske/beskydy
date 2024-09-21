var q = Object.defineProperty;
var K = (e, t, s) => t in e ? q(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var m = (e, t, s) => (K(e, typeof t != "symbol" ? t + "" : t, s), s);
import { reactive as L, effect as X } from "@vue/reactivity";
const S = /* @__PURE__ */ Object.create(null);
function A(e, t, s) {
  return W(e, `return(${t})`, s);
}
function W(e, t, s, n) {
  JSON.stringify(e);
  const r = S[t] || (S[t] = H(t));
  try {
    return r(e, s, n);
  } catch (o) {
    console.error(o);
  }
}
function H(e) {
  try {
    return new Function("data", "$el", "$event", `with(data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}
class _ {
  constructor(t, s, n) {
    // Store the context's root element
    m(this, "root");
    // Reactive dataset available to the entire scope
    m(this, "data");
    m(this, "init");
    // Hold all context runners for disposal
    m(this, "effects", []);
    // Stores a referene to the root app instance
    m(this, "app");
    this.root = t, this.data = L(Object.assign({ $refs: {} }, s.rootState, n)), this.init = !1, this.app = s;
  }
  /**
   * Executes the provided callback fn whenever the context's reactive
   * dataset updates
   *
   * @param fn Callback
   */
  effect(t) {
    const s = X(t);
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
    return A(this.data, t, s);
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
function k(e, t) {
  const s = e.attributes.getNamedItem(t);
  return s ? (e.removeAttribute(t), s.value ?? !0) : null;
}
function T(e) {
  return e == null;
}
function w(e) {
  return !!e && e.constructor === Object;
}
const V = Array.isArray;
function z(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function E(e, t) {
  return e in t.data ? A(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
function G(e) {
  let t = 0;
  for (; (e = e.previousSibling) != null; )
    t++;
  return t;
}
const U = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), e.addRef(s, t), new MutationObserver(() => {
    e.addRef(s, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
};
function D(e) {
  return e == null ? "" : w(e) ? JSON.stringify(e, null, 2) : String(e);
}
function P(e, t) {
  if (!t.textContent || t.textContent.trim().length === 0)
    return;
  const s = e.app.delimiters, n = t.textContent;
  e.effect(() => {
    if (n.includes(s.start)) {
      const r = [];
      let o = 0, c;
      for (; c = s.re.exec(n); ) {
        const i = n.slice(o, c.index);
        i && r.push(JSON.stringify(i)), r.push(D(`${c[1]}`)), o = c.index + c[0].length;
      }
      o < n.length && r.push(JSON.stringify(n.slice(o))), t.textContent = A(e.data, r.join("+"));
    } else
      t.textContent = D(n);
  });
}
const Y = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = n;
  e.effect(() => {
    t.textContent = D(e.eval(r, t));
  });
}, Q = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const o = e.eval(r, t);
    if (w(o))
      for (const c of Object.keys(o))
        Reflect.has(t, "style") && Reflect.set(t.style, c, o[c]);
  });
}, Z = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  Reflect.has(t, "style") && e.effect(() => {
    e.eval(r, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, ee = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const o = e.eval(r, t);
    o instanceof Element ? (t.replaceChildren(), t.append(o)) : t.innerHTML = o;
  });
}, te = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const [r, o] = s.split(":"), c = (i, l) => {
    T(l) || l === !1 ? t.removeAttribute(i) : t.setAttribute(i, l);
  };
  o ? e.effect(() => {
    const i = e.eval(n, t);
    c(o, i);
  }) : e.effect(() => {
    const i = e.eval(n, t) ?? {};
    for (const l of Object.keys(i)) {
      const d = i[l];
      c(l, d);
    }
  });
}, se = function(e, t, { value: s }) {
  const n = (r) => {
    for (const o of Object.keys(r))
      r[o] ? t.classList.add(o) : t.classList.remove(o);
  };
  if (s.startsWith("[")) {
    const r = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const o = e.eval(s);
      for (let c = 0; c < o.length; c++) {
        const i = o[c];
        if (i)
          typeof i == "string" ? (t.classList.add(i), r[c] = i) : w(i) && n(i);
        else {
          const l = r[c];
          l && (t.classList.remove(l), r[c] = null);
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
}, re = {
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
}, ne = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = (s.startsWith("x-on") ? s.split(":")[1] : s.substring(1)).split("."), o = r[0], c = r.slice(1).map((l) => {
    const [d, p] = l.split("[");
    let a;
    if (p) {
      const u = p.replace("]", "");
      a = E(u, e);
    }
    return { key: d, param: a };
  }).filter((l) => Object.keys(e.app.eventModifiers).includes(l.key));
  n.startsWith("(") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(o, (l) => {
    c.every((d) => e.app.eventModifiers[d.key](l, i, d.param)) && W(e.data, n, t, l), i.calledTimes++, i.lastCall = Date.now();
  });
}, ie = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = t.parentElement, o = new Comment("x-if");
  r.insertBefore(o, t);
  const c = [{
    node: t,
    expr: n
  }];
  let i, l;
  for (; (i = t.nextElementSibling) !== null && ((l = k(i, "x-else")) !== null || (l = k(i, "x-else-if"))); )
    c.push({
      node: i,
      expr: l
    }), r.removeChild(i);
  r.removeChild(t);
  let d, p;
  function a() {
    p && (r.removeChild(p.node), p = null);
  }
  let u = !1;
  return e.effect(() => {
    for (let f = 0; f < c.length; f++) {
      const h = c[f];
      if (!h.expr || e.eval(h.expr, t)) {
        d !== f ? (p && a(), r.insertBefore(h.node, o), O(e, h.node), p = h, d = f) : u = !0;
        return;
      } else
        u = !0;
    }
    d = -1, a();
  }), u;
}, oe = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, ae = function(e, t, { name: s, value: n }) {
  var p;
  let r = t;
  const [o, c] = s.split("."), i = (p = r.attributes.getNamedItem("value")) == null ? void 0 : p.value, l = (a, u) => {
    if (!c)
      return a;
    const [f, h] = c.split("[");
    let b;
    if (h) {
      const g = h.replace("]", "");
      b = E(g, e);
    }
    return e.app.modelModifiers[f](a, u, b);
  }, d = () => {
    let a;
    const u = e.eval(n);
    u ? a = u : i && (a = i), Object.assign(e.data, { [s]: a }), r = r, r.value = a;
  };
  switch (r.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (r = r, r.type) {
        case "checkbox": {
          const a = Reflect.get(e.data, n), u = (f, h) => {
            V(a) ? a.includes(f) ? a.splice(a.indexOf(f), 1) : a.push(f) : Reflect.set(e.data, f, T(f) ? !h : f);
          };
          (!a || a.length === 0) && r.hasAttribute("checked") && (u(r.value, !0), r.removeAttribute("checked")), r.addEventListener("change", (f) => {
            const { checked: h, value: b } = f == null ? void 0 : f.target;
            u(b, h);
          }), e.effect(() => {
            r = r;
            const f = e.eval(n);
            f.includes(r.value) || r.value === f ? r.checked = !0 : r.checked = !1;
          });
          break;
        }
        case "radio": {
          r.hasAttribute("checked") && (r.removeAttribute("checked"), Object.assign(e.data, { [n]: r.value })), r.addEventListener("change", (a) => {
            const { checked: u, value: f } = a.target;
            u && Object.assign(e.data, { [f]: f });
          }), e.effect(() => {
            r = r;
            const a = e.eval(n);
            r.checked = r.value === a;
          });
          break;
        }
        default:
          d(), r.removeAttribute("x-model"), r.addEventListener("input", (a) => {
            const u = a.target, f = u.value, h = l(f, Reflect.get(e.data, n));
            f !== h && (u.value = String(h)), Object.assign(e.data, { [n]: h });
          }), e.effect(() => r.value = e.eval(n));
      }
      break;
    }
    case "SELECT": {
      r = r, d(), r.addEventListener("change", (a) => {
        const u = E(a.target.value, e);
        Object.assign(e.data, { [n]: u });
      }), e.effect(() => r.value = e.eval(n));
      break;
    }
    case "DETAILS": {
      r = r;
      const a = r.attributes.getNamedItem("open"), u = e.eval(n);
      r.open = T(u) ? a ?? !1 : u, r.addEventListener("toggle", (f) => {
        const h = f.target.open;
        Object.assign(e.data, { [n]: h });
      }), e.effect(() => r.open = e.eval(n));
      break;
    }
  }
}, le = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [r, o, c] = s.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, l = t.cloneNode(!0);
  t.remove();
  const d = () => {
    const a = l.cloneNode(!0), u = new _(a, e.app);
    return u.extend(e), { newEl: a, newCtx: u };
  }, p = (a, u) => {
    i == null || i.appendChild(a), O(u);
  };
  e.effect(() => {
    const a = e.eval(c);
    if (z(i), typeof a == "number")
      for (const u in Array.from({ length: a })) {
        const { newEl: f, newCtx: h } = d();
        Object.assign(h.data, { [r]: Number(u) }), p(f, h);
      }
    else if (V(a)) {
      const [u, f] = r.replace("(", "").replace(")", "").split(","), h = u.trim(), b = f == null ? void 0 : f.trim();
      a.forEach((g, y) => {
        const { newEl: C, newCtx: v } = d();
        Object.assign(v.data, { [h]: g }), b && Object.assign(v.data, { [b]: Number(y) }), p(C, v);
      });
    } else if (w(a)) {
      const [u, f, h] = r.replace("(", "").replace(")", "").split(","), b = u.trim(), g = f == null ? void 0 : f.trim(), y = h == null ? void 0 : h.trim();
      Object.entries(a).forEach(([C, v], F) => {
        const { newEl: J, newCtx: N } = d();
        Object.assign(N.data, { [b]: v }), g && Object.assign(N.data, { [g]: C }), y && Object.assign(N.data, { [y]: Number(F) }), p(J, N);
      });
    }
  });
}, ce = function(e, t, { name: s, value: n }) {
  const r = t.cloneNode(!0), o = document.querySelector(n), [, c] = s.split(":");
  if (!o) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), c === "prepend" ? o.prepend(r) : c === "replace" ? o.replaceChildren(r) : o.append(r);
  const i = document.createTreeWalker(r);
  let l = i.root;
  for (; l; ) {
    if (l.nodeType === Node.ELEMENT_NODE) {
      const d = l;
      if (k(d, "x-skip") !== null) {
        l = i.nextSibling();
        continue;
      }
      if (B(e, d)) {
        l = i.nextSibling();
        continue;
      }
    } else
      l.nodeType === Node.TEXT_NODE && P(e, l);
    l = i.nextNode();
  }
};
function M() {
  throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
}
const R = function(e, t, { name: s, value: n }) {
  if (t.removeAttribute(s), s === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    n || (n = "{ }");
    const r = A({}, n);
    w(r) || M();
    for (const o of Object.keys(r))
      Object.defineProperty(e.data, o, {
        value: r[o],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch {
    console.warn("[x-scope/x-data] Error when processing attribute"), M();
  }
  return !1;
}, fe = function(e, t, { value: s }) {
  t.removeAttribute("x-switch");
  const n = [], r = Array.from(t.children).filter((i) => i.hasAttribute("x-case") || i.hasAttribute("x-default")).map((i) => {
    var l;
    return {
      isDefault: i.hasAttribute("x-default"),
      isCase: i.hasAttribute("x-case"),
      expr: ((l = i.attributes.getNamedItem("x-case")) == null ? void 0 : l.value) ?? null,
      node: i
    };
  }).map((i) => {
    const l = new Comment("x-switch");
    return t.insertBefore(l, i.node), n.push(l), i.node.removeAttribute("x-case"), i.node.removeAttribute("x-default"), i.node.remove(), i;
  });
  let o;
  function c() {
    o && (o.node.remove(), o = null);
  }
  e.effect(() => {
    const i = e.eval(s);
    let l;
    for (let d = 0; d < r.length; d++) {
      const p = r[d];
      if (d < r.length - 1 && p.isDefault && (l = [p, d]), p.expr) {
        if (E(p.expr, e) === i) {
          l = [p, d];
          break;
        }
      } else
        d === r.length - 1 && (l = [p, d]);
    }
    if (l) {
      c();
      const [d, p] = l, a = n[p];
      t.insertBefore(d.node, a), O(e, d.node), o = d;
      return;
    }
    c();
  });
}, ue = function(e, t, { name: s, value: n }) {
  const [r, ...o] = s.split(":");
  let c = /* @__PURE__ */ Object.create(null);
  e.effect(() => {
    if (o.length > 0) {
      for (const i of o)
        if (Reflect.get(c, i) !== Reflect.get(e.data, i)) {
          e.eval(n, t);
          break;
        }
      c = { ...e.data };
    } else
      e.eval(n, t);
  });
}, I = (e, t, s) => {
  t.removeAttribute(s.name), e.eval(s.value, t);
};
async function O(e, t) {
  const s = t ?? e.root;
  let n = document.createTreeWalker(s), r = n.root;
  const o = s.querySelectorAll("[x-data]"), c = s.getAttributeNode("x-scope");
  c && R(e, s, c);
  for (const i of o)
    R(e, i, i.getAttributeNode("x-data"));
  for (; r; ) {
    switch (r.nodeType) {
      case Node.ELEMENT_NODE: {
        const i = r;
        if (k(i, "x-skip") !== null) {
          r = n.nextSibling();
          continue;
        }
        let l;
        (l = Array.from(i.attributes).find((p) => p.name.startsWith("x-portal"))) && ce(e, i, l);
        const d = G(r);
        if (B(e, i)) {
          const p = document.createTreeWalker(s);
          let a = p.root, u = 0;
          for (; a && u !== d; )
            a = p.nextNode(), u++;
          n = p, r = p.currentNode;
          continue;
        }
        break;
      }
      case Node.TEXT_NODE: {
        P(e, r);
        break;
      }
    }
    r = n.nextNode();
  }
}
function B(e, t) {
  for (const s of Array.from(t.attributes)) {
    if (s.name === "x-init") {
      I(e, t, s);
      continue;
    }
    if (s.name === "x-for")
      return le(e, t, s), !0;
    if (s.name === "x-if") {
      if (ie(e, t, s))
        return !0;
      continue;
    }
    if (s.name === "x-switch") {
      fe(e, t, s);
      continue;
    }
    if (s.name === "x-ref") {
      U(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-model")) {
      ae(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-bind") || s.name.startsWith(":")) {
      te(e, t, s);
      continue;
    }
    if (s.name.startsWith("@") || s.name.startsWith("x-on")) {
      ne(e, t, s);
      continue;
    }
    if (s.name.startsWith("x-spy")) {
      ue(e, t, s);
      continue;
    }
    if (s.name === "x-text") {
      Y(e, t, s);
      continue;
    }
    if (s.name === "x-class") {
      se(e, t, s);
      continue;
    }
    if (s.name === "x-html") {
      ee(e, t, s);
      continue;
    }
    if (s.name === "x-style") {
      Q(e, t, s);
      continue;
    }
    if (s.name === "x-show") {
      Z(e, t, s);
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
const j = "is a reserved name or its already been defined. Please use a different name.";
function x(e) {
  return e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&");
}
function $(e, t) {
  return new RegExp(
    `${x(e)}([^]+?)${x(t)}`,
    "g"
  );
}
class de {
  constructor(t) {
    m(this, "modelModifiers");
    m(this, "eventModifiers");
    m(this, "customDirectives");
    m(this, "delimiters");
    m(this, "scopes");
    m(this, "rootState");
    m(this, "onInitCbs");
    m(this, "onTeardownCbs");
    this.modelModifiers = Object.assign({}, oe), this.eventModifiers = Object.assign({}, re), this.customDirectives = {}, this.delimiters = {
      start: "{{",
      end: "}}",
      re: $("{{", "}}")
    }, this.scopes = [], this.rootState = L(Object.assign({}, t)), this.onInitCbs = [], this.onTeardownCbs = [];
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
    (t === "{" || s === "}") && console.warn("You are using {} as delimiters, please keep in mind that you will not be able to use template literals inside of them."), this.delimiters = { start: t, end: s, re: $(t, s) };
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(t, s) {
    if (t in this.customDirectives)
      throw new Error(`The directive "${t}" ${j}`);
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
      throw new Error(`The event modifier "${t}" ${j}`);
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
      throw new Error(`The model modifier "${t}" ${j}`);
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
      const r = new _(n, this, {});
      n.setAttribute("style", "display:none;"), O(r), r.init = !0, n.removeAttribute("style"), this.scopes.push(r);
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
const pe = new de({
  selected: "people",
  loading: !1,
  data: [],
  fetchData() {
    this.loading = !0, fetch(`https://swapi.dev/api/${this.selected}`).then((e) => e.json()).then((e) => {
      this.data = e.results;
    }).finally(() => {
      this.loading = !1;
    });
  }
  // makeElement() {
  //   return document.createElement("table")
  // }
});
pe.collect();
export {
  de as Beskydy
};
//# sourceMappingURL=beskydy.js.map
