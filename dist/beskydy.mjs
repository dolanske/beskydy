var M = Object.defineProperty;
var D = (e, t, s) => t in e ? M(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var v = (e, t, s) => (D(e, typeof t != "symbol" ? t + "" : t, s), s);
import { reactive as L, effect as P } from "@vue/reactivity";
class R {
  constructor(t, s) {
    // Store the context root element
    v(this, "root");
    // Reactive dataset available to the entire scope
    v(this, "data");
    v(this, "init");
    // Watch effects
    // effect = rawEffect
    v(this, "effect", P);
    this.root = t, this.data = L(Object.assign({ $refs: {} }, S, s)), this.init = !1;
  }
  // Store refs for access within scope
  addRef(t, s) {
    Object.assign(this.data.$refs, { [t]: s });
  }
  // When creating sub contexts, this allows for a parent context to
  // share its reactive properties with the child context
  extend(t) {
    Object.assign(this.data, t.data);
  }
}
const k = {}, N = /* @__PURE__ */ Object.create(null);
function m(e, t, s) {
  return x(e, `return(${t})`, s);
}
function x(e, t, s, n) {
  JSON.stringify(e);
  const r = N[t] || (N[t] = _(t));
  try {
    return r(e, s, n);
  } catch (l) {
    console.error(l);
  }
}
function _(e) {
  try {
    return new Function("data", "$el", "$event", `with(data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}
function E(e, t) {
  const s = e.getAttribute(t);
  return e.removeAttribute(t), s ? s.trim() : null;
}
function C(e) {
  return e == null;
}
function w(e) {
  return !!e && e.constructor === Object;
}
const I = Array.isArray;
function F(e) {
  for (; e.lastElementChild; )
    e.removeChild(e.lastElementChild);
}
const B = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), e.addRef(s, t), new MutationObserver(() => {
    e.addRef(s, t);
  }).observe(t, {
    attributes: !0,
    childList: !0,
    subtree: !0,
    characterData: !0
  });
}, K = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = n;
  e.effect(() => {
    t.textContent = m(e.data, r, t);
  });
}, H = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    const l = m(e.data, r, t);
    if (w(l))
      for (const f of Object.keys(l))
        Reflect.has(t, "style") && Reflect.set(t.style, f, l[f]);
  });
}, U = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  Reflect.has(t, "style") && e.effect(() => {
    m(e.data, r, t) ? t.style.removeProperty("display") : t.style.setProperty("display", "none");
  });
}, q = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n);
  const r = s;
  e.effect(() => {
    t.innerHTML = m(e.data, r, t);
  });
}, z = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const [r, l] = s.split(":"), f = (a, u) => {
    C(u) ? t.removeAttribute(a) : t.setAttribute(a, u);
  };
  l ? e.effect(() => {
    const a = m(e.data, n, t);
    f(s, a);
  }) : e.effect(() => {
    const a = m(e.data, n, t) ?? {};
    for (const u of Object.keys(a)) {
      const b = a[u];
      f(u, b);
    }
  });
}, G = function(e, t, { value: s }) {
  const n = (r) => {
    for (const l of Object.keys(r))
      r[l] ? t.classList.add(l) : t.classList.remove(l);
  };
  if (s.startsWith("[")) {
    const r = /* @__PURE__ */ Object.create(null);
    e.effect(() => {
      const l = m(e.data, s);
      for (let f = 0; f < l.length; f++) {
        const a = l[f];
        if (a)
          typeof a == "string" ? (t.classList.add(a), r[f] = a) : w(a) && n(a);
        else {
          const u = r[f];
          u && (t.classList.remove(u), r[f] = null);
        }
      }
    });
  } else if (s.startsWith("{") && s.endsWith("}"))
    e.effect(() => {
      const r = m(e.data, s, t);
      n(r);
    });
  else {
    let r;
    e.effect(() => {
      r && t.classList.remove(r), r = m(e.data, s, t), t.classList.add(r);
    });
  }
}, T = {
  // TODO
  // Add option to provide parameters to modifiers
  // .only(amountofTimes) =>
  // .debounce(debounceBy) =>
  once: (e, { calledTimes: t }) => t < 1,
  self: (e) => e.target === e.currentTarget,
  left: (e) => "button" in e && e.button === 0,
  middle: (e) => "button" in e && e.button === 1,
  right: (e) => "button" in e && e.button === 2,
  prevent: (e) => (e.preventDefault(), !0),
  stop: (e) => (e.stopPropagation(), !0)
}, J = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = (s.startsWith("x-on") ? s.split(":")[1] : s.substring(1)).split("."), l = r[0], f = r.slice(1).filter((u) => Object.keys(T).includes(u));
  n.startsWith("()") && (n = `(${n})()`);
  const a = {
    calledTimes: 0
  };
  t.addEventListener(l, (u) => {
    f.every((b) => T[b](u, a)) && (x(e, n, t, u), a.calledTimes++);
  });
}, X = function(e, t, { name: s, value: n }) {
  t.removeAttribute(s);
  const r = t.parentElement, l = new Comment("x-if");
  r.insertBefore(l, t);
  const f = [{
    node: t,
    expr: n
  }];
  let a, u;
  for (; (a = t.nextElementSibling) !== null && ((u = E(a, "x-else")) !== null || (u = E(a, "x-else-if"))); )
    f.push({
      node: a,
      expr: u
    }), r.removeChild(a);
  r.removeChild(t);
  let b, h;
  function d() {
    h && (r.removeChild(h.node), h = null);
  }
  e.effect(() => {
    for (let i = 0; i < f.length; i++) {
      const o = f[i];
      if (!o.expr || m(e.data, o.expr, t)) {
        b !== i && (h && d(), r.insertBefore(o.node, l), h = o, b = i);
        return;
      }
    }
    b = -1, d();
  });
}, Q = {
  trim: (e) => e.trim(),
  number: (e, t) => Number.isNaN(Number(e)) ? Number(t) : Number(e)
  // debounced: (value, ms) => {}
}, Y = function(e, t, { name: s, value: n }) {
  var h, d;
  let r = t;
  const [l, f] = s.split("."), a = (h = r.attributes.getNamedItem("value")) == null ? void 0 : h.value, u = (i, o) => f ? Q[f](i, o) : i, b = () => {
    let i;
    const o = m(e.data, n);
    o ? i = o : a && (i = a), Object.assign(e.data, { [s]: i }), r = r, r.value = i;
  };
  switch (r.tagName) {
    case "INPUT":
    case "TEXTAREA": {
      switch (r = r, (d = r.attributes.getNamedItem("type")) == null ? void 0 : d.value) {
        case "checkbox": {
          const i = Reflect.get(e.data, n), o = (c, p) => {
            I(i) ? i.includes(c) ? i.splice(i.indexOf(c), 1) : i.push(c) : Reflect.set(e.data, c, C(c) ? !p : c);
          };
          (!i || i.length === 0) && r.hasAttribute("checked") && (o(r.value, !0), r.removeAttribute("checked")), r.addEventListener("change", (c) => {
            const { checked: p, value: g } = c == null ? void 0 : c.target;
            o(g, p);
          }), e.effect(() => {
            r = r;
            const c = m(e.data, n);
            c.includes(r.value) || r.value === c ? r.checked = !0 : r.checked = !1;
          });
          break;
        }
        case "radio": {
          r.hasAttribute("checked") && (r.removeAttribute("checked"), Object.assign(e.data, { [n]: r.value })), r.addEventListener("change", (i) => {
            const { checked: o, value: c } = i.target;
            o && Object.assign(e.data, { [c]: c });
          }), e.effect(() => {
            r = r;
            const i = m(e.data, n);
            r.checked = r.value === i;
          });
          break;
        }
        default:
          b(), r.addEventListener("input", (i) => {
            const o = i.target, c = o.value, p = u(c, Reflect.get(e.data, n));
            c !== p && (o.value = String(p)), Object.assign(e.data, { [n]: p });
          }), e.effect(() => r.value = m(e.data, n));
      }
      break;
    }
    case "SELECT": {
      r = r, b(), r.addEventListener("change", (i) => {
        const o = i.target.value;
        Object.assign(e.data, { [o]: o });
      }), e.effect(() => r.value = m(e.data, n));
      break;
    }
    case "DETAILS": {
      r = r;
      const i = r.attributes.getNamedItem("open"), o = m(e.data, n);
      r.open = C(o) ? i ?? !1 : o, r.addEventListener("toggle", (c) => {
        const p = c.target.open;
        Object.assign(e.data, { [n]: p });
      }), e.effect(() => r.open = m(e.data, n));
      break;
    }
  }
}, Z = function(e, t, { value: s, name: n }) {
  t.removeAttribute(n), t.removeAttribute("x-if");
  const [r, l, f] = s.split(/(?!\(.*)\s(?![^(]*?\))/g), a = t.parentElement, u = t.cloneNode(!0);
  t.remove();
  const b = () => {
    const d = u.cloneNode(!0), i = new R(d);
    return i.extend(e), { newEl: d, newCtx: i };
  }, h = (d, i) => {
    a == null || a.appendChild(d), W(i);
  };
  e.effect(() => {
    const d = m(e.data, f);
    if (typeof d == "number") {
      F(a);
      for (const i in Array.from({ length: d })) {
        const { newEl: o, newCtx: c } = b();
        Object.assign(c.data, { [r]: Number(i) }), h(o, c);
      }
    } else if (I(d)) {
      const [i, o] = r.replace("(", "").replace(")", "").split(","), c = i.trim(), p = o == null ? void 0 : o.trim();
      d.forEach((g, A) => {
        const { newEl: j, newCtx: y } = b();
        Object.assign(y.data, { [c]: g }), p && Object.assign(y.data, { [p]: Number(A) }), h(j, y);
      });
    } else if (w(d)) {
      const [i, o, c] = r.replace("(", "").replace(")", "").split(","), p = i.trim(), g = o == null ? void 0 : o.trim(), A = c == null ? void 0 : c.trim();
      Object.entries(d).forEach(([j, y], V) => {
        const { newEl: $, newCtx: O } = b();
        Object.assign(O.data, { [p]: y }), g && Object.assign(O.data, { [g]: j }), A && Object.assign(O.data, { [A]: Number(V) }), h($, O);
      });
    } else
      throw new TypeError("Unsupported value was used in 'x-for'. Please only use a number, array or an object");
  });
};
function W(e) {
  const t = document.createTreeWalker(e.root);
  let s = t.root;
  for (; s; ) {
    if (s.nodeType === 1) {
      const n = s;
      if (E(n, "x-skip") !== null) {
        s = t.nextSibling();
        continue;
      }
      ee(e, n);
    } else
      s.nodeType === 3 && te(e, s);
    s = t.nextNode();
  }
}
function ee(e, t) {
  for (const s of Array.from(t.attributes)) {
    if (s.name === "x-data" || s.name === "x-scope") {
      if (t.removeAttribute(s.name), s.name === "x-scope" && e.root !== t) {
        console.warn("Can not initialize a new scope within an existing scope");
        return;
      }
      try {
        if (!s.value)
          return;
        const n = m({}, s.value);
        if (!w(n))
          return;
        for (const r of Object.keys(n))
          Object.defineProperty(e.data, r, {
            value: n[r],
            writable: !0,
            enumerable: !0,
            configurable: !0
          });
      } catch (n) {
        console.warn("[x-scope/x-data] Error when processing attribute"), console.log(n);
      }
    }
    s.name === "x-for" ? Z(e, t, s) : s.name === "x-if" && X(e, t, s), s.name === "x-ref" && B(e, t, s), s.name.startsWith("x-model") && Y(e, t, s), (s.name.startsWith("x-bind") || s.name.startsWith(":")) && z(e, t, s), (s.name.startsWith("@") || s.name.startsWith("x-on")) && J(e, t, s), s.name === "x-text" && K(e, t, s), s.name === "x-class" && G(e, t, s), s.name === "x-html" && q(e, t, s), s.name === "x-style" && H(e, t, s), s.name === "x-show" && U(e, t, s), Object.keys(k).length > 0 && Object.entries(k).forEach(([n, r]) => {
      s.name.startsWith(n) && r(e, t, s);
    });
  }
}
function te(e, t) {
  if (!t.textContent || t.textContent === "")
    return;
  const s = t.textContent, n = new RegExp("(?=\\{\\{)(.*?)(?<=\\}\\})", "g"), r = s.match(n);
  !r || r.length === 0 || e.effect(() => {
    let l = s;
    for (const f of r) {
      const a = f.replace("{{", "").replace("}}", "");
      if (!a)
        continue;
      const u = m(e.data, a, t);
      l = l.replace(f, u);
    }
    t.textContent = l;
  });
}
const S = L({});
class se {
  constructor(t) {
    Object.assign(S, t);
  }
  directive(t, s) {
    return k[t] = s, this;
  }
  init() {
    const t = Array.from(document.querySelectorAll("[x-scope]"));
    for (const s of t)
      re(s);
  }
}
function ae(e) {
  return new se(e);
}
function re(e) {
  const t = new R(e);
  return e.setAttribute("style", "display:none;"), W(t), t.init = !0, e.removeAttribute("style"), { ctx: t };
}
export {
  ae as createApp,
  re as createScope
};
