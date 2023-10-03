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
    defineEventModifier(name: string, fn: EventModifierFn): this;
    /**
     * Add a custom `x-model` modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    defineModelModifier(name: string, fn: ModelModifierFn): this;
    /**
     * Initialize Beskydy. It starts by collecting all the scopes and initializing them
     */
    start(): void;
}

export declare function Beskydy<T extends object>(init?: T): App<{}>;

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

export declare function createScope(scopeRoot: Element): {
    ctx: Context<Element, object>;
};

export declare type Directive<T = void> = (ctx: ContextAny, node: Element, attr: Attr) => T;

export declare type EventModifierFn = (e: Event, state: ModifierListenerState, parameter: Primitive) => boolean;

declare const globalState: {};

export declare type ModelModifierFn = (value: string, oldValue: string, param?: unknown) => unknown;

declare interface ModifierListenerState {
    calledTimes: number;
    lastCall: number;
}

export declare type Primitive = string | number | null | undefined | boolean;

export { }
