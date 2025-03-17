declare module '../paraglide/messages.js' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type MessageFunction = (...args: any[]) => string;
    const m: { [key: string]: MessageFunction };
    export = m;
}
