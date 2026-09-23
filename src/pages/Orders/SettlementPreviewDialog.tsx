import { Dialog, DialogContent, DialogTitle, Stack, Tab, Tabs, Typography } from '@mui/material';
import { formatCurrency } from '../../utils';
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
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>Close shift</DialogTitle>
            <DialogContent>
                <Stack spacing={2} alignItems="stretch">
                    <Tabs value={activeTab} onChange={(_event, tab: SettlementTab) => onTabChange(tab)} variant="fullWidth" aria-label="Settlement summary">
                        <Tab label="Pay the shop" id="settlement-tab-pay" aria-controls="settlement-panel-pay" />
                        <Tab label="Take home" id="settlement-tab-home" aria-controls="settlement-panel-home" />
                    </Tabs>

                    {([0, 1] as const).map((tab) => {
                        const isPay = tab === 0;
                        const items = isPay ? payTheShopItems : takeHomeItems;
                        const heroCents = isPay ? payTheShopHeroCents(items) : takeHomeHeroCents(items);
                        const heroLabel = isPay
                            ? heroCents > 0
                                ? 'Shop pays the driver'
                                : heroCents < 0
                                  ? 'Driver pays the shop'
                                  : 'No payment due'
                            : 'You take home';
                        const panelName = isPay ? 'pay' : 'home';

                        return (
                            <div
                                key={tab}
                                role="tabpanel"
                                id={`settlement-panel-${panelName}`}
                                aria-labelledby={`settlement-tab-${panelName}`}
                                hidden={activeTab !== tab}>
                                {activeTab === tab && (
                                    <Stack spacing={2}>
                                        <Stack alignItems="center" spacing={0.25} py={1}>
                                            <Typography variant="h4" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                                {formatCurrency(heroCents)}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {heroLabel}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {isPay ? 'Closing payment' : 'After settle'}
                                            </Typography>
                                        </Stack>
                                        <AccountingSummaryStack items={items} />
                                    </Stack>
                                )}
                            </div>
                        );
                    })}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
