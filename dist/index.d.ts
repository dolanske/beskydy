import { effect } from '@vue/reactivity';
import type { UnwrapNestedRefs } from '@vue/reactivity';

declare class App<T extends object> {
    constructor(initialDataset: T);
    /**
     * Add a custom directive (element attribute)
     *
     * @param name Directive name, preferably should start with `x-`
     * @param fn Directive implementation
     */
    defineDirective(name: string, fn: Directive): this;
    /**
     * Add a custom `x-on` event modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    defineEventModifier(name: string, fn: ModifierFn): this;
    /**
     * Add a custom `x-model` modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    defineModelModifier(name: string, fn: ModelModifier): this;
    /**
     * Initialize Beskydy. It starts by collecting all the scopes and initializing them
     */
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

export declare function createApp<T extends object>(init?: T): App<{}>;

export declare function createScope(scopeRoot: Element): {
    ctx: Context<Element, object>;
};

declare type Directive = (ctx: ContextAny, node: Element, attr: Attr) => void;

declare const globalState: {};

declare type ModelModifier = (value: string, oldValue: string, param?: unknown) => unknown;

declare type ModifierFn = (e: Event, state: ModifierListenerState, parameter: Primitive) => boolean;

declare interface ModifierListenerState {
    calledTimes: number;
    lastCall: number;
}

declare type Primitive = string | number | null | undefined | boolean;

export { }
