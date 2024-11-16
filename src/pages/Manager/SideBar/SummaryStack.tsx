import { Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatCurrency, getRunningTotal } from '../../../utils';

export const SummaryStack = ({ items }: { items: { label: string; value: number }[] }) => {
    const values = items.map((item) => item.value);
    const runningTotals = getRunningTotal(values);
    return (
        <Stack direction="column" spacing={1} margin="auto">
            {items.map((item, index) => (
                <Fragment key={item.label}>
                    <Stack direction="row" justifyContent="right" spacing={2}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.label}:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(item.value, index > 0)}
                            {/* ${(item.value / 100).toFixed(2)} */}
                        </Typography>
                    </Stack>
                    {index > 0 && (item.value !== 0 || index === items.length - 1) && (
                        <>
                            <Divider />
                            <Stack direction="row" justifyContent="right">
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: index === items.length - 1 ? 'bold' : '' }}>
                                    {formatCurrency(runningTotals[index])}
                                    {/* ${(runningTotals[index] / 100).toFixed(2)} */}
                                </Typography>
                            </Stack>
                        </>
                    )}
                </Fragment>
            ))}
        </Stack>
    );
};
