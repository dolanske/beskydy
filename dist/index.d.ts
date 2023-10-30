import type { ReactiveEffectRunner } from '@vue/reactivity';
import type { UnwrapNestedRefs } from '@vue/reactivity';

export declare class Beskydy<T extends object> {
    constructor(initialDataset: T);
    /**
     * Initialize Beskydy. It starts by collecting all the scopes and initializing them
     */
    init(): void;
    /**
     * Stops Beskydy instance, removes reactivity and event listeners and leaves the DOM in the state it was when the app was torn down./
     */
    teardown(): void;
}

declare class Context<R extends Element, T extends object> {
    root: Element;
    data: UnwrapNestedRefs<T & ContextData>;
    init: boolean;
    effects: ReactiveEffectRunner[];
    constructor(root: R, initialDataset?: T);
    effect(fn: () => any): void;
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

/**
 * Add a custom directive (element attribute)
 *
 * @param name Directive name, preferably should start with `x-`
 * @param fn Directive implementation
 */
export declare function defineDirective(name: string, fn: Directive): void;

/**
 * Add a custom `x-on` event modifier
 *
 * @param name Modifier name
 * @param fn Modifier implementation
 */
export declare function defineEventModifier(name: string, fn: EventModifierFn): void;

/**
 * Add a custom `x-model` modifier
 *
 * @param name Modifier name
 * @param fn Modifier implementation
 */
export declare function defineModelModifier(name: string, fn: ModelModifierFn): void;

export declare type Directive<T = void> = (ctx: ContextAny, node: Element, attr: Attr) => T;

export declare type EventModifierFn = (e: Event, state: ModifierListenerState, parameter: Primitive) => boolean;

/**
 * Shared global state between all scopes.
 *
 * Extend ugins `Object.assign(globalState, { ...yourProperties })`
 */
export declare const globalState: {};

export declare type ModelModifierFn = (value: string, oldValue: string, param?: unknown) => unknown;

declare interface ModifierListenerState {
    calledTimes: number;
    lastCall: number;
}

export declare type Primitive = string | number | null | undefined | boolean;

/**
 * Define the way Beskydy will compile the delimiters {{ }} into a reactive part of a string.
 * Delimiters contain text, which usually contains an expression. Think of it was as javascript being executed within a string when it is wrapped in the delimiters {{ }}
 *
 *
 * @param start Starting delimiter
 * @param end Ending delimiter
 */
export declare function setDelimiters(start: string, end: string): void;

export { }
