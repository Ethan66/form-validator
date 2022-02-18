import Chain, { TypeStruct } from './chain';
import { ValidateFnResult } from './utils';
export interface Validator<T> {
    readonly str: T;
    readonly num: T;
    readonly obj: T;
    readonly arr: T;
    readonly boolean: T;
    readonly any: T;
    judge(data: string | number | boolean | null | undefined, struct: T): boolean | Promise<boolean>;
    judge(data: object, struct: TypeStruct): boolean | Promise<boolean>;
    judge(data: any, struct: TypeStruct): boolean | Promise<boolean>;
    validate(data: any, struct: TypeStruct): ValidateFnResult;
    valid(data: string | number | boolean | null | undefined): T;
    valid(data: string | number | boolean | null | undefined, path: string | (string | number)[]): T;
    get(obj: Obj, path: string | (string | number)[]): any;
}
interface Obj {
    [key: string]: any;
}
declare const validator: Validator<Chain>;
export default validator;
//# sourceMappingURL=validator.d.ts.map