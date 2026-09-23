import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { formatCurrency } from '../../../utils';
import { AccountingSummaryStack } from '../Manager/SideBar/AccountingSummaryStack';
import type { SummaryLineItem } from './mobileClosingSummary';
import { payTheShopHeroCents, takeHomeHeroCents } from './mobileClosingSummary';

export type SettlementTab = 0 | 1;

type SettlementPreviewDialogProps = {
    open: boolean;
    onClose: () => void;
    activeTab: SettlementTab;
    onTabChange: (tab: SettlementTab) => void;
    payTheShopItems: SummaryLineItem[];
    takeHomeItems: SummaryLineItem[];
};

/**
 * Driver read-only settlement preview (BAR-48). No Edit hours / Confirm CTAs —
 * manager still owns close + lock on desktop.
 */
export const SettlementPreviewDialog = ({
    open,
    onClose,
    activeTab,
    onTabChange,
    payTheShopItems,
    takeHomeItems,
}: SettlementPreviewDialogProps) => {
    const isPay = activeTab === 0;
    const items = isPay ? payTheShopItems : takeHomeItems;
    const heroCents = isPay ? payTheShopHeroCents(payTheShopItems) : takeHomeHeroCents(takeHomeItems);
    const heroLabel = isPay ? 'Pay the shop' : 'You take home';
    const heroHelper = isPay ? 'Closing payment' : 'After settle';

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>Close shift</DialogTitle>
            <DialogContent>
                <Stack spacing={2} alignItems="stretch">
                    <ButtonGroup fullWidth>
                        <Button
                            onClick={() => onTabChange(0)}
                            variant={isPay ? 'contained' : 'outlined'}
                            color="secondary">
                            Pay the shop
                        </Button>
                        <Button
                            onClick={() => onTabChange(1)}
                            variant={!isPay ? 'contained' : 'outlined'}
                            color="secondary">
                            Take home
                        </Button>
                    </ButtonGroup>

                    <Stack alignItems="center" spacing={0.25} py={1}>
                        <Typography variant="h4" fontWeight={700} fontVariantNumeric="tabular-nums">
                            {formatCurrency(heroCents)}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {heroLabel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {heroHelper}
                        </Typography>
                    </Stack>

                    <AccountingSummaryStack items={items} />
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
