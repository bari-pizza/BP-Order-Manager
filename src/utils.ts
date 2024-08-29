import { Drawer, DriverDrawer } from './typesAndValidators';
import dayjs from 'dayjs';

export const getDrawerFullName = (drawer: Drawer | DriverDrawer | null) => {
    if (!drawer) {
        return '';
    }
    if ('driver' in drawer) {
        return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
    }
    return drawer.name;
};

export const dayjsToMDY = (date: dayjs.Dayjs) => {
    const month = date.month() + 1;
    const day = date.date();
    const year = date.year();
    return { month, day, year };
};

interface DrawCircleProps {
    x: number;
    y: number;
    color?: string;
    width?: number;
}
export const drawCircle = ({ x, y, color = 'red', width = 2 }: DrawCircleProps) => {
    // Remove any previous circles
    const className = `circle-${color}`;
    const previousCircles = document.querySelectorAll(`.${className}`);
    previousCircles.forEach((circle) => circle.remove());
    console.log(`drawing ${color} circle at ${x}, ${y}`);

    // Create a new circle
    const circle = document.createElement('div');
    circle.className = className;
    circle.style.position = 'absolute';
    circle.style.left = `${x - 10}px`;
    circle.style.top = `${y - 10}px`;
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.borderRadius = '50%';
    circle.style.border = `${width}px solid ${color}`;
    circle.title = `${x.toFixed(2)}, ${y.toFixed(2)}`;
    document.body.appendChild(circle);
};

interface DrawLineProps {
    x: number;
    y: number;
    height: number;
    width: number;
    color?: string;
}

export const drawLine = ({ x, y, height, width, color = 'red' }: DrawLineProps) => {
    const className = `line-${color}`;
    const previousLefts = document.querySelectorAll(`.${className}`);
    previousLefts.forEach((left) => left.remove());
    const left = document.createElement('div');
    left.className = className;
    left.style.position = 'absolute';
    left.style.left = `${x}px`;
    left.style.top = `${y}px`;
    left.style.height = `${height}px`;
    left.style.width = `${width}px`;
    left.style.background = color;
    left.title = `${x.toFixed(2)}, ${y.toFixed(2)}`;
    document.body.appendChild(left);
};
