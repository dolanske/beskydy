import { effect } from '@vue/reactivity';
import type { UnwrapNestedRefs } from '@vue/reactivity';

declare class App<T extends object> {
    constructor(initialDataset: T);
    directive(name: string, fn: Directive): this;
    init(): void;
}

declare class Context<R extends Element, T extends object> {
    root: Element;
    data: UnwrapNestedRefs<T & ContextData>;
    init: boolean;
    constructor(root: R, initialDataset?: T);
    effect: typeof effect;
    addRef(key: string, ref: Element): void;
    extend(ctx: ContextAny): void;
}

declare type ContextAny = Context<Element, object>;

/**
 * Piece of DOM which holds its own state.
 */
declare type ContextData = typeof globalState & {
    $refs: Record<string, Element>;
};

export declare function createApp<T extends object>(init: T): App<T>;

export declare function createScope(scopeRoot: Element): {
    ctx: Context<Element, object>;
};

declare type Directive = (ctx: ContextAny, node: Element, attr: Attr) => void;

declare const globalState: {};

export { }
