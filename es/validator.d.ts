import Chain, { TypeStruct, ResultObject } from './chain';
export interface Validator<T> {
    readonly str: T;
    readonly num: T;
    readonly obj: T;
    readonly arr: T;
    readonly boolean: T;
    readonly any: T;
    _then: boolean;
    _catchResult: ResultObject[];
    judge(data: string | number | boolean | null | undefined, struct: T): boolean | Promise<boolean> | Validator<T>;
    judge(data: object, struct: TypeStruct): boolean | Promise<boolean> | Validator<T>;
    judge(data: any, struct: TypeStruct): boolean | Promise<boolean> | Validator<T>;
    validate(data: any, struct: TypeStruct): Validator<T>;
    valid(data: string | number | boolean | null | undefined): T;
    valid(data: string | number | boolean | null | undefined, path: string | (string | number)[]): T;
    get(obj: Obj, path: string | (string | number)[]): any;
    then(fn: (result: boolean) => any): Validator<T>;
    catch(fn: (result: ResultObject[]) => any): Validator<T>;
}
interface Obj {
    [key: string]: any;
}
declare const validator: Validator<Chain>;
export default validator;
//# sourceMappingURL=validator.d.ts.map