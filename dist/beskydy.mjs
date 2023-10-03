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
    this.root = t, this.data = L(Object.assign({ $refs: {} }, D, r)), this.init = !1;
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
const E = {}, x = /* @__PURE__ */ Object.create(null);
function d(e, t, r) {
  return R(e, `return(${t})`, r);
}
function R(e, t, r, n) {
  JSON.stringify(e);
  const s = x[t] || (x[t] = q(t));
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
function v(e, t) {
  const r = e.getAttribute(t);
  return e.removeAttribute(t), r ? r.trim() : null;
}
function C(e) {
  return e == null;
}
function j(e) {
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
    const c = d(e.data, s, t);
    if (j(c))
      for (const a of Object.keys(c))
        Reflect.has(t, "style") && Reflect.set(t.style, a, c[a]);
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
  const [s, c] = r.split(":"), a = (o, u) => {
    C(u) ? t.removeAttribute(o) : t.setAttribute(o, u);
  };
  c ? e.effect(() => {
    const o = d(e.data, n, t);
    a(r, o);
  }) : e.effect(() => {
    const o = d(e.data, n, t) ?? {};
    for (const u of Object.keys(o)) {
      const p = o[u];
      a(u, p);
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
      const c = d(e.data, r);
      for (let a = 0; a < c.length; a++) {
        const o = c[a];
        if (o)
          typeof o == "string" ? (t.classList.add(o), s[a] = o) : j(o) && n(o);
        else {
          const u = s[a];
          u && (t.classList.remove(u), s[a] = null);
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
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), c = s[0], a = s.slice(1).map((u) => {
    const [p, h] = u.split("[");
    let m;
    if (h) {
      const i = h.replace("]", "");
      m = W(i, e);
    }
    return { key: p, param: m };
  }).filter((u) => Object.keys(O).includes(u.key));
  n.startsWith("()") && (n = `(${n})()`);
  const o = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(c, (u) => {
    a.every((p) => O[p.key](u, o, p.param)) && (R(e.data, n, t, u), o.calledTimes++, o.lastCall = Date.now());
  });
}, ee = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, c = new Comment("x-if");
  s.insertBefore(c, t);
  const a = [{
    node: t,
    expr: n
  }];
  let o, u;
  for (; (o = t.nextElementSibling) !== null && ((u = v(o, "x-else")) !== null || (u = v(o, "x-else-if"))); )
    a.push({
      node: o,
      expr: u
    }), s.removeChild(o);
  s.removeChild(t);
  let p, h;
  function m() {
    h && (s.removeChild(h.node), h = null);
  }
  e.effect(() => {
    for (let i = 0; i < a.length; i++) {
      const l = a[i];
      if (!l.expr || d(e.data, l.expr, t)) {
        p !== i && (h && m(), s.insertBefore(l.node, c), h = l, p = i);
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
  const [c, a] = r.split("."), o = (h = s.attributes.getNamedItem("value")) == null ? void 0 : h.value, u = (i, l) => {
    if (!a)
      return i;
    const [f, b] = a.split("[");
    let g;
    if (b) {
      const y = b.replace("]", "");
      g = W(y, e);
    }
    return T[f](i, l, g);
  }, p = () => {
    let i;
    const l = d(e.data, n);
    l ? i = l : o && (i = o), Object.assign(e.data, { [r]: i }), s = s, s.value = i;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (m = s.attributes.getNamedItem("type")) == null ? void 0 : m.value) {
        case "checkbox": {
          const i = Reflect.get(e.data, n), l = (f, b) => {
            S(i) ? i.includes(f) ? i.splice(i.indexOf(f), 1) : i.push(f) : Reflect.set(e.data, f, C(f) ? !b : f);
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
            const l = i.target, f = l.value, b = u(f, Reflect.get(e.data, n));
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
  const [s, c, a] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), o = t.parentElement, u = t.cloneNode(!0);
  t.remove();
  const p = () => {
    const m = u.cloneNode(!0), i = new I(m);
    return i.extend(e), { newEl: m, newCtx: i };
  }, h = (m, i) => {
    o == null || o.appendChild(m), V(i);
  };
  e.effect(() => {
    const m = d(e.data, a);
    if (typeof m == "number") {
      H(o);
      for (const i in Array.from({ length: m })) {
        const { newEl: l, newCtx: f } = p();
        Object.assign(f.data, { [s]: Number(i) }), h(l, f);
      }
    } else if (S(m)) {
      const [i, l] = s.replace("(", "").replace(")", "").split(","), f = i.trim(), b = l == null ? void 0 : l.trim();
      m.forEach((g, y) => {
        const { newEl: N, newCtx: w } = p();
        Object.assign(w.data, { [f]: g }), b && Object.assign(w.data, { [b]: Number(y) }), h(N, w);
      });
    } else if (j(m)) {
      const [i, l, f] = s.replace("(", "").replace(")", "").split(","), b = i.trim(), g = l == null ? void 0 : l.trim(), y = f == null ? void 0 : f.trim();
      Object.entries(m).forEach(([N, w], P) => {
        const { newEl: _, newCtx: A } = p();
        Object.assign(A.data, { [b]: w }), g && Object.assign(A.data, { [g]: N }), y && Object.assign(A.data, { [y]: Number(P) }), h(_, A);
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
    for (const a of s) {
      const o = a.replace("{{", "").replace("}}", "");
      if (!o)
        continue;
      const u = d(e.data, o, t);
      c = c.replace(a, u);
    }
    t.textContent = c;
  });
}
const se = function(e, t, { value: r }) {
  const n = t.cloneNode(!0), s = document.querySelector(r);
  s || console.error("No valid target provided for `x-portal`"), t.remove(), s == null || s.append(n);
  const c = document.createTreeWalker(n);
  let a = c.root;
  for (; a; ) {
    if (a.nodeType === 1) {
      const o = a;
      if (v(o, "x-skip") !== null) {
        a = c.nextSibling();
        continue;
      }
      $(e, o);
    } else
      a.nodeType === 3 && M(e, a);
    a = c.nextNode();
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
};
function V(e) {
  const t = document.createTreeWalker(e.root);
  let r = t.root;
  for (; r; ) {
    if (r.nodeType === 1) {
      const n = r;
      if (v(n, "x-skip") !== null) {
        r = t.nextSibling();
        continue;
      }
      let s;
      (s = v(n, "x-portal")) && (se(e, n, { value: s }), s = void 0), $(e, n);
    } else
      r.nodeType === 3 && M(e, r);
    r = t.nextNode();
  }
}
function $(e, t) {
  for (const r of Array.from(t.attributes)) {
    if ((r.name === "x-data" || r.name === "x-scope") && ne(e, t, r))
      throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
    r.name === "x-for" ? re(e, t, r) : r.name === "x-if" && ee(e, t, r), r.name === "x-ref" && U(e, t, r), r.name.startsWith("x-model") && te(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && Q(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && Z(e, t, r), r.name === "x-text" && z(e, t, r), r.name === "x-class" && Y(e, t, r), r.name === "x-html" && X(e, t, r), r.name === "x-style" && G(e, t, r), r.name === "x-show" && J(e, t, r), Object.keys(E).length > 0 && Object.entries(E).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const D = L({});
class ie {
  constructor(t) {
    Object.assign(D, t);
  }
  /**
   * Add a custom directive (element attribute)
   *
   * @param name Directive name, preferably should start with `x-`
   * @param fn Directive implementation
   */
  defineDirective(t, r) {
    if (t in E)
      throw new Error(`Directive ${t} is already defined`);
    return E[t] = r, this;
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
      oe(r);
  }
}
function le(e) {
  return new ie(e ?? {});
}
function oe(e) {
  const t = new I(e);
  return e.setAttribute("style", "display:none;"), V(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  le as Beskydy,
  oe as createScope
};
