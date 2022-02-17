import methods, { methodKey } from './methods';
export interface Method {
    (...values: any[]): boolean;
}
export interface AsyncMethod {
    (...values: any[]): Promise<boolean>;
}
export interface StructObject {
    [key: string]: TypeStruct;
}
export declare type TypeStruct = StructObject | (StructObject | undefined)[] | Chain | (Chain | undefined)[];
export declare type StringObj = {
    [key in keyof typeof methods]?: string;
};
export interface ResultObject {
    keys: (string | number)[];
    msgs?: string[];
    path?: (string | number)[];
}
export interface Callback {
    (result: ResultObject): any;
}
interface Chain {
    readonly required: this;
    readonly english: this;
    readonly alphanum: this;
    readonly chinese: this;
    readonly nospace: this;
    readonly float: this;
    readonly positivefloat: this;
    readonly integer: this;
    readonly positiveint: this;
    readonly decimal: this;
    readonly percent: this;
    readonly email: this;
    readonly http: this;
    readonly phone: this;
    readonly year: this;
    readonly month: this;
    readonly day: this;
    readonly hour: this;
    readonly minute: this;
    readonly hmt: this;
    readonly time: this;
    readonly date: this;
    readonly datetime: this;
    readonly path: this;
    readonly file: this;
    readonly imgurl: this;
    readonly obj: this;
    readonly boolean: this;
    readonly str: this;
    readonly num: this;
    readonly arr: this;
    readonly empty: this;
    eq(value: any): this;
    not(value: any): this;
    gt(value: string | number | Date): this;
    has(value: any): this;
    gte(value: string | number | Date): this;
    lt(value: string | number | Date): this;
    lte(value: string | number | Date): this;
    len(value: string | number): this;
    min(value: string | number): this;
    max(value: string | number): this;
    reg(val: RegExp): this;
    ext(value: string): this;
    enum(val: any, ...vals: any[]): this;
    between(val1: string | number | Date, val2: string | number | Date): this;
}
declare class Chain {
    _val: string | number | boolean | null | undefined;
    _then: boolean;
    _catchParams: ResultObject;
    _types: (methodKey | [methodKey, any])[];
    _handler: [Callback?, Callback?];
    _msgs: StringObj | undefined;
    _customs: ['sync' | 'async', Method | AsyncMethod, any[]?][];
    _names: [string?, (string | StringObj)[]?];
    isAsync: boolean;
    get any(): this;
    define(method: Method, ...args: any[]): this;
    async(method: AsyncMethod): this;
    then(fn: Callback): this;
    catch(fn: Callback): void;
    alias(n: string, names?: string | StringObj): this;
    msg(key: keyof typeof methods, info: string): this;
    msg(msgs: StringObj): this;
}
export default Chain;
//# sourceMappingURL=chain.d.ts.map