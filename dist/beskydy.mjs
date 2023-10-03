var B = Object.defineProperty;
var F = (e, t, r) => t in e ? B(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var v = (e, t, r) => (F(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as x, effect as K } from "@vue/reactivity";
class I {
  constructor(t, r) {
    // Store the context root element
    v(this, "root");
    // Reactive dataset available to the entire scope
    v(this, "data");
    v(this, "init");
    // Watch effects
    // effect = rawEffect
    v(this, "effect", K);
    this.root = t, this.data = x(Object.assign({ $refs: {} }, P, r)), this.init = !1;
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
  return R(e, `return(${t})`, r);
}
function R(e, t, r, n) {
  JSON.stringify(e);
  const s = L[t] || (L[t] = q(t));
  try {
    return s(e, r, n);
  } catch (f) {
    console.error(f);
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
function k(e, t) {
  const r = e.getAttribute(t);
  return e.removeAttribute(t), r ? r.trim() : null;
}
function C(e) {
  return e == null;
}
function N(e) {
  return !!e && e.constructor === Object;
}
const S = Array.isArray;
function H(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function W(e, t) {
  return e in t.data ? d(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
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
    t.textContent = d(e.data, s, t);
  });
}, G = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    const f = d(e.data, s, t);
    if (N(f))
      for (const o of Object.keys(f))
        Reflect.has(t, "style") && Reflect.set(t.style, o, f[o]);
  });
}, J = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  Reflect.has(t, "style") && e.effect(() => {
    d(e.data, s, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, X = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    t.innerHTML = d(e.data, s, t);
  });
}, Q = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const [s, f] = r.split(":"), o = (a, u) => {
    C(u) ? t.removeAttribute(a) : t.setAttribute(a, u);
  };
  f ? e.effect(() => {
    const a = d(e.data, n, t);
    o(r, a);
  }) : e.effect(() => {
    const a = d(e.data, n, t) ?? {};
    for (const u of Object.keys(a)) {
      const p = a[u];
      o(u, p);
    }
  });
}, Y = function(e, t, { value: r }) {
  const n = (s) => {
    for (const f of Object.keys(s))
      s[f] ? t.classList.add(f) : t.classList.remove(f);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const f = d(e.data, r);
      for (let o = 0; o < f.length; o++) {
        const a = f[o];
        if (a)
          typeof a == "string" ? (t.classList.add(a), s[o] = a) : N(a) && n(a);
        else {
          const u = s[o];
          u && (t.classList.remove(u), s[o] = null);
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
}, E = {
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
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), f = s[0], o = s.slice(1).map((u) => {
    const [p, h] = u.split("[");
    let m;
    if (h) {
      const i = h.replace("]", "");
      m = W(i, e);
    }
    return { key: p, param: m };
  }).filter((u) => Object.keys(E).includes(u.key));
  n.startsWith("()") && (n = `(${n})()`);
  const a = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(f, (u) => {
    o.every((p) => E[p.key](u, a, p.param)) && (R(e.data, n, t, u), a.calledTimes++, a.lastCall = Date.now());
  });
}, ee = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, f = new Comment("x-if");
  s.insertBefore(f, t);
  const o = [{
    node: t,
    expr: n
  }];
  let a, u;
  for (; (a = t.nextElementSibling) !== null && ((u = k(a, "x-else")) !== null || (u = k(a, "x-else-if"))); )
    o.push({
      node: a,
      expr: u
    }), s.removeChild(a);
  s.removeChild(t);
  let p, h;
  function m() {
    h && (s.removeChild(h.node), h = null);
  }
  e.effect(() => {
    for (let i = 0; i < o.length; i++) {
      const c = o[i];
      if (!c.expr || d(e.data, c.expr, t)) {
        p !== i && (h && m(), s.insertBefore(c.node, f), h = c, p = i);
        return;
      }
    }
    p = -1, m();
  });
}, T = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, te = function(e, t, { name: r, value: n }) {
  var h, m;
  let s = t;
  const [f, o] = r.split("."), a = (h = s.attributes.getNamedItem("value")) == null ? void 0 : h.value, u = (i, c) => {
    if (!o)
      return i;
    const [l, b] = o.split("[");
    let g;
    if (b) {
      const y = b.replace("]", "");
      g = W(y, e);
    }
    return T[l](i, c, g);
  }, p = () => {
    let i;
    const c = d(e.data, n);
    c ? i = c : a && (i = a), Object.assign(e.data, { [r]: i }), s = s, s.value = i;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (m = s.attributes.getNamedItem("type")) == null ? void 0 : m.value) {
        case "checkbox": {
          const i = Reflect.get(e.data, n), c = (l, b) => {
            S(i) ? i.includes(l) ? i.splice(i.indexOf(l), 1) : i.push(l) : Reflect.set(e.data, l, C(l) ? !b : l);
          };
          (!i || i.length === 0) && s.hasAttribute("checked") && (c(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (l) => {
            const { checked: b, value: g } = l == null ? void 0 : l.target;
            c(g, b);
          }), e.effect(() => {
            s = s;
            const l = d(e.data, n);
            l.includes(s.value) || s.value === l ? s.checked = !0 : s.checked = !1;
          });
          break;
        }
        case "radio": {
          s.hasAttribute("checked") && (s.removeAttribute("checked"), Object.assign(e.data, { [n]: s.value })), s.addEventListener("change", (i) => {
            const { checked: c, value: l } = i.target;
            c && Object.assign(e.data, { [l]: l });
          }), e.effect(() => {
            s = s;
            const i = d(e.data, n);
            s.checked = s.value === i;
          });
          break;
        }
        default:
          p(), s.removeAttribute("x-model"), s.addEventListener("input", (i) => {
            const c = i.target, l = c.value, b = u(l, Reflect.get(e.data, n));
            l !== b && (c.value = String(b)), Object.assign(e.data, { [n]: b });
          }), e.effect(() => s.value = d(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, p(), s.addEventListener("change", (i) => {
        const c = i.target.value;
        Object.assign(e.data, { [c]: c });
      }), e.effect(() => s.value = d(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const i = s.attributes.getNamedItem("open"), c = d(e.data, n);
      s.open = C(c) ? i ?? !1 : c, s.addEventListener("toggle", (l) => {
        const b = l.target.open;
        Object.assign(e.data, { [n]: b });
      }), e.effect(() => s.open = d(e.data, n));
      break;
    }
  }
}, re = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, f, o] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), a = t.parentElement, u = t.cloneNode(!0);
  t.remove();
  const p = () => {
    const m = u.cloneNode(!0), i = new I(m);
    return i.extend(e), { newEl: m, newCtx: i };
  }, h = (m, i) => {
    a == null || a.appendChild(m), V(i);
  };
  e.effect(() => {
    const m = d(e.data, o);
    if (typeof m == "number") {
      H(a);
      for (const i in Array.from({ length: m })) {
        const { newEl: c, newCtx: l } = p();
        Object.assign(l.data, { [s]: Number(i) }), h(c, l);
      }
    } else if (S(m)) {
      const [i, c] = s.replace("(", "").replace(")", "").split(","), l = i.trim(), b = c == null ? void 0 : c.trim();
      m.forEach((g, y) => {
        const { newEl: j, newCtx: w } = p();
        Object.assign(w.data, { [l]: g }), b && Object.assign(w.data, { [b]: Number(y) }), h(j, w);
      });
    } else if (N(m)) {
      const [i, c, l] = s.replace("(", "").replace(")", "").split(","), b = i.trim(), g = c == null ? void 0 : c.trim(), y = l == null ? void 0 : l.trim();
      Object.entries(m).forEach(([j, w], _) => {
        const { newEl: D, newCtx: A } = p();
        Object.assign(A.data, { [b]: w }), g && Object.assign(A.data, { [g]: j }), y && Object.assign(A.data, { [y]: Number(_) }), h(D, A);
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
    let f = r;
    for (const o of s) {
      const a = o.replace("{{", "").replace("}}", "");
      if (!a)
        continue;
      const u = d(e.data, a, t);
      f = f.replace(o, u);
    }
    t.textContent = f;
  });
}
const se = function(e, t, { value: r }) {
  const n = t.cloneNode(!0), s = document.querySelector(r);
  s || console.error("No valid target provided for `x-portal`"), t.remove(), s == null || s.append(n);
  const f = document.createTreeWalker(n);
  let o = f.root;
  for (; o; ) {
    if (o.nodeType === 1) {
      const a = o;
      if (k(a, "x-skip") !== null) {
        o = f.nextSibling();
        continue;
      }
      $(e, a);
    } else
      o.nodeType === 3 && M(e, o);
    o = f.nextNode();
  }
};
function V(e) {
  const t = document.createTreeWalker(e.root);
  let r = t.root;
  for (; r; ) {
    if (r.nodeType === 1) {
      const n = r;
      if (k(n, "x-skip") !== null) {
        r = t.nextSibling();
        continue;
      }
      let s;
      (s = k(n, "x-portal")) && (se(e, n, { value: s }), s = void 0), $(e, n);
    } else
      r.nodeType === 3 && M(e, r);
    r = t.nextNode();
  }
}
function $(e, t) {
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
        if (!N(n))
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
    r.name === "x-for" ? re(e, t, r) : r.name === "x-if" && ee(e, t, r), r.name === "x-ref" && U(e, t, r), r.name.startsWith("x-model") && te(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && Q(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && Z(e, t, r), r.name === "x-text" && z(e, t, r), r.name === "x-class" && Y(e, t, r), r.name === "x-html" && X(e, t, r), r.name === "x-style" && G(e, t, r), r.name === "x-show" && J(e, t, r), Object.keys(O).length > 0 && Object.entries(O).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const P = x({});
class ne {
  constructor(t) {
    Object.assign(P, t);
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
    if (t in E)
      throw new Error(`Event modifier ${t} is already defined`);
    return E[t] = r, this;
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
  start() {
    const t = Array.from(document.querySelectorAll("[x-scope]"));
    for (const r of t)
      ie(r);
  }
}
function ce(e) {
  return new ne(e ?? {});
}
function ie(e) {
  const t = new I(e);
  return e.setAttribute("style", "display:none;"), V(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  ce as Beskydy,
  ie as createScope
};
