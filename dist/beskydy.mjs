var P = Object.defineProperty;
var _ = (e, t, r) => t in e ? P(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var v = (e, t, r) => (_(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as I, effect as B } from "@vue/reactivity";
class R {
  constructor(t, r) {
    // Store the context root element
    v(this, "root");
    // Reactive dataset available to the entire scope
    v(this, "data");
    v(this, "init");
    // Watch effects
    // effect = rawEffect
    v(this, "effect", B);
    this.root = t, this.data = I(Object.assign({ $refs: {} }, V, r)), this.init = !1;
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
const O = {}, L = /* @__PURE__ */ Object.create(null);
function d(e, t, r) {
  return W(e, `return(${t})`, r);
}
function W(e, t, r, n) {
  JSON.stringify(e);
  const s = L[t] || (L[t] = F(t));
  try {
    return s(e, r, n);
  } catch (l) {
    console.error(l);
  }
}
function F(e) {
  try {
    return new Function("data", "$el", "$event", `with(data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}
function C(e, t) {
  const r = e.getAttribute(t);
  return e.removeAttribute(t), r ? r.trim() : null;
}
function N(e) {
  return e == null;
}
function E(e) {
  return !!e && e.constructor === Object;
}
const x = Array.isArray;
function K(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function M(e, t) {
  return e in t.data ? d(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
const H = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), e.addRef(r, t), new MutationObserver(() => {
    e.addRef(r, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, U = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = n;
  e.effect(() => {
    t.textContent = d(e.data, s, t);
  });
}, q = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    const l = d(e.data, s, t);
    if (E(l))
      for (const f of Object.keys(l))
        Reflect.has(t, "style") && Reflect.set(t.style, f, l[f]);
  });
}, z = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  Reflect.has(t, "style") && e.effect(() => {
    d(e.data, s, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, G = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    t.innerHTML = d(e.data, s, t);
  });
}, J = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const [s, l] = r.split(":"), f = (a, u) => {
    N(u) ? t.removeAttribute(a) : t.setAttribute(a, u);
  };
  l ? e.effect(() => {
    const a = d(e.data, n, t);
    f(r, a);
  }) : e.effect(() => {
    const a = d(e.data, n, t) ?? {};
    for (const u of Object.keys(a)) {
      const p = a[u];
      f(u, p);
    }
  });
}, X = function(e, t, { value: r }) {
  const n = (s) => {
    for (const l of Object.keys(s))
      s[l] ? t.classList.add(l) : t.classList.remove(l);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const l = d(e.data, r);
      for (let f = 0; f < l.length; f++) {
        const a = l[f];
        if (a)
          typeof a == "string" ? (t.classList.add(a), s[f] = a) : E(a) && n(a);
        else {
          const u = s[f];
          u && (t.classList.remove(u), s[f] = null);
        }
      }
    });
  } else if (r.startsWith("{") && r.endsWith("}"))
    e.effect(() => {
      const s = d(e.data, r, t);
      n(s);
    });
  else {
    let s;
    e.effect(() => {
      s && t.classList.remove(s), s = d(e.data, r, t), t.classList.add(s);
    });
  }
}, k = {
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
}, Q = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), l = s[0], f = s.slice(1).map((u) => {
    const [p, h] = u.split("[");
    let m;
    if (h) {
      const i = h.replace("]", "");
      m = M(i, e);
    }
    return { key: p, param: m };
  }).filter((u) => Object.keys(k).includes(u.key));
  n.startsWith("()") && (n = `(${n})()`);
  const a = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(l, (u) => {
    f.every((p) => k[p.key](u, a, p.param)) && (W(e.data, n, t, u), a.calledTimes++, a.lastCall = Date.now());
  });
}, Y = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, l = new Comment("x-if");
  s.insertBefore(l, t);
  const f = [{
    node: t,
    expr: n
  }];
  let a, u;
  for (; (a = t.nextElementSibling) !== null && ((u = C(a, "x-else")) !== null || (u = C(a, "x-else-if"))); )
    f.push({
      node: a,
      expr: u
    }), s.removeChild(a);
  s.removeChild(t);
  let p, h;
  function m() {
    h && (s.removeChild(h.node), h = null);
  }
  e.effect(() => {
    for (let i = 0; i < f.length; i++) {
      const o = f[i];
      if (!o.expr || d(e.data, o.expr, t)) {
        p !== i && (h && m(), s.insertBefore(o.node, l), h = o, p = i);
        return;
      }
    }
    p = -1, m();
  });
}, T = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, Z = function(e, t, { name: r, value: n }) {
  var h, m;
  let s = t;
  const [l, f] = r.split("."), a = (h = s.attributes.getNamedItem("value")) == null ? void 0 : h.value, u = (i, o) => {
    if (!f)
      return i;
    const [c, b] = f.split("[");
    let g;
    if (b) {
      const y = b.replace("]", "");
      g = M(y, e);
    }
    return T[c](i, o, g);
  }, p = () => {
    let i;
    const o = d(e.data, n);
    o ? i = o : a && (i = a), Object.assign(e.data, { [r]: i }), s = s, s.value = i;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (m = s.attributes.getNamedItem("type")) == null ? void 0 : m.value) {
        case "checkbox": {
          const i = Reflect.get(e.data, n), o = (c, b) => {
            x(i) ? i.includes(c) ? i.splice(i.indexOf(c), 1) : i.push(c) : Reflect.set(e.data, c, N(c) ? !b : c);
          };
          (!i || i.length === 0) && s.hasAttribute("checked") && (o(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (c) => {
            const { checked: b, value: g } = c == null ? void 0 : c.target;
            o(g, b);
          }), e.effect(() => {
            s = s;
            const c = d(e.data, n);
            c.includes(s.value) || s.value === c ? s.checked = !0 : s.checked = !1;
          });
          break;
        }
        case "radio": {
          s.hasAttribute("checked") && (s.removeAttribute("checked"), Object.assign(e.data, { [n]: s.value })), s.addEventListener("change", (i) => {
            const { checked: o, value: c } = i.target;
            o && Object.assign(e.data, { [c]: c });
          }), e.effect(() => {
            s = s;
            const i = d(e.data, n);
            s.checked = s.value === i;
          });
          break;
        }
        default:
          p(), s.removeAttribute("x-model"), s.addEventListener("input", (i) => {
            const o = i.target, c = o.value, b = u(c, Reflect.get(e.data, n));
            c !== b && (o.value = String(b)), Object.assign(e.data, { [n]: b });
          }), e.effect(() => s.value = d(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, p(), s.addEventListener("change", (i) => {
        const o = i.target.value;
        Object.assign(e.data, { [o]: o });
      }), e.effect(() => s.value = d(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const i = s.attributes.getNamedItem("open"), o = d(e.data, n);
      s.open = N(o) ? i ?? !1 : o, s.addEventListener("toggle", (c) => {
        const b = c.target.open;
        Object.assign(e.data, { [n]: b });
      }), e.effect(() => s.open = d(e.data, n));
      break;
    }
  }
}, ee = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, l, f] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), a = t.parentElement, u = t.cloneNode(!0);
  t.remove();
  const p = () => {
    const m = u.cloneNode(!0), i = new R(m);
    return i.extend(e), { newEl: m, newCtx: i };
  }, h = (m, i) => {
    a == null || a.appendChild(m), S(i);
  };
  e.effect(() => {
    const m = d(e.data, f);
    if (typeof m == "number") {
      K(a);
      for (const i in Array.from({ length: m })) {
        const { newEl: o, newCtx: c } = p();
        Object.assign(c.data, { [s]: Number(i) }), h(o, c);
      }
    } else if (x(m)) {
      const [i, o] = s.replace("(", "").replace(")", "").split(","), c = i.trim(), b = o == null ? void 0 : o.trim();
      m.forEach((g, y) => {
        const { newEl: j, newCtx: w } = p();
        Object.assign(w.data, { [c]: g }), b && Object.assign(w.data, { [b]: Number(y) }), h(j, w);
      });
    } else if (E(m)) {
      const [i, o, c] = s.replace("(", "").replace(")", "").split(","), b = i.trim(), g = o == null ? void 0 : o.trim(), y = c == null ? void 0 : c.trim();
      Object.entries(m).forEach(([j, w], $) => {
        const { newEl: D, newCtx: A } = p();
        Object.assign(A.data, { [b]: w }), g && Object.assign(A.data, { [g]: j }), y && Object.assign(A.data, { [y]: Number($) }), h(D, A);
      });
    } else
      throw new TypeError("Unsupported value was used in 'x-for'. Please only use a number, array or an object");
  });
};
function S(e) {
  const t = document.createTreeWalker(e.root);
  let r = t.root;
  for (; r; ) {
    if (r.nodeType === 1) {
      const n = r;
      if (C(n, "x-skip") !== null) {
        r = t.nextSibling();
        continue;
      }
      te(e, n);
    } else
      r.nodeType === 3 && re(e, r);
    r = t.nextNode();
  }
}
function te(e, t) {
  for (const r of Array.from(t.attributes)) {
    if (r.name === "x-data" || r.name === "x-scope") {
      if (t.removeAttribute(r.name), r.name === "x-scope" && e.root !== t) {
        console.warn("Can not initialize a new scope within an existing scope");
        return;
      }
      try {
        if (!r.value)
          return;
        const n = d({}, r.value);
        if (!E(n))
          return;
        for (const s of Object.keys(n))
          Object.defineProperty(e.data, s, {
            value: n[s],
            writable: !0,
            enumerable: !0,
            configurable: !0
          });
      } catch (n) {
        console.warn("[x-scope/x-data] Error when processing attribute"), console.log(n);
      }
    }
    r.name === "x-for" ? ee(e, t, r) : r.name === "x-if" && Y(e, t, r), r.name === "x-ref" && H(e, t, r), r.name.startsWith("x-model") && Z(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && J(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && Q(e, t, r), r.name === "x-text" && U(e, t, r), r.name === "x-class" && X(e, t, r), r.name === "x-html" && G(e, t, r), r.name === "x-style" && q(e, t, r), r.name === "x-show" && z(e, t, r), Object.keys(O).length > 0 && Object.entries(O).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
function re(e, t) {
  if (!t.textContent || t.textContent === "")
    return;
  const r = t.textContent, n = new RegExp("(?=\\{\\{)(.*?)(?<=\\}\\})", "g"), s = r.match(n);
  !s || s.length === 0 || e.effect(() => {
    let l = r;
    for (const f of s) {
      const a = f.replace("{{", "").replace("}}", "");
      if (!a)
        continue;
      const u = d(e.data, a, t);
      l = l.replace(f, u);
    }
    t.textContent = l;
  });
}
const V = I({});
class se {
  constructor(t) {
    Object.assign(V, t);
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(t, r) {
    if (t in O)
      throw new Error(`Directive ${t} is already defined`);
    return O[t] = r, this;
  }
  /**
   * Add a custom `x-on` event modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineEventModifier(t, r) {
    if (t in k)
      throw new Error(`Event modifier ${t} is already defined`);
    return k[t] = r, this;
  }
  /**
   * Add a custom `x-model` modifier
   *
   * @param name Modifier name
   * @param fn Modifier implementation
   */
  defineModelModifier(t, r) {
    if (t in T)
      throw new Error(`Model modifier ${t} is already defined`);
    return T[t] = r, this;
  }
  /**
   * Initialize Beskydy. It starts by collecting all the scopes and initializing them
   */
  init() {
    const t = Array.from(document.querySelectorAll("[x-scope]"));
    for (const r of t)
      ne(r);
  }
}
function oe(e) {
  return new se(e ?? {});
}
function ne(e) {
  const t = new R(e);
  return e.setAttribute("style", "display:none;"), S(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  oe as createApp,
  ne as createScope
};
