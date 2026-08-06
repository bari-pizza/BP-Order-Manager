import React from 'react';

type LoggerProps = {
    message?: string;
    children: React.ReactNode;
};

export const Logger = ({ message, children }: LoggerProps) => {
    return <>{children}</>;
};
