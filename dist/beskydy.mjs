var B = Object.defineProperty;
var F = (e, t, r) => t in e ? B(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var k = (e, t, r) => (F(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as L, effect as K } from "@vue/reactivity";
class I {
  constructor(t, r) {
    // Store the context root element
    k(this, "root");
    // Reactive dataset available to the entire scope
    k(this, "data");
    k(this, "init");
    // Watch effects
    // effect = rawEffect
    k(this, "effect", K);
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
const v = {}, x = /* @__PURE__ */ Object.create(null);
function d(e, t, r) {
  return R(e, `return(${t})`, r);
}
function R(e, t, r, n) {
  JSON.stringify(e);
  const s = x[t] || (x[t] = q(t));
  try {
    return s(e, r, n);
  } catch (o) {
    console.error(o);
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
  const r = e.getAttribute(t);
  return e.removeAttribute(t), r ? r.trim() : null;
}
function C(e) {
  return e == null;
}
function j(e) {
  return !!e && e.constructor === Object;
}
const W = Array.isArray;
function H(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function S(e, t) {
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
    const o = d(e.data, s, t);
    if (j(o))
      for (const u of Object.keys(o))
        Reflect.has(t, "style") && Reflect.set(t.style, u, o[u]);
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
  const [s, o] = r.split(":"), u = (a, c) => {
    C(c) ? t.removeAttribute(a) : t.setAttribute(a, c);
  };
  o ? e.effect(() => {
    const a = d(e.data, n, t);
    u(r, a);
  }) : e.effect(() => {
    const a = d(e.data, n, t) ?? {};
    for (const c of Object.keys(a)) {
      const p = a[c];
      u(c, p);
    }
  });
}, Y = function(e, t, { value: r }) {
  const n = (s) => {
    for (const o of Object.keys(s))
      s[o] ? t.classList.add(o) : t.classList.remove(o);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const o = d(e.data, r);
      for (let u = 0; u < o.length; u++) {
        const a = o[u];
        if (a)
          typeof a == "string" ? (t.classList.add(a), s[u] = a) : j(a) && n(a);
        else {
          const c = s[u];
          c && (t.classList.remove(c), s[u] = null);
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
}, O = {
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
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), o = s[0], u = s.slice(1).map((c) => {
    const [p, h] = c.split("[");
    let m;
    if (h) {
      const i = h.replace("]", "");
      m = S(i, e);
    }
    return { key: p, param: m };
  }).filter((c) => Object.keys(O).includes(c.key));
  n.startsWith("()") && (n = `(${n})()`);
  const a = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(o, (c) => {
    u.every((p) => O[p.key](c, a, p.param)) && (R(e.data, n, t, c), a.calledTimes++, a.lastCall = Date.now());
  });
}, ee = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, o = new Comment("x-if");
  s.insertBefore(o, t);
  const u = [{
    node: t,
    expr: n
  }];
  let a, c;
  for (; (a = t.nextElementSibling) !== null && ((c = E(a, "x-else")) !== null || (c = E(a, "x-else-if"))); )
    u.push({
      node: a,
      expr: c
    }), s.removeChild(a);
  s.removeChild(t);
  let p, h;
  function m() {
    h && (s.removeChild(h.node), h = null);
  }
  e.effect(() => {
    for (let i = 0; i < u.length; i++) {
      const l = u[i];
      if (!l.expr || d(e.data, l.expr, t)) {
        p !== i && (h && m(), s.insertBefore(l.node, o), h = l, p = i);
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
  const [o, u] = r.split("."), a = (h = s.attributes.getNamedItem("value")) == null ? void 0 : h.value, c = (i, l) => {
    if (!u)
      return i;
    const [f, b] = u.split("[");
    let g;
    if (b) {
      const y = b.replace("]", "");
      g = S(y, e);
    }
    return T[f](i, l, g);
  }, p = () => {
    let i;
    const l = d(e.data, n);
    l ? i = l : a && (i = a), Object.assign(e.data, { [r]: i }), s = s, s.value = i;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (m = s.attributes.getNamedItem("type")) == null ? void 0 : m.value) {
        case "checkbox": {
          const i = Reflect.get(e.data, n), l = (f, b) => {
            W(i) ? i.includes(f) ? i.splice(i.indexOf(f), 1) : i.push(f) : Reflect.set(e.data, f, C(f) ? !b : f);
          };
          (!i || i.length === 0) && s.hasAttribute("checked") && (l(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (f) => {
            const { checked: b, value: g } = f == null ? void 0 : f.target;
            l(g, b);
          }), e.effect(() => {
            s = s;
            const f = d(e.data, n);
            f.includes(s.value) || s.value === f ? s.checked = !0 : s.checked = !1;
          });
          break;
        }
        case "radio": {
          s.hasAttribute("checked") && (s.removeAttribute("checked"), Object.assign(e.data, { [n]: s.value })), s.addEventListener("change", (i) => {
            const { checked: l, value: f } = i.target;
            l && Object.assign(e.data, { [f]: f });
          }), e.effect(() => {
            s = s;
            const i = d(e.data, n);
            s.checked = s.value === i;
          });
          break;
        }
        default:
          p(), s.removeAttribute("x-model"), s.addEventListener("input", (i) => {
            const l = i.target, f = l.value, b = c(f, Reflect.get(e.data, n));
            f !== b && (l.value = String(b)), Object.assign(e.data, { [n]: b });
          }), e.effect(() => s.value = d(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, p(), s.addEventListener("change", (i) => {
        const l = i.target.value;
        Object.assign(e.data, { [l]: l });
      }), e.effect(() => s.value = d(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const i = s.attributes.getNamedItem("open"), l = d(e.data, n);
      s.open = C(l) ? i ?? !1 : l, s.addEventListener("toggle", (f) => {
        const b = f.target.open;
        Object.assign(e.data, { [n]: b });
      }), e.effect(() => s.open = d(e.data, n));
      break;
    }
  }
}, re = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, o, u] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), a = t.parentElement, c = t.cloneNode(!0);
  t.remove();
  const p = () => {
    const m = c.cloneNode(!0), i = new I(m);
    return i.extend(e), { newEl: m, newCtx: i };
  }, h = (m, i) => {
    a == null || a.appendChild(m), P(i);
  };
  e.effect(() => {
    const m = d(e.data, u);
    if (typeof m == "number") {
      H(a);
      for (const i in Array.from({ length: m })) {
        const { newEl: l, newCtx: f } = p();
        Object.assign(f.data, { [s]: Number(i) }), h(l, f);
      }
    } else if (W(m)) {
      const [i, l] = s.replace("(", "").replace(")", "").split(","), f = i.trim(), b = l == null ? void 0 : l.trim();
      m.forEach((g, y) => {
        const { newEl: N, newCtx: w } = p();
        Object.assign(w.data, { [f]: g }), b && Object.assign(w.data, { [b]: Number(y) }), h(N, w);
      });
    } else if (j(m)) {
      const [i, l, f] = s.replace("(", "").replace(")", "").split(","), b = i.trim(), g = l == null ? void 0 : l.trim(), y = f == null ? void 0 : f.trim();
      Object.entries(m).forEach(([N, w], D) => {
        const { newEl: _, newCtx: A } = p();
        Object.assign(A.data, { [b]: w }), g && Object.assign(A.data, { [g]: N }), y && Object.assign(A.data, { [y]: Number(D) }), h(_, A);
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
    let o = r;
    for (const u of s) {
      const a = u.replace("{{", "").replace("}}", "");
      if (!a)
        continue;
      const c = d(e.data, a, t);
      o = o.replace(u, c);
    }
    t.textContent = o;
  });
}
const se = function(e, t, { name: r, value: n }) {
  const s = t.cloneNode(!0), o = document.querySelector(n), [, u] = r.split(":");
  if (!o) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), u === "prepend" ? o.prepend(s) : u === "replace" ? o.replaceChildren(s) : o.append(s);
  const a = document.createTreeWalker(s);
  let c = a.root;
  for (; c; ) {
    if (c.nodeType === 1) {
      const p = c;
      if (E(p, "x-skip") !== null) {
        c = a.nextSibling();
        continue;
      }
      V(e, p);
    } else
      c.nodeType === 3 && M(e, c);
    c = a.nextNode();
  }
}, ne = function(e, t, { name: r, value: n }) {
  if (t.removeAttribute(r), r === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    if (!n)
      return !0;
    const s = d({}, n);
    if (!j(s))
      return !0;
    for (const o of Object.keys(s))
      Object.defineProperty(e.data, o, {
        value: s[o],
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  } catch (s) {
    return console.warn("[x-scope/x-data] Error when processing attribute"), console.log(s), !0;
  }
  return !1;
};
function P(e) {
  const t = document.createTreeWalker(e.root);
  let r = t.root;
  for (; r; ) {
    if (r.nodeType === 1) {
      const n = r;
      if (E(n, "x-skip") !== null) {
        r = t.nextSibling();
        continue;
      }
      let s;
      (s = Array.from(n.attributes).find((o) => o.name.startsWith("x-portal"))) && se(e, n, s), V(e, n);
    } else
      r.nodeType === 3 && M(e, r);
    r = t.nextNode();
  }
}
function V(e, t) {
  for (const r of Array.from(t.attributes)) {
    if ((r.name === "x-data" || r.name === "x-scope") && ne(e, t, r))
      throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
    r.name === "x-for" ? re(e, t, r) : r.name === "x-if" && ee(e, t, r), r.name === "x-ref" && U(e, t, r), r.name.startsWith("x-model") && te(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && Q(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && Z(e, t, r), r.name === "x-text" && z(e, t, r), r.name === "x-class" && Y(e, t, r), r.name === "x-html" && X(e, t, r), r.name === "x-style" && G(e, t, r), r.name === "x-show" && J(e, t, r), Object.keys(v).length > 0 && Object.entries(v).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const $ = L({});
class ie {
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
  defineEventModifier(t, r) {
    if (t in O)
      throw new Error(`Event modifier ${t} is already defined`);
    return O[t] = r, this;
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
      ae(r);
  }
}
function le(e) {
  return new ie(e ?? {});
}
function ae(e) {
  const t = new I(e);
  return e.setAttribute("style", "display:none;"), P(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  le as Beskydy,
  ae as createScope
};
