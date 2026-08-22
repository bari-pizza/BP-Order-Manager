import { Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatCurrency, getRunningTotal } from '../../../utils';
import { CashTransfer } from '../../../typesAndValidators';
import { useBariPizzaContext, useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { InfoPopover } from '../../../rickcedlib/components/InfoPopover';

interface SummaryStackProps {
    items: { label: string; value: number; details?: string }[];
}

interface SummaryDetailsProps extends SummaryStackProps {
    transfers: CashTransfer[];
    drawerID: string;
    forSideBar?: boolean;
}

export const SummaryStack = ({ items }: SummaryStackProps) => {
    const values = items.map((item) => item.value);
    const runningTotals = getRunningTotal(values);
    return (
        <Stack
            className="summary-stack"
            direction="column"
            spacing={1}
            margin="auto"
            maxWidth="50%"
            minWidth="250px"
            justifyContent={'right'}>
            {items.map((item, index) => (
                <Fragment key={item.label}>
                    <Stack direction="row" justifyContent="right" spacing={2}>
                        {item.details && (
                            <InfoPopover
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                <Typography variant="body1">{item.details}</Typography>
                            </InfoPopover>
                        )}
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.label}:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(item.value, index > 0)}
                        </Typography>
                    </Stack>
                    {index > 0 && (item.value !== 0 || index === items.length - 1) && (
                        <>
                            <Divider />
                            <Stack direction="row" justifyContent="right">
                                <Typography
                                    variant="body1"
                                    data-testid={index === items.length - 1 ? 'drawer-outstanding-total' : undefined}
                                    sx={{ fontWeight: index === items.length - 1 ? 'bold' : '' }}>
                                    {formatCurrency(runningTotals[index])}
                                </Typography>
                            </Stack>
                        </>
                    )}
                </Fragment>
            ))}
        </Stack>
    );
};

const getToFromSpentReceived = (cashTransfer: CashTransfer, drawerID: string) => {
    const toFromSpentReceived =
        cashTransfer.source === drawerID
            ? cashTransfer.destination
                ? 'to'
                : 'spent'
            : cashTransfer.source
              ? 'from'
              : 'received';
    return toFromSpentReceived;
};

export const SummaryDetails = ({ items, transfers, drawerID, forSideBar }: SummaryDetailsProps) => {
    const { drawers, drivers } = useManagerDashboardContext();
    const getDrawer = (drawerID: string | null) => {
        return (
            drawers.all.find((drawer) => drawer.drawer_id === drawerID) ||
            drivers.todays.find((driver) => driver.drawer_id === drawerID)
        );
    };
    // to: destination -30
    // from: source +30
    // spent: title -30
    // received: title +30
    let netCashTransferred = 0;
    const transferStack = (
        <Stack className="transfer-stack" direction="column" spacing={1} maxWidth="50%" minWidth="250px">
            {transfers.map((transfer) => {
                const tfsr = getToFromSpentReceived(transfer, drawerID);
                const sign = ['to', 'spent'].includes(tfsr) ? '-' : '+';
                netCashTransferred += (sign === '+' ? 1 : -1) * transfer.amount_in_cents;
                return (
                    <Stack direction="row" justifyContent="space-between" spacing={2} key={transfer.cash_transfer_id}>
                        <Typography variant="body1">
                            {tfsr === 'to'
                                ? getDrawer(transfer.destination)?.name
                                : tfsr === 'from'
                                  ? getDrawer(transfer.source)?.name
                                  : transfer.title}
                        </Typography>
                        <Typography variant="body1">{sign + formatCurrency(transfer.amount_in_cents)}</Typography>
                    </Stack>
                );
            })}
            {transfers.length > 0 ? (
                <>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body1">Net Cash Transferred: </Typography>
                        <Typography variant="body1">{formatCurrency(netCashTransferred)}</Typography>
                    </Stack>
                </>
            ) : (
                <div></div> // for spacing
            )}
        </Stack>
    );

    let expectedCash = netCashTransferred;

    const itemStack = (
        <Stack className="item-stack" direction="column" spacing={1} maxWidth="50%" minWidth="250px">
            {items.map((item) => {
                if (['Starting Cash', 'Cash Orders'].includes(item.label)) expectedCash += item.value;
                return (
                    <Stack direction="row" justifyContent="space-between" spacing={2} key={item.label}>
                        <Typography variant="body1">{item.label}:</Typography>
                        <Typography variant="body1">{formatCurrency(item.value)}</Typography>
                    </Stack>
                );
            })}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Net Cash Transferred: </Typography>
                <Typography variant="body1">{formatCurrency(netCashTransferred)}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Expected Cash:</Typography>
                <Typography variant="body1">{formatCurrency(expectedCash)}</Typography>
            </Stack>
        </Stack>
    );

    return (
        <Stack
            className="summary-details"
            direction={forSideBar ? 'column' : 'row'}
            justifyContent={forSideBar ? 'center' : 'space-between'}
            alignItems={forSideBar ? 'center' : 'normal'}
            spacing={2}
            sx={{
                flexWrap: 'wrap', // Allow wrapping when space is insufficient
            }}>
            {transferStack}
            {itemStack}
        </Stack>
    );
};

export type ThirdPartySummary = Record<string, { total_in_cents: number }>;

export const ThirdPartySummary = ({ thirdPartySummary }: { thirdPartySummary: ThirdPartySummary }) => {
    const { origins } = useBariPizzaContext();
    if (Object.keys(thirdPartySummary).length === 0)
        return <Typography variant="body1">No Third Party Orders Found</Typography>;
    return (
        <Stack className="third-party-summary" direction="column" spacing={2}>
            {Object.entries(thirdPartySummary).map(([drawerID, { total_in_cents }]) => {
                const origin = origins.find((origin) => origin.origin_id === drawerID);
                return (
                    <Stack direction="row" spacing={1} key={drawerID} justifyContent="space-between">
                        <Typography variant="body1">{origin?.name}</Typography>
                        <Typography variant="body1">{formatCurrency(total_in_cents)}</Typography>
                    </Stack>
                );
            })}
        </Stack>
    );
};
