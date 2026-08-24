import { decomposeColor } from '@mui/material';
import type { Drawer, Driver_Drawer, Order_Payment, OrderType } from './typesAndValidators';
import dayjs from 'dayjs';
import { cloneElement, isValidElement } from 'react';

export const isValidDrawer = (
    drawer: Drawer | Driver_Drawer | null,
    is_third_party: boolean,
    order_type: OrderType,
    driverDrawerID?: string,
) => {
    if (!drawer) {
        return true;
    }
    const { drawer_type } = drawer;

    if (driverDrawerID) {
        return drawer.drawer_id === driverDrawerID;
    }

    if (order_type === 'delivery' && drawer_type === 'driver') {
        return true;
    }
    if (order_type === 'pickup') {
        if (is_third_party && drawer_type === 'third_party') {
            return true;
        }
        if (!is_third_party && drawer_type === 'register') {
            return true;
        }
    }
    return false;
};

export const getDrawerFullName = (drawer: Drawer | Driver_Drawer | null) => {
    if (!drawer) {
        return '';
    }
    if ('driver' in drawer) {
        return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
    }
    return drawer.name;
};

export const formatCurrency = (cents: number, includePositiveSign = false) => {
    const sign = cents < 0 ? '-' : includePositiveSign ? '+' : '';
    return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
};

export const sortOrders = (a: Order_Payment, b: Order_Payment) => {
    // sort by order number first
    // then sort by order name
    if (a?.order_number) {
        if (b?.order_number) {
            return a.order_number - b.order_number;
        } else {
            return -1;
        }
    }

    if (b?.order_number) {
        return 1;
    }

    if (a?.order_name && b?.order_name) {
        return a.order_name.localeCompare(b.order_name);
    }
    return 0;
};

export const dayjsToMDY = (date: dayjs.Dayjs) => {
    const month = date.month() + 1;
    const day = date.date();
    const year = date.year();
    return { month, day, year };
};

export const getRunningTotal = (values: number[]) => {
    const runningTotal = [values[0]];
    for (let i = 1; i < values.length; i++) {
        const lastValue = runningTotal[i - 1];
        runningTotal.push(lastValue + values[i]);
    }
    return runningTotal;
};

export const nonZeroModulo = (a: number, b: number) => {
    const c = a % b;
    return c === 0 ? b : c;
};

export const getEnv = (variableName: string): string => {
    if (variableName === 'MODE') {
        return import.meta.env.MODE || (process.env.NODE_ENV as string);
    }
    return import.meta.env[variableName] || process.env[variableName];
};

export const devOnly = (child: React.ReactElement) => {
    if (getEnv('MODE') === 'development') {
        if (isValidElement(child)) {
            return cloneElement(child, {
                // @ts-expect-error ignore
                style: {
                    // @ts-expect-error ignore
                    ...child.props.style,
                    border: '2px solid red',
                },
            });
        }
        return child; // Return the child as is if not a valid element
    }
    return null;
};

export const urlToRoundedBase64 = (url: string, size = 200) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for CORS
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Set canvas size (adjust as needed)
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;

            // Create a circular clipping path
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            // Draw the image onto the canvas
            const smallerDimension = Math.min(img.width, img.height);
            const x = (img.width - smallerDimension) / 2;
            const y = (img.height - smallerDimension) / 2;
            ctx.drawImage(img, x, y, smallerDimension, smallerDimension, 0, 0, size, size);

            // Convert to base64
            const base64 = canvas.toDataURL('image/png');
            resolve(base64);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};

export const copyAndCleanLottie = (lottieJSON: unknown, layerName: string, shapeName: string, propPath: string) => {
    const copiedLottieData = JSON.parse(JSON.stringify(lottieJSON)); // Create a new object
    if (copiedLottieData.layers[0].nm === 'Group Layer 8') {
        copiedLottieData.layers.shift();
    }
    const primaryColor = '#008764';
    const decomposed = decomposeColor(primaryColor);
    const [r, g, b] = decomposed.values;

    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;
    return editLottieLayerProperty(copiedLottieData, layerName, shapeName, propPath, [
        normalizedR,
        normalizedG,
        normalizedB,
    ]) as unknown;
};

export const editLottieLayerProperty = (
    lottieJson: string,
    layerName: string,
    shapeName: string,
    propPath: string,
    newValue: unknown,
) => {
    const updatedJson = JSON.parse(JSON.stringify(lottieJson)); // Deep copy
    const layers = updatedJson.layers as { [key: string]: unknown }[];

    const targetLayer = layers.find((layer) => layer.nm === layerName);
    if (!targetLayer) {
        return lottieJson; // Return original if layer not found
    }
    let targetObject = targetLayer; // Start with the layer

    if (shapeName) {
        const shapes = targetLayer.shapes as { [key: string]: unknown }[];
        const targetShape = shapes?.find((shape) => shape.nm === shapeName);
        if (targetShape) {
            targetObject = targetShape; // If shapeName provided, target the shape
        } else {
            return lottieJson;
        }
    }

    const pathParts = propPath.split('.');
    let currentObj = targetObject;

    for (let i = 0; i < pathParts.length - 1; i++) {
        currentObj = currentObj[pathParts[i]] as { [key: string]: unknown };
        if (!currentObj) {
            return lottieJson;
        }
    }

    const lastProp = pathParts[pathParts.length - 1];
    // eslint-disable-next-line no-prototype-builtins
    if (currentObj && currentObj.hasOwnProperty(lastProp)) {
        currentObj[lastProp] = newValue;
    } else {
        return lottieJson;
    }

    return updatedJson;
};

export const capitalizeFirstWord = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
