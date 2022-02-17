import Chain, { StringObj, ResultObject, TypeStruct, Callback } from './chain';
import { methodKey } from './methods';
import { Validator } from './validator';
declare type ResultArray = [(string | number)[], (string | number)[], string[], (string | number)[]?, [Callback?, Callback?]?];
interface Obj {
    [key: string]: any;
}
export declare function getMsgTemplate(key: methodKey, chainMsg?: StringObj): string;
export declare function msgTemplateToMsg(message: string, key: methodKey, name1?: string, name2?: (string | StringObj)[], allArgs?: string[]): string;
export declare function checkResult(results: (boolean | ResultObject)[]): boolean;
export declare function checkResult2(results: (boolean | ResultObject)[]): any;
export declare const argsToString: (value: any, args?: any[] | undefined) => string[];
export declare const addMsg: (errMsgs: string[], chain: Chain, key: methodKey, allArgs?: string[] | undefined) => void;
export declare function resultToBoolean(results: ResultArray, context?: TypeStruct, getResult?: boolean): boolean | ResultObject;
export declare function collectChains(struct: TypeStruct, path: (string | number)[]): [Chain, (string | number)[]][];
export declare function findValue(obj: Obj, path: (string | number)[]): any;
export declare function check(value: any, struct: TypeStruct, parentPath?: (string | number)[], getResult?: boolean): boolean | Promise<boolean> | Validator<Chain>;
export {};
//# sourceMappingURL=utils.d.ts.map