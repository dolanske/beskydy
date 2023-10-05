var F = Object.defineProperty;
var K = (e, t, r) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var A = (e, t, r) => (K(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as L, effect as q } from "@vue/reactivity";
class S {
  constructor(t, r) {
    // Store the context root element
    A(this, "root");
    // Reactive dataset available to the entire scope
    A(this, "data");
    A(this, "init");
    // Watch effects
    // effect = rawEffect
    A(this, "effect", q);
    this.root = t, this.data = L(Object.assign({ $refs: {} }, P, r)), this.init = !1;
  }
  // Store refs for access within scope
  addRef(t, r) {
    Object.assign(this.data.$refs, { [t]: r });
  }
  // When creating sub contexts, this allows for a parent context to
  // share its reactive properties with the child context
  extend(t) {
    Object.assign(this.data, t.data);
  }
  teardown() {
  }
}
const v = {}, I = /* @__PURE__ */ Object.create(null);
function m(e, t, r) {
  return W(e, `return(${t})`, r);
}
function W(e, t, r, n) {
  JSON.stringify(e);
  const s = I[t] || (I[t] = H(t));
  try {
    return s(e, r, n);
  } catch (a) {
    console.error(a);
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
function O(e, t) {
  const r = e.attributes.getNamedItem(t);
  return r ? (e.removeAttribute(t), r.value ?? !0) : null;
}
function T(e) {
  return e == null;
}
function j(e) {
  return !!e && e.constructor === Object;
}
const D = Array.isArray;
function U(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function E(e, t) {
  return e in t.data ? m(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
const z = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), e.addRef(r, t), new MutationObserver(() => {
    e.addRef(r, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, G = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = n;
  e.effect(() => {
    t.textContent = m(e.data, s, t);
  });
}, J = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    const a = m(e.data, s, t);
    if (j(a))
      for (const l of Object.keys(a))
        Reflect.has(t, "style") && Reflect.set(t.style, l, a[l]);
  });
}, X = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  Reflect.has(t, "style") && e.effect(() => {
    m(e.data, s, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, Q = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    t.innerHTML = m(e.data, s, t);
  });
}, Y = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const [s, a] = r.split(":"), l = (i, o) => {
    T(o) ? t.removeAttribute(i) : t.setAttribute(i, o);
  };
  a ? e.effect(() => {
    const i = m(e.data, n, t);
    l(r, i);
  }) : e.effect(() => {
    const i = m(e.data, n, t) ?? {};
    for (const o of Object.keys(i)) {
      const u = i[o];
      l(o, u);
    }
  });
}, Z = function(e, t, { value: r }) {
  const n = (s) => {
    for (const a of Object.keys(s))
      s[a] ? t.classList.add(a) : t.classList.remove(a);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const a = m(e.data, r);
      for (let l = 0; l < a.length; l++) {
        const i = a[l];
        if (i)
          typeof i == "string" ? (t.classList.add(i), s[l] = i) : j(i) && n(i);
        else {
          const o = s[l];
          o && (t.classList.remove(o), s[l] = null);
        }
      }
    });
  } else if (r.startsWith("{") && r.endsWith("}"))
    e.effect(() => {
      const s = m(e.data, r, t);
      n(s);
    });
  else {
    let s;
    e.effect(() => {
      s && t.classList.remove(s), s = m(e.data, r, t), t.classList.add(s);
    });
  }
}, N = {
  throttle: (e, { lastCall: t }, r = 300) => typeof r != "number" ? !1 : Date.now() - t >= r,
  if: (e, t, r) => !!r,
  only: (e, { calledTimes: t }, r = 1) => typeof r != "number" ? !1 : t < r,
  once: (e, { calledTimes: t }) => t < 1,
  self: (e) => e.target === e.currentTarget,
  left: (e) => "button" in e && e.button === 0,
  middle: (e) => "button" in e && e.button === 1,
  right: (e) => "button" in e && e.button === 2,
  prevent: (e) => (e.preventDefault(), !0),
  stop: (e) => (e.stopPropagation(), !0),
  stopImmediate: (e) => (e.stopImmediatePropagation(), !0)
}, ee = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), a = s[0], l = s.slice(1).map((o) => {
    const [u, p] = o.split("[");
    let b;
    if (p) {
      const c = p.replace("]", "");
      b = E(c, e);
    }
    return { key: u, param: b };
  }).filter((o) => Object.keys(N).includes(o.key));
  n.startsWith("()") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(a, (o) => {
    l.every((u) => N[u.key](o, i, u.param)) && (W(e.data, n, t, o), i.calledTimes++, i.lastCall = Date.now());
  });
}, te = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, a = new Comment("x-if");
  s.insertBefore(a, t);
  const l = [{
    node: t,
    expr: n
  }];
  let i, o;
  for (; (i = t.nextElementSibling) !== null && ((o = O(i, "x-else")) !== null || (o = O(i, "x-else-if"))); )
    l.push({
      node: i,
      expr: o
    }), s.removeChild(i);
  s.removeChild(t);
  let u, p;
  function b() {
    p && (s.removeChild(p.node), p = null);
  }
  e.effect(() => {
    console.log(l);
    for (let c = 0; c < l.length; c++) {
      const f = l[c];
      if (!f.expr || m(e.data, f.expr, t)) {
        u !== c && (p && b(), s.insertBefore(f.node, a), console.log(f.node), C(e, f.node), p = f, u = c);
        return;
      }
    }
    u = -1, b();
  });
}, R = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, re = function(e, t, { name: r, value: n }) {
  var p, b;
  let s = t;
  const [a, l] = r.split("."), i = (p = s.attributes.getNamedItem("value")) == null ? void 0 : p.value, o = (c, f) => {
    if (!l)
      return c;
    const [d, h] = l.split("[");
    let g;
    if (h) {
      const y = h.replace("]", "");
      g = E(y, e);
    }
    return R[d](c, f, g);
  }, u = () => {
    let c;
    const f = m(e.data, n);
    f ? c = f : i && (c = i), Object.assign(e.data, { [r]: c }), s = s, s.value = c;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (b = s.attributes.getNamedItem("type")) == null ? void 0 : b.value) {
        case "checkbox": {
          const c = Reflect.get(e.data, n), f = (d, h) => {
            D(c) ? c.includes(d) ? c.splice(c.indexOf(d), 1) : c.push(d) : Reflect.set(e.data, d, T(d) ? !h : d);
          };
          (!c || c.length === 0) && s.hasAttribute("checked") && (f(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (d) => {
            const { checked: h, value: g } = d == null ? void 0 : d.target;
            f(g, h);
          }), e.effect(() => {
            s = s;
            const d = m(e.data, n);
            d.includes(s.value) || s.value === d ? s.checked = !0 : s.checked = !1;
          });
          break;
        }
        case "radio": {
          s.hasAttribute("checked") && (s.removeAttribute("checked"), Object.assign(e.data, { [n]: s.value })), s.addEventListener("change", (c) => {
            const { checked: f, value: d } = c.target;
            f && Object.assign(e.data, { [d]: d });
          }), e.effect(() => {
            s = s;
            const c = m(e.data, n);
            s.checked = s.value === c;
          });
          break;
        }
        default:
          u(), s.removeAttribute("x-model"), s.addEventListener("input", (c) => {
            const f = c.target, d = f.value, h = o(d, Reflect.get(e.data, n));
            d !== h && (f.value = String(h)), Object.assign(e.data, { [n]: h });
          }), e.effect(() => s.value = m(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, u(), s.addEventListener("change", (c) => {
        const f = E(c.target.value, e);
        Object.assign(e.data, { [n]: f });
      }), e.effect(() => s.value = m(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const c = s.attributes.getNamedItem("open"), f = m(e.data, n);
      s.open = T(f) ? c ?? !1 : f, s.addEventListener("toggle", (d) => {
        const h = d.target.open;
        Object.assign(e.data, { [n]: h });
      }), e.effect(() => s.open = m(e.data, n));
      break;
    }
  }
}, se = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, a, l] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, o = t.cloneNode(!0);
  t.remove();
  const u = () => {
    const b = o.cloneNode(!0), c = new S(b);
    return c.extend(e), { newEl: b, newCtx: c };
  }, p = (b, c) => {
    i == null || i.appendChild(b), C(c);
  };
  e.effect(() => {
    const b = m(e.data, l);
    if (typeof b == "number") {
      U(i);
      for (const c in Array.from({ length: b })) {
        const { newEl: f, newCtx: d } = u();
        Object.assign(d.data, { [s]: Number(c) }), p(f, d);
      }
    } else if (D(b)) {
      const [c, f] = s.replace("(", "").replace(")", "").split(","), d = c.trim(), h = f == null ? void 0 : f.trim();
      b.forEach((g, y) => {
        const { newEl: x, newCtx: w } = u();
        Object.assign(w.data, { [d]: g }), h && Object.assign(w.data, { [h]: Number(y) }), p(x, w);
      });
    } else if (j(b)) {
      const [c, f, d] = s.replace("(", "").replace(")", "").split(","), h = c.trim(), g = f == null ? void 0 : f.trim(), y = d == null ? void 0 : d.trim();
      Object.entries(b).forEach(([x, w], $) => {
        const { newEl: B, newCtx: k } = u();
        Object.assign(k.data, { [h]: w }), g && Object.assign(k.data, { [g]: x }), y && Object.assign(k.data, { [y]: Number($) }), p(B, k);
      });
    } else
      throw new TypeError("Unsupported value was used in 'x-for'. Please only use a number, array or an object");
  });
};
function M(e, t) {
  if (!t.textContent || t.textContent === "")
    return;
  const r = t.textContent, n = new RegExp("(?=\\{\\{)(.*?)(?<=\\}\\})", "g"), s = r.match(n);
  !s || s.length === 0 || e.effect(() => {
    let a = r;
    for (const l of s) {
      const i = l.replace("{{", "").replace("}}", "");
      if (!i)
        continue;
      const o = m(e.data, i, t);
      a = a.replace(l, o);
    }
    t.textContent = a;
  });
}
const ne = function(e, t, { name: r, value: n }) {
  const s = t.cloneNode(!0), a = document.querySelector(n), [, l] = r.split(":");
  if (!a) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), l === "prepend" ? a.prepend(s) : l === "replace" ? a.replaceChildren(s) : a.append(s);
  const i = document.createTreeWalker(s);
  let o = i.root;
  for (; o; ) {
    if (o.nodeType === 1) {
      const u = o;
      if (O(u, "x-skip") !== null) {
        o = i.nextSibling();
        continue;
      }
      V(e, u);
    } else
      o.nodeType === 3 && M(e, o);
    o = i.nextNode();
  }
}, ie = function(e, t, { name: r, value: n }) {
  if (t.removeAttribute(r), r === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    if (!n)
      return !0;
    const s = m({}, n);
    if (!j(s))
      return !0;
    for (const a of Object.keys(s))
      Object.defineProperty(e.data, a, {
        value: s[a],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch (s) {
    return console.warn("[x-scope/x-data] Error when processing attribute"), console.log(s), !0;
  }
  return !1;
}, ae = function(e, t, { value: r }) {
  t.removeAttribute("x-switch");
  const n = [], s = Array.from(t.children).filter((i) => i.hasAttribute("x-case") || i.hasAttribute("x-default")).map((i) => {
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
    const i = m(e.data, r);
    let o;
    for (let u = 0; u < s.length; u++) {
      const p = s[u];
      if (u < s.length - 1 && p.isDefault && (o = [p, u]), p.expr) {
        if (E(p.expr, e) === i) {
          o = [p, u];
          break;
        }
      } else
        u === s.length - 1 && (o = [p, u]);
    }
    if (o) {
      l();
      const [u, p] = o, b = n[p];
      t.insertBefore(u.node, b), C(e, u.node), a = u;
      return;
    }
    l();
  });
}, oe = function(e, t, { name: r, value: n }) {
  const [s, ...a] = r.split(":");
  let l = /* @__PURE__ */ Object.create(null);
  e.effect(() => {
    if (a.length > 0) {
      for (const i of a)
        if (Reflect.get(l, i) !== Reflect.get(e.data, i)) {
          m(e.data, n, t);
          break;
        }
      l = { ...e.data };
    } else
      m(e.data, n, t);
  });
};
function C(e, t) {
  const r = document.createTreeWalker(t ?? e.root);
  let n = r.root;
  for (; n; ) {
    if (n.nodeType === 1) {
      const s = n;
      if (O(s, "x-skip") !== null) {
        n = r.nextSibling();
        continue;
      }
      let a;
      (a = Array.from(s.attributes).find((l) => l.name.startsWith("x-portal"))) && ne(e, s, a), V(e, s);
    } else
      n.nodeType === 3 && M(e, n);
    n = r.nextNode();
  }
}
function V(e, t) {
  for (const r of Array.from(t.attributes)) {
    if ((r.name === "x-data" || r.name === "x-scope") && ie(e, t, r))
      throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
    r.name === "x-for" ? se(e, t, r) : r.name === "x-if" && te(e, t, r), r.name === "x-switch" && ae(e, t, r), r.name === "x-ref" && z(e, t, r), r.name.startsWith("x-model") && re(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && Y(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && ee(e, t, r), r.name.startsWith("x-spy") && oe(e, t, r), r.name === "x-text" && G(e, t, r), r.name === "x-class" && Z(e, t, r), r.name === "x-html" && Q(e, t, r), r.name === "x-style" && J(e, t, r), r.name === "x-show" && X(e, t, r), Object.keys(v).length > 0 && Object.entries(v).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const P = L({}), _ = [];
class ce {
  constructor(t) {
    Object.assign(P, t);
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  static defineDirective(t, r) {
    if (t in v)
      throw new Error(`Directive ${t} is already defined`);
    return v[t] = r, this;
  }
  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  static defineEventModifier(t, r) {
    if (t in N)
      throw new Error(`Event modifier ${t} is already defined`);
    return N[t] = r, this;
  }
  /**
   * Add a custom `x-model` modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  static defineModelModifier(t, r) {
    if (t in R)
      throw new Error(`Model modifier ${t} is already defined`);
    return R[t] = r, this;
  }
  /**
   * Initialize Beskydy. It starts by collecting all the scopes and initializing them
   */
  start() {
    const t = Array.from(document.querySelectorAll("[x-scope]"));
    for (const r of t)
      le(r);
  }
  // TODO
  // Remove everything
  teardown() {
    for (const t of _)
      t.teardown();
  }
}
function de(e) {
  return new ce(e ?? {});
}
function le(e) {
  const t = new S(e);
  return e.setAttribute("style", "display:none;"), C(t), t.init = !0, e.removeAttribute("style"), _.push(t), { ctx: t };
}
export {
  ce as Beskydy,
  de as createApp,
  le as createScope
};
