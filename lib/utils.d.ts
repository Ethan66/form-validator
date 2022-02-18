import Chain, { StringObj, ResultObject, TypeStruct, Callback } from './chain';
import { methodKey } from './methods';
declare type ResultArray = [(string | number)[], (string | number)[], string[], (string | number)[]?, [Callback?, Callback?]?];
export declare type ValidateFnResult = {
    _then: boolean;
    _catchResult: ResultObject[];
    then(fn: (result: boolean) => any): ValidateFnResult;
    catch(fn: (result: ResultObject[]) => any): ValidateFnResult;
};
interface Obj {
    [key: string]: any;
}
export declare function getMsgTemplate(key: methodKey, chainMsg?: StringObj): string;
export declare function msgTemplateToMsg(message: string, key: methodKey, name1?: string, name2?: (string | StringObj)[], allArgs?: string[]): string;
export declare function checkResult(results: (boolean | ResultObject)[]): boolean;
export declare function checkResult2(results: (boolean | ResultObject)[]): ValidateFnResult;
export declare const argsToString: (value: any, args?: any[] | undefined) => string[];
export declare const addMsg: (errMsgs: string[], chain: Chain, key: methodKey, allArgs?: string[] | undefined) => void;
export declare function resultToBoolean(results: ResultArray, context?: TypeStruct, getResult?: boolean): boolean | ResultObject;
export declare function collectChains(struct: TypeStruct, path: (string | number)[]): [Chain, (string | number)[]][];
export declare function findValue(obj: Obj, path: (string | number)[]): any;
export declare function check(data: string | number | boolean | null | undefined, struct: TypeStruct): boolean | Promise<boolean>;
export declare function check(data: object, struct: TypeStruct, parentPath?: (string | number)[], getResult?: boolean): ValidateFnResult;
export {};
//# sourceMappingURL=utils.d.ts.map