var B = Object.defineProperty;
var F = (e, t, r) => t in e ? B(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var A = (e, t, r) => (F(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as L, effect as K } from "@vue/reactivity";
class S {
  constructor(t, r) {
    // Store the context root element
    A(this, "root");
    // Reactive dataset available to the entire scope
    A(this, "data");
    A(this, "init");
    // Watch effects
    // effect = rawEffect
    A(this, "effect", K);
    this.root = t, this.data = L(Object.assign({ $refs: {} }, $, r)), this.init = !1;
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
}
const k = {}, I = /* @__PURE__ */ Object.create(null);
function b(e, t, r) {
  return W(e, `return(${t})`, r);
}
function W(e, t, r, n) {
  JSON.stringify(e);
  const s = I[t] || (I[t] = q(t));
  try {
    return s(e, r, n);
  } catch (c) {
    console.error(c);
  }
}
function q(e) {
  try {
    return new Function("data", "$el", "$event", `with(data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}
function E(e, t) {
  const r = e.attributes.getNamedItem(t);
  return r ? (e.removeAttribute(t), r.value ?? !0) : null;
}
function T(e) {
  return e == null;
}
function C(e) {
  return !!e && e.constructor === Object;
}
const D = Array.isArray;
function H(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function O(e, t) {
  return e in t.data ? b(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
const U = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), e.addRef(r, t), new MutationObserver(() => {
    e.addRef(r, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, z = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = n;
  e.effect(() => {
    t.textContent = b(e.data, s, t);
  });
}, G = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    const c = b(e.data, s, t);
    if (C(c))
      for (const l of Object.keys(c))
        Reflect.has(t, "style") && Reflect.set(t.style, l, c[l]);
  });
}, J = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  Reflect.has(t, "style") && e.effect(() => {
    b(e.data, s, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, X = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    t.innerHTML = b(e.data, s, t);
  });
}, Q = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const [s, c] = r.split(":"), l = (i, o) => {
    T(o) ? t.removeAttribute(i) : t.setAttribute(i, o);
  };
  c ? e.effect(() => {
    const i = b(e.data, n, t);
    l(r, i);
  }) : e.effect(() => {
    const i = b(e.data, n, t) ?? {};
    for (const o of Object.keys(i)) {
      const u = i[o];
      l(o, u);
    }
  });
}, Y = function(e, t, { value: r }) {
  const n = (s) => {
    for (const c of Object.keys(s))
      s[c] ? t.classList.add(c) : t.classList.remove(c);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const c = b(e.data, r);
      for (let l = 0; l < c.length; l++) {
        const i = c[l];
        if (i)
          typeof i == "string" ? (t.classList.add(i), s[l] = i) : C(i) && n(i);
        else {
          const o = s[l];
          o && (t.classList.remove(o), s[l] = null);
        }
      }
    });
  } else if (r.startsWith("{") && r.endsWith("}"))
    e.effect(() => {
      const s = b(e.data, r, t);
      n(s);
    });
  else {
    let s;
    e.effect(() => {
      s && t.classList.remove(s), s = b(e.data, r, t), t.classList.add(s);
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
}, Z = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), c = s[0], l = s.slice(1).map((o) => {
    const [u, m] = o.split("[");
    let p;
    if (m) {
      const a = m.replace("]", "");
      p = O(a, e);
    }
    return { key: u, param: p };
  }).filter((o) => Object.keys(N).includes(o.key));
  n.startsWith("()") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(c, (o) => {
    l.every((u) => N[u.key](o, i, u.param)) && (W(e.data, n, t, o), i.calledTimes++, i.lastCall = Date.now());
  });
}, ee = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, c = new Comment("x-if");
  s.insertBefore(c, t);
  const l = [{
    node: t,
    expr: n
  }];
  let i, o;
  for (; (i = t.nextElementSibling) !== null && ((o = E(i, "x-else")) !== null || (o = E(i, "x-else-if"))); )
    l.push({
      node: i,
      expr: o
    }), s.removeChild(i);
  s.removeChild(t);
  let u, m;
  function p() {
    m && (s.removeChild(m.node), m = null);
  }
  e.effect(() => {
    console.log(l);
    for (let a = 0; a < l.length; a++) {
      const f = l[a];
      if (!f.expr || b(e.data, f.expr, t)) {
        u !== a && (m && p(), s.insertBefore(f.node, c), console.log(f.node), j(e, f.node), m = f, u = a);
        return;
      }
    }
    u = -1, p();
  });
}, R = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, te = function(e, t, { name: r, value: n }) {
  var m, p;
  let s = t;
  const [c, l] = r.split("."), i = (m = s.attributes.getNamedItem("value")) == null ? void 0 : m.value, o = (a, f) => {
    if (!l)
      return a;
    const [d, h] = l.split("[");
    let g;
    if (h) {
      const y = h.replace("]", "");
      g = O(y, e);
    }
    return R[d](a, f, g);
  }, u = () => {
    let a;
    const f = b(e.data, n);
    f ? a = f : i && (a = i), Object.assign(e.data, { [r]: a }), s = s, s.value = a;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (p = s.attributes.getNamedItem("type")) == null ? void 0 : p.value) {
        case "checkbox": {
          const a = Reflect.get(e.data, n), f = (d, h) => {
            D(a) ? a.includes(d) ? a.splice(a.indexOf(d), 1) : a.push(d) : Reflect.set(e.data, d, T(d) ? !h : d);
          };
          (!a || a.length === 0) && s.hasAttribute("checked") && (f(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (d) => {
            const { checked: h, value: g } = d == null ? void 0 : d.target;
            f(g, h);
          }), e.effect(() => {
            s = s;
            const d = b(e.data, n);
            d.includes(s.value) || s.value === d ? s.checked = !0 : s.checked = !1;
          });
          break;
        }
        case "radio": {
          s.hasAttribute("checked") && (s.removeAttribute("checked"), Object.assign(e.data, { [n]: s.value })), s.addEventListener("change", (a) => {
            const { checked: f, value: d } = a.target;
            f && Object.assign(e.data, { [d]: d });
          }), e.effect(() => {
            s = s;
            const a = b(e.data, n);
            s.checked = s.value === a;
          });
          break;
        }
        default:
          u(), s.removeAttribute("x-model"), s.addEventListener("input", (a) => {
            const f = a.target, d = f.value, h = o(d, Reflect.get(e.data, n));
            d !== h && (f.value = String(h)), Object.assign(e.data, { [n]: h });
          }), e.effect(() => s.value = b(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, u(), s.addEventListener("change", (a) => {
        const f = O(a.target.value, e);
        Object.assign(e.data, { [n]: f });
      }), e.effect(() => s.value = b(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const a = s.attributes.getNamedItem("open"), f = b(e.data, n);
      s.open = T(f) ? a ?? !1 : f, s.addEventListener("toggle", (d) => {
        const h = d.target.open;
        Object.assign(e.data, { [n]: h });
      }), e.effect(() => s.open = b(e.data, n));
      break;
    }
  }
}, re = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, c, l] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, o = t.cloneNode(!0);
  t.remove();
  const u = () => {
    const p = o.cloneNode(!0), a = new S(p);
    return a.extend(e), { newEl: p, newCtx: a };
  }, m = (p, a) => {
    i == null || i.appendChild(p), j(a);
  };
  e.effect(() => {
    const p = b(e.data, l);
    if (typeof p == "number") {
      H(i);
      for (const a in Array.from({ length: p })) {
        const { newEl: f, newCtx: d } = u();
        Object.assign(d.data, { [s]: Number(a) }), m(f, d);
      }
    } else if (D(p)) {
      const [a, f] = s.replace("(", "").replace(")", "").split(","), d = a.trim(), h = f == null ? void 0 : f.trim();
      p.forEach((g, y) => {
        const { newEl: x, newCtx: w } = u();
        Object.assign(w.data, { [d]: g }), h && Object.assign(w.data, { [h]: Number(y) }), m(x, w);
      });
    } else if (C(p)) {
      const [a, f, d] = s.replace("(", "").replace(")", "").split(","), h = a.trim(), g = f == null ? void 0 : f.trim(), y = d == null ? void 0 : d.trim();
      Object.entries(p).forEach(([x, w], P) => {
        const { newEl: _, newCtx: v } = u();
        Object.assign(v.data, { [h]: w }), g && Object.assign(v.data, { [g]: x }), y && Object.assign(v.data, { [y]: Number(P) }), m(_, v);
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
    let c = r;
    for (const l of s) {
      const i = l.replace("{{", "").replace("}}", "");
      if (!i)
        continue;
      const o = b(e.data, i, t);
      c = c.replace(l, o);
    }
    t.textContent = c;
  });
}
const se = function(e, t, { name: r, value: n }) {
  const s = t.cloneNode(!0), c = document.querySelector(n), [, l] = r.split(":");
  if (!c) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), l === "prepend" ? c.prepend(s) : l === "replace" ? c.replaceChildren(s) : c.append(s);
  const i = document.createTreeWalker(s);
  let o = i.root;
  for (; o; ) {
    if (o.nodeType === 1) {
      const u = o;
      if (E(u, "x-skip") !== null) {
        o = i.nextSibling();
        continue;
      }
      V(e, u);
    } else
      o.nodeType === 3 && M(e, o);
    o = i.nextNode();
  }
}, ne = function(e, t, { name: r, value: n }) {
  if (t.removeAttribute(r), r === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    if (!n)
      return !0;
    const s = b({}, n);
    if (!C(s))
      return !0;
    for (const c of Object.keys(s))
      Object.defineProperty(e.data, c, {
        value: s[c],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch (s) {
    return console.warn("[x-scope/x-data] Error when processing attribute"), console.log(s), !0;
  }
  return !1;
}, ie = function(e, t, { value: r }) {
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
  let c;
  function l() {
    c && (c.node.remove(), c = null);
  }
  e.effect(() => {
    const i = b(e.data, r);
    let o;
    for (let u = 0; u < s.length; u++) {
      const m = s[u];
      if (u < s.length - 1 && m.isDefault && (o = [m, u]), m.expr) {
        if (O(m.expr, e) === i) {
          o = [m, u];
          break;
        }
      } else
        u === s.length - 1 && (o = [m, u]);
    }
    if (o) {
      l();
      const [u, m] = o, p = n[m];
      t.insertBefore(u.node, p), j(e, u.node), c = u;
      return;
    }
    l();
  });
};
function j(e, t) {
  const r = document.createTreeWalker(t ?? e.root);
  let n = r.root;
  for (; n; ) {
    if (n.nodeType === 1) {
      const s = n;
      if (E(s, "x-skip") !== null) {
        n = r.nextSibling();
        continue;
      }
      let c;
      (c = Array.from(s.attributes).find((l) => l.name.startsWith("x-portal"))) && se(e, s, c), V(e, s);
    } else
      n.nodeType === 3 && M(e, n);
    n = r.nextNode();
  }
}
function V(e, t) {
  for (const r of Array.from(t.attributes)) {
    if ((r.name === "x-data" || r.name === "x-scope") && ne(e, t, r))
      throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
    r.name === "x-for" ? re(e, t, r) : r.name === "x-if" && ee(e, t, r), r.name === "x-switch" && ie(e, t, r), r.name === "x-ref" && U(e, t, r), r.name.startsWith("x-model") && te(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && Q(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && Z(e, t, r), r.name === "x-text" && z(e, t, r), r.name === "x-class" && Y(e, t, r), r.name === "x-html" && X(e, t, r), r.name === "x-style" && G(e, t, r), r.name === "x-show" && J(e, t, r), Object.keys(k).length > 0 && Object.entries(k).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const $ = L({});
class oe {
  constructor(t) {
    Object.assign($, t);
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(t, r) {
    if (t in k)
      throw new Error(`Directive ${t} is already defined`);
    return k[t] = r, this;
  }
  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineEventModifier(t, r) {
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
  defineModelModifier(t, r) {
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
      ae(r);
  }
}
function fe(e) {
  return new oe(e ?? {});
}
function ae(e) {
  const t = new S(e);
  return e.setAttribute("style", "display:none;"), j(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  fe as Beskydy,
  ae as createScope
};
