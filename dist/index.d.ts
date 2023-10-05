import { effect } from '@vue/reactivity';
import type { UnwrapNestedRefs } from '@vue/reactivity';

export declare class Beskydy<T extends object> {
    constructor(initialDataset: T);
    /**
     * Add a custom directive (element attribute)
     *
     * @param name Directive name, preferably should start with `x-`
     * @param fn Directive implementation
     */
    static defineDirective(name: string, fn: Directive): typeof Beskydy;
    /**
     * Add a custom `x-on` event modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    static defineEventModifier(name: string, fn: EventModifierFn): typeof Beskydy;
    /**
     * Add a custom `x-model` modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    static defineModelModifier(name: string, fn: ModelModifierFn): typeof Beskydy;
    /**
     * Initialize Beskydy. It starts by collecting all the scopes and initializing them
     */
    start(): void;
    teardown(): void;
}

declare class Context<R extends Element, T extends object> {
    root: Element;
    data: UnwrapNestedRefs<T & ContextData>;
    init: boolean;
    constructor(root: R, initialDataset?: T);
    effect: typeof effect;
    addRef(key: string, ref: Element): void;
    extend(ctx: ContextAny): void;
    teardown(): void;
}

declare type ContextAny = Context<Element, object>;

/**
 * Piece of DOM which holds its own state.
 */
declare type ContextData = typeof globalState & {
    $refs: Record<string, Element>;
};

export declare function createApp<T extends object>(init?: T): Beskydy<{}>;

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
