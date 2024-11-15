import type { Directive } from './directives/directives';
import type { EventModifierFn } from './directives/directives';
import type { Primitive } from './directives/directives';
import type { UnwrapNestedRefs } from '@vue/reactivity';

export declare class Beskydy<T extends object> {
    modelModifiers: Record<string, ModelModifierFn>;
    eventModifiers: Record<string, EventModifierFn>;
    customDirectives: Record<string, Directive>;
    delimiters: {
        start: string;
        end: string;
        re: RegExp;
    };
    private scopes;
    rootState: UnwrapNestedRefs<T>;
    private onInitCbs;
    private onTeardownCbs;
    constructor(initialDataset?: T);
    /**
     * Define the way Beskydy will compile the delimiters {{ }} into a reactive part of a string.
     * Delimiters contain text, which usually contains an expression. Think of it was as javascript being executed within a string when it is wrapped in the delimiters {{ }}
     *
     *
     * @param start Starting delimiter
     * @param end Ending delimiter
     */
    setDelimiters(start: string, end: string): void;
    /**
     * Add a custom directive (element attribute)
     *
     * @param name Directive name, preferably should start with `x-`
     * @param fn Directive implementation
     */
    defineDirective(name: string, fn: Directive): void;
    /**
     * Add a custom `x-on` event modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    defineEventModifier(name: string, fn: EventModifierFn): void;
    /**
     * Add a custom `x-model` modifier
     *
     * @param name Modifier name
     * @param fn Modifier implementation
     */
    defineModelModifier(name: string, fn: ModelModifierFn): void;
    /**
     *  Initialize Beskydy. It starts by collecting all the scope elements
     *  and creating a context for each.
     *
     * @param selector Custom attribute selector. Defaults to 'x-scope'
     */
    collect(selector?: string): void;
    /**
     * Registers a function which runs when app is fully initialized
     */
    onInit(fn: Cb): void;
    /**
     * Registers a callback which runs after application has been shut down
     */
    onTeardown(fn: Cb): void;
    /**
     *   Stops Beskydy instance, removes reactivity and event listeners
     *   and leaves the DOM in the state it was when the app was torn down.
     */
    teardown(): void;
}

declare type Cb = () => void;

export { Directive }

export { EventModifierFn }

export declare type ModelModifierFn = (value: string, oldValue: string, param?: any) => unknown;

export { Primitive }

export { }
