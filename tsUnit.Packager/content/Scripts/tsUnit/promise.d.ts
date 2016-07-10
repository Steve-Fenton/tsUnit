interface IThenable<T> {
    then<R, X>(onSuccess: (t: T) => R | IThenable<R>, onFailure: (err: any) => X): IThenable<R | X>;
}
declare class Promise<T> implements IThenable<T> {
    then<R, X>(onSuccess: (t: T) => R | IThenable<R>, onFailure: (err: any) => X): Promise<R | X>;
    then<R>(onSuccess: (t: T) => R | IThenable<R>): Promise<R>;
    static resolve<R>(r: R): Promise<R>;
    static resolve(): Promise<any>;
}
