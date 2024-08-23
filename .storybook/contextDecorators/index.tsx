import businessDayContextDecorators from './businessDayContextDecorators';

function createContextDecorator<T>(context: React.Context<T>, value: T) {
    const withContextDecorator = (storyFn: () => React.ReactNode) => {
        return <context.Provider value={value}>{storyFn()}</context.Provider>;
    };
    return withContextDecorator;
}

export { businessDayContextDecorators, createContextDecorator };
