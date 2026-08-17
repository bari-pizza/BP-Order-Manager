/* eslint-disable @typescript-eslint/no-explicit-any */
import { Id as originalId, toast as originalToast, UpdateOptions } from 'react-toastify';
const capitalizeFirstLetter = (message: any) => {
    if (typeof message === 'string') {
        return message.charAt(0).toUpperCase() + message.slice(1);
    } else {
        return message;
    }
};

export type Id = originalId;

export const toast = {
    info: (message: any, options?: any) => {
        const newMessage = capitalizeFirstLetter(message);
        originalToast.info(newMessage, options);
    },
    error: (message: any, options?: any) => {
        const newMessage = capitalizeFirstLetter(message);
        originalToast.error(newMessage, options);
    },
    success: (message: any, options?: any) => {
        const newMessage = capitalizeFirstLetter(message);
        originalToast.success(newMessage, options);
    },
    loading: (message: any, options?: any) => {
        const newMessage = capitalizeFirstLetter(message);
        return originalToast.loading(newMessage, options);
    },
    update: (toastId: Id, options?: UpdateOptions) => {
        if (options && options.render) {
            const { render } = options;
            const newRender = capitalizeFirstLetter(render);
            originalToast.update(toastId, { ...options, render: newRender });
        } else {
            originalToast.update(toastId, options);
        }
    },
    dismiss: (toastId: Id) => {
        originalToast.dismiss(toastId);
    },
    isActive: (toastId: Id) => originalToast.isActive(toastId),
    show: (message: any, options?: any) => {
        const newMessage = capitalizeFirstLetter(message);
        return originalToast(newMessage, options);
    },
    promise: (promise: any, options?: any) => {
        return originalToast.promise(promise, options);
    },
};
