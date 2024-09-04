import { MenuItem, Slider, Stack, TextField } from '@mui/material';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { LineChart } from '@mui/x-charts';
import { MutableRefObject, useState } from 'react';
import { Portal } from '@mui/base';

interface WindowSelectorProps {
    range: [number, number];
    setRange: (range: [number, number]) => void;
    scale: number;
}

const WindowSelector = ({ range, setRange, scale = 100 }: WindowSelectorProps) => {
    const handleChange = (newValue: number | number[]) => {
        setRange([((newValue as number[])[0] * scale) / 100, ((newValue as number[])[1] * scale) / 100]);
    };

    const marks = [
        { value: 0, label: '12am' },
        { value: (6 / 24) * 100, label: '6am' },
        { value: (11 / 24) * 100, label: '11am' },
        { value: (18 / 24) * 100, label: '6pm' },
        { value: (23 / 24) * 100, label: '11pm' },
    ];

    const valuetext = (value: number) => {
        const hours = Math.floor(value / 60);
        const minutes = Math.floor((value % 60) * 60);
        const amPM = hours >= 12 ? 'pm' : 'am';
        return `${hours % 12}:${minutes}${amPM}`;
    };

    const scaledRange = [(range[0] * 100) / scale, (range[1] * 100) / scale];

    return (
        <Slider
            aria-label="Custom marks"
            getAriaLabel={valuetext}
            getAriaValueText={valuetext}
            value={scaledRange}
            step={100 / scale}
            onChange={(_, newValue) => handleChange(newValue)}
            valueLabelDisplay="off"
            marks={marks}
        />
    );
};

interface PeriodSelectorProps {
    periodMinutes: number;
    setPeriodMinutes: (value: number) => void;
}

const PeriodSelector = ({ periodMinutes, setPeriodMinutes }: PeriodSelectorProps) => {
    const options = [
        { value: 5, label: '5 minutes' },
        { value: 10, label: '10 minutes' },
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
    ];

    return (
        <TextField
            id="outlined-select-currency"
            select
            label="Group by"
            value={periodMinutes}
            onChange={(e) => setPeriodMinutes(Number(e.target.value))}
            helperText="Please select interval width">
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export const SalesVsTimeChart = ({ portalContainer }: { portalContainer: MutableRefObject<HTMLDivElement | null> }) => {
    const { orders } = useManagerDashboardContext();

    const [periodMinutes, setPeriodMinutes] = useState(30);
    const [range, setRange] = useState<[number, number]>([11, 24]);

    const ordersByPeriod: Record<number, { total: number }> = {};

    orders.all.forEach((order) => {
        const orderTime = new Date(order.created_at);
        const orderTotalInCents = order.total_in_cents;
        const periodStart =
            Math.floor((orderTime.getHours() * 60 + orderTime.getMinutes()) / periodMinutes) * periodMinutes;

        // ordersByPeriod[periodStart] = (ordersByPeriod[periodStart] || 0) + 1;
        ordersByPeriod[periodStart] = ordersByPeriod[periodStart] || { total: 0 };
        ordersByPeriod[periodStart].total += orderTotalInCents;
    });

    const periods = Object.keys(ordersByPeriod).map(Number);
    const totals = Object.values(ordersByPeriod).map((obj) => obj.total);

    const periodToTime = (period: number) => {
        const hour = Math.floor(period / 60);
        const minute = (period % 60).toString().padStart(2, '0');
        const amPM = hour >= 12 ? 'PM' : 'AM';
        return `${hour % 12}:${minute} ${amPM}`;
    };

    const centsToDollars = (cents: number | null) => {
        if (!cents) {
            return '$0.00';
        }
        return `$${(cents / 100).toFixed(2)}`;
    };

    const xMin = range[0] * 60;
    const xMax = range[1] * 60;

    return (
        <>
            <LineChart
                xAxis={[
                    {
                        data: periods,
                        valueFormatter: (value) => periodToTime(value),
                        min: xMin,
                        max: xMax,
                        tickLabelInterval: (value) => value % 15 === 0,
                        id: 'x-axis-id',
                    },
                ]}
                series={[
                    {
                        data: totals,
                        area: true,
                        type: 'line',
                        baseline: 0,
                        yAxisId: 'leftAxisId',
                        valueFormatter: centsToDollars,
                    },
                ]}
                yAxis={[{ id: 'leftAxisId', valueFormatter: centsToDollars }]}
                height={400}
                width={400}
            />
            <Portal container={portalContainer?.current}>
                <Stack direction="column" m={2} gap={2} p={2}>
                    <PeriodSelector periodMinutes={periodMinutes} setPeriodMinutes={setPeriodMinutes} />
                    <WindowSelector range={range} setRange={setRange} scale={24} />
                </Stack>
            </Portal>
        </>
        // </Stack>
    );
};
