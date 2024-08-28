type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: string | Error | unknown) => void;

interface PromiseConstructor {
    withResolvers<T>(): {
        promise: Promise<T>;
        // resolve: (value?: T | PromiseLike<T>) => void;
        // reject: (reason?: string | Error) => void;
        resolve: Resolve<T>;
        reject: Reject;
    };
}
