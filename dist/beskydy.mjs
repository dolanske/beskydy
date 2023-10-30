var q = Object.defineProperty;
var H = (e, t, r) => t in e ? q(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var E = (e, t, r) => (H(e, typeof t != "symbol" ? t + "" : t, r), r);
import { reactive as W, effect as U } from "@vue/reactivity";
class $ {
  constructor(t, r) {
    // Store the context root element
    E(this, "root");
    // Reactive dataset available to the entire scope
    E(this, "data");
    E(this, "init");
    // Hold all context runners for disposal
    E(this, "effects", []);
    this.root = t, this.data = W(Object.assign({ $refs: {} }, F, r)), this.init = !1;
  }
  // Watch effects
  // effect = rawEffect
  effect(t) {
    const r = U(t);
    this.effects.push(r);
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
    var r;
    this.effects.forEach((n) => n.effect.stop()), this.effects.length = 0;
    const t = this.root.cloneNode(!0);
    (r = this.root.parentElement) == null || r.replaceChild(t, this.root), Reflect.set(this, "data", /* @__PURE__ */ Object.create(null)), this.init = !1;
  }
}
const k = {}, M = /* @__PURE__ */ Object.create(null);
function m(e, t, r) {
  return V(e, `return(${t})`, r);
}
function V(e, t, r, n) {
  JSON.stringify(e);
  const s = M[t] || (M[t] = z(t));
  try {
    return s(e, r, n);
  } catch (o) {
    console.error(o);
  }
}
function z(e) {
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
function R(e) {
  return e == null;
}
function C(e) {
  return !!e && e.constructor === Object;
}
const P = Array.isArray;
function G(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
function j(e, t) {
  return e in t.data ? m(t.data, e) : e === "undefined" ? void 0 : e === "null" ? null : e === "true" || e === "false" ? !!e : isNaN(e) ? e : Number(e);
}
function S(e) {
  return [...e].reduce((t, r) => t += `\\${r}`, "");
}
const J = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), e.addRef(r, t), new MutationObserver(() => {
    e.addRef(r, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, Q = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = n;
  e.effect(() => {
    t.textContent = m(e.data, s, t);
  });
}, Y = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    const o = m(e.data, s, t);
    if (C(o))
      for (const l of Object.keys(o))
        Reflect.has(t, "style") && Reflect.set(t.style, l, o[l]);
  });
}, Z = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  Reflect.has(t, "style") && e.effect(() => {
    m(e.data, s, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, ee = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n);
  const s = r;
  e.effect(() => {
    t.innerHTML = m(e.data, s, t);
  });
}, te = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const [s, o] = r.split(":"), l = (i, a) => {
    R(a) ? t.removeAttribute(i) : t.setAttribute(i, a);
  };
  o ? e.effect(() => {
    const i = m(e.data, n, t);
    l(r, i);
  }) : e.effect(() => {
    const i = m(e.data, n, t) ?? {};
    for (const a of Object.keys(i)) {
      const u = i[a];
      l(a, u);
    }
  });
}, re = function(e, t, { value: r }) {
  const n = (s) => {
    for (const o of Object.keys(s))
      s[o] ? t.classList.add(o) : t.classList.remove(o);
  };
  if (r.startsWith("[")) {
    const s = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const o = m(e.data, r);
      for (let l = 0; l < o.length; l++) {
        const i = o[l];
        if (i)
          typeof i == "string" ? (t.classList.add(i), s[l] = i) : C(i) && n(i);
        else {
          const a = s[l];
          a && (t.classList.remove(a), s[l] = null);
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
}, se = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = (r.startsWith("x-on") ? r.split(":")[1] : r.substring(1)).split("."), o = s[0], l = s.slice(1).map((a) => {
    const [u, p] = a.split("[");
    let h;
    if (p) {
      const c = p.replace("]", "");
      h = j(c, e);
    }
    return { key: u, param: h };
  }).filter((a) => Object.keys(N).includes(a.key));
  n.startsWith("()") && (n = `(${n})()`);
  const i = {
    calledTimes: 0,
    lastCall: 0
  };
  t.addEventListener(o, (a) => {
    l.every((u) => N[u.key](a, i, u.param)) && (V(e.data, n, t, a), i.calledTimes++, i.lastCall = Date.now());
  });
}, ne = function(e, t, { name: r, value: n }) {
  t.removeAttribute(r);
  const s = t.parentElement, o = new Comment("x-if");
  s.insertBefore(o, t);
  const l = [{
    node: t,
    expr: n
  }];
  let i, a;
  for (; (i = t.nextElementSibling) !== null && ((a = O(i, "x-else")) !== null || (a = O(i, "x-else-if"))); )
    l.push({
      node: i,
      expr: a
    }), s.removeChild(i);
  s.removeChild(t);
  let u, p;
  function h() {
    p && (s.removeChild(p.node), p = null);
  }
  e.effect(() => {
    console.log(l);
    for (let c = 0; c < l.length; c++) {
      const f = l[c];
      if (!f.expr || m(e.data, f.expr, t)) {
        u !== c && (p && h(), s.insertBefore(f.node, o), console.log(f.node), T(e, f.node), p = f, u = c);
        return;
      }
    }
    u = -1, h();
  });
}, L = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
}, ie = function(e, t, { name: r, value: n }) {
  var p, h;
  let s = t;
  const [o, l] = r.split("."), i = (p = s.attributes.getNamedItem("value")) == null ? void 0 : p.value, a = (c, f) => {
    if (!l)
      return c;
    const [d, b] = l.split("[");
    let g;
    if (b) {
      const y = b.replace("]", "");
      g = j(y, e);
    }
    return L[d](c, f, g);
  }, u = () => {
    let c;
    const f = m(e.data, n);
    f ? c = f : i && (c = i), Object.assign(e.data, { [r]: c }), s = s, s.value = c;
  };
  switch (s.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (s = s, (h = s.attributes.getNamedItem("type")) == null ? void 0 : h.value) {
        case "checkbox": {
          const c = Reflect.get(e.data, n), f = (d, b) => {
            P(c) ? c.includes(d) ? c.splice(c.indexOf(d), 1) : c.push(d) : Reflect.set(e.data, d, R(d) ? !b : d);
          };
          (!c || c.length === 0) && s.hasAttribute("checked") && (f(s.value, !0), s.removeAttribute("checked")), s.addEventListener("change", (d) => {
            const { checked: b, value: g } = d == null ? void 0 : d.target;
            f(g, b);
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
            const f = c.target, d = f.value, b = a(d, Reflect.get(e.data, n));
            d !== b && (f.value = String(b)), Object.assign(e.data, { [n]: b });
          }), e.effect(() => s.value = m(e.data, n));
      }
      break;
    }
    case "SELECT": {
      s = s, u(), s.addEventListener("change", (c) => {
        const f = j(c.target.value, e);
        Object.assign(e.data, { [n]: f });
      }), e.effect(() => s.value = m(e.data, n));
      break;
    }
    case "DETAILS": {
      s = s;
      const c = s.attributes.getNamedItem("open"), f = m(e.data, n);
      s.open = R(f) ? c ?? !1 : f, s.addEventListener("toggle", (d) => {
        const b = d.target.open;
        Object.assign(e.data, { [n]: b });
      }), e.effect(() => s.open = m(e.data, n));
      break;
    }
  }
}, oe = function(e, t, { value: r, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [s, o, l] = r.split(/(?!\(.*)\s(?![^(]*?\))/g), i = t.parentElement, a = t.cloneNode(!0);
  t.remove();
  const u = () => {
    const h = a.cloneNode(!0), c = new $(h);
    return c.extend(e), { newEl: h, newCtx: c };
  }, p = (h, c) => {
    i == null || i.appendChild(h), T(c);
  };
  e.effect(() => {
    const h = m(e.data, l);
    if (typeof h == "number") {
      G(i);
      for (const c in Array.from({ length: h })) {
        const { newEl: f, newCtx: d } = u();
        Object.assign(d.data, { [s]: Number(c) }), p(f, d);
      }
    } else if (P(h)) {
      const [c, f] = s.replace("(", "").replace(")", "").split(","), d = c.trim(), b = f == null ? void 0 : f.trim();
      h.forEach((g, y) => {
        const { newEl: x, newCtx: w } = u();
        Object.assign(w.data, { [d]: g }), b && Object.assign(w.data, { [b]: Number(y) }), p(x, w);
      });
    } else if (C(h)) {
      const [c, f, d] = s.replace("(", "").replace(")", "").split(","), b = c.trim(), g = f == null ? void 0 : f.trim(), y = d == null ? void 0 : d.trim();
      Object.entries(h).forEach(([x, w], X) => {
        const { newEl: K, newCtx: v } = u();
        Object.assign(v.data, { [b]: w }), g && Object.assign(v.data, { [g]: x }), y && Object.assign(v.data, { [y]: Number(X) }), p(K, v);
      });
    } else
      throw new TypeError("Unsupported value was used in 'x-for'. Please only use a number, array or an object");
  });
};
function _(e, t) {
  if (!t.textContent || t.textContent === "")
    return;
  const r = t.textContent, n = new RegExp(`(?=${S(A.start)})(.*?)(?<=${S(A.end)})`, "g"), s = r.match(n);
  !s || s.length === 0 || e.effect(() => {
    let o = r;
    for (const l of s) {
      const i = l.replace(A.start, "").replace(A.end, "");
      if (!i)
        continue;
      const a = m(e.data, i, t);
      o = o.replace(l, a);
    }
    t.textContent = o;
  });
}
const ae = function(e, t, { name: r, value: n }) {
  const s = t.cloneNode(!0), o = document.querySelector(n), [, l] = r.split(":");
  if (!o) {
    console.error("No valid target provided for `x-portal`");
    return;
  }
  t.remove(), l === "prepend" ? o.prepend(s) : l === "replace" ? o.replaceChildren(s) : o.append(s);
  const i = document.createTreeWalker(s);
  let a = i.root;
  for (; a; ) {
    if (a.nodeType === I.ELEMENT) {
      const u = a;
      if (O(u, "x-skip") !== null) {
        a = i.nextSibling();
        continue;
      }
      B(e, u);
    } else
      a.nodeType === I.TEXT && _(e, a);
    a = i.nextNode();
  }
}, ce = function(e, t, { name: r, value: n }) {
  if (t.removeAttribute(r), r === "x-scope" && e.root !== t)
    throw new Error("Can not initialize a new scope within an existing scope");
  try {
    if (!n)
      return !0;
    const s = m({}, n);
    if (!C(s))
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
}, le = function(e, t, { value: r }) {
  t.removeAttribute("x-switch");
  const n = [], s = Array.from(t.children).filter((i) => i.hasAttribute("x-case") || i.hasAttribute("x-default")).map((i) => {
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
    const i = m(e.data, r);
    let a;
    for (let u = 0; u < s.length; u++) {
      const p = s[u];
      if (u < s.length - 1 && p.isDefault && (a = [p, u]), p.expr) {
        if (j(p.expr, e) === i) {
          a = [p, u];
          break;
        }
      } else
        u === s.length - 1 && (a = [p, u]);
    }
    if (a) {
      l();
      const [u, p] = a, h = n[p];
      t.insertBefore(u.node, h), T(e, u.node), o = u;
      return;
    }
    l();
  });
}, fe = function(e, t, { name: r, value: n }) {
  const [s, ...o] = r.split(":");
  let l = /* @__PURE__ */ Object.create(null);
  e.effect(() => {
    if (o.length > 0) {
      for (const i of o)
        if (Reflect.get(l, i) !== Reflect.get(e.data, i)) {
          m(e.data, n, t);
          break;
        }
      l = { ...e.data };
    } else
      m(e.data, n, t);
  });
};
var I = /* @__PURE__ */ ((e) => (e[e.ELEMENT = 1] = "ELEMENT", e[e.TEXT = 3] = "TEXT", e))(I || {});
function T(e, t) {
  const r = document.createTreeWalker(t ?? e.root);
  let n = r.root;
  for (; n; ) {
    if (n.nodeType === 1) {
      const s = n;
      if (O(s, "x-skip") !== null) {
        n = r.nextSibling();
        continue;
      }
      let o;
      (o = Array.from(s.attributes).find((l) => l.name.startsWith("x-portal"))) && ae(e, s, o), B(e, s);
    } else
      n.nodeType === 3 && _(e, n);
    n = r.nextNode();
  }
}
function B(e, t) {
  for (const r of Array.from(t.attributes)) {
    if ((r.name === "x-data" || r.name === "x-scope") && ce(e, t, r))
      throw new Error(`[x-scope/x-data] Error when processing attribute. 
 Most likely an issue with the the data object.`);
    r.name === "x-for" ? oe(e, t, r) : r.name === "x-if" && ne(e, t, r), r.name === "x-switch" && le(e, t, r), r.name === "x-ref" && J(e, t, r), r.name.startsWith("x-model") && ie(e, t, r), (r.name.startsWith("x-bind") || r.name.startsWith(":")) && te(e, t, r), (r.name.startsWith("@") || r.name.startsWith("x-on")) && se(e, t, r), r.name.startsWith("x-spy") && fe(e, t, r), r.name === "x-text" && Q(e, t, r), r.name === "x-class" && re(e, t, r), r.name === "x-html" && ee(e, t, r), r.name === "x-style" && Y(e, t, r), r.name === "x-show" && Z(e, t, r), Object.keys(k).length > 0 && Object.entries(k).forEach(([n, s]) => {
      r.name.startsWith(n) && s(e, t, r);
    });
  }
}
const D = [], A = {
  start: "{{",
  end: "}}"
}, F = W({});
function ge(e, t) {
  if (e in k)
    throw new Error(`Directive ${e} is already defined`);
  k[e] = t;
}
function ye(e, t) {
  if (e in N)
    throw new Error(`Event modifier ${e} is already defined`);
  N[e] = t;
}
function we(e, t) {
  if (e in L)
    throw new Error(`Model modifier ${e} is already defined`);
  L[e] = t;
}
function ue(e, t) {
  Object.assign(A, { start: e, end: t });
}
class de {
  constructor(t) {
    Object.assign(F, t);
  }
  /**
   * Initialize Beskydy. It starts by collecting all the scopes and initializing them
   */
  init() {
    const t = Array.from(document.querySelectorAll("[x-scope]"));
    for (const r of t)
      me(r);
  }
  /**
   * Stops Beskydy instance, removes reactivity and event listeners and leaves the DOM in the state it was when the app was torn down./
   */
  teardown() {
    for (const t of D)
      t.teardown();
    D.length = 0;
  }
}
function pe(e) {
  return new de(e ?? {});
}
function me(e) {
  const t = new $(e);
  return e.setAttribute("style", "display:none;"), T(t), t.init = !0, e.removeAttribute("style"), D.push(t), { ctx: t };
}
ue("[[", "]]");
pe().init();
export {
  de as Beskydy,
  pe as createApp,
  me as createScope,
  ge as defineDirective,
  ye as defineEventModifier,
  we as defineModelModifier,
  F as globalState,
  ue as setDelimiters
};
