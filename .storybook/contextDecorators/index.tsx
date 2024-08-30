import React from 'react';
import bariPizzaContextDecorators from './bariPizzaContextDecorators';

function createContextDecorator<T>(context: React.Context<T>, value: T) {
    const withContextDecorator = (storyFn: () => React.ReactNode) => {
        return <context.Provider value={value}>{storyFn()}</context.Provider>;
    };
    return withContextDecorator;
}

export { bariPizzaContextDecorators, createContextDecorator };
