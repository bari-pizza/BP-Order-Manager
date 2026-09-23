import { Box, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatCurrency, getRunningTotal } from '../../../utils';
import { InfoPopover } from '../../../rickcedlib/components/InfoPopover';
import type { SummaryLineItem } from '../../Orders/mobileClosingSummary';

const AMOUNT_COL_WIDTH = '4.75rem';

/**
 * Unlabeled accounting columns: label | debit (+) | credit (−) | running total.
 * Positive step amounts sit in debit; negative in credit; zero leaves both blank.
 */
export const AccountingSummaryStack = ({ items }: { items: SummaryLineItem[] }) => {
    const values = items.map((item) => item.value);
    const runningTotals = getRunningTotal(values);

    return (
        <Stack className="accounting-summary-stack" direction="column" spacing={0.75} sx={{ width: '100%', px: 1 }}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const debit = item.value > 0 ? formatCurrency(item.value, true) : '';
                const credit = item.value < 0 ? formatCurrency(item.value, true) : '';

                return (
                    <Fragment key={item.label}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: `minmax(0, 1fr) ${AMOUNT_COL_WIDTH} ${AMOUNT_COL_WIDTH} ${AMOUNT_COL_WIDTH}`,
                                columnGap: 1,
                                alignItems: 'baseline',
                            }}>
                            <Stack direction="row" spacing={0.5} alignItems="center" minWidth={0}>
                                {item.details && (
                                    <InfoPopover
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                        <Typography variant="body2">{item.details}</Typography>
                                    </InfoPopover>
                                )}
                                <Typography variant="body1" fontWeight={600} noWrap>
                                    {item.label}
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body1"
                                fontWeight={600}
                                textAlign="right"
                                sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                {debit}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontWeight={600}
                                textAlign="right"
                                sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                {credit}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontWeight={isLast ? 700 : 600}
                                textAlign="right"
                                sx={{ fontVariantNumeric: 'tabular-nums' }}
                                data-testid={isLast ? 'settlement-running-total' : undefined}>
                                {formatCurrency(runningTotals[index] ?? 0)}
                            </Typography>
                        </Box>
                    </Fragment>
                );
            })}
        </Stack>
    );
};
