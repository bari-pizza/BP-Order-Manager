import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SettlementPreviewDialog, type SettlementTab } from '../../src/pages/Orders/SettlementPreviewDialog';

afterEach(() => vi.unstubAllGlobals());

describe('SettlementPreviewDialog', () => {
    it.each([
        [250, 'Shop pays the driver'],
        [-250, 'Driver pays the shop'],
        [0, 'No payment due'],
    ])('labels a signed closing payment of %i cents', (value, label) => {
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        const container = document.createElement('div');
        document.body.append(container);
        const root = createRoot(container);

        act(() => root.render(
            <SettlementPreviewDialog
                open
                onClose={() => undefined}
                activeTab={0}
                onTabChange={() => undefined}
                payTheShopItems={[{ label: 'Closing Payment', value }]}
                takeHomeItems={[]}
            />,
        ));

        expect(document.querySelector('#settlement-panel-pay')).toHaveTextContent(label);
        act(() => root.unmount());
        container.remove();
    });

    it('associates selected tabs with their panels and forwards changes', () => {
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        const container = document.createElement('div');
        document.body.append(container);
        const root = createRoot(container);
        const onTabChange = vi.fn<(tab: SettlementTab) => void>();
        const renderDialog = (activeTab: SettlementTab) => act(() => root.render(
            <SettlementPreviewDialog
                open
                onClose={() => undefined}
                activeTab={activeTab}
                onTabChange={onTabChange}
                payTheShopItems={[{ label: 'Payments', value: -250 }]}
                takeHomeItems={[{ label: 'Hours', value: 1000 }]}
            />,
        ));

        renderDialog(0);
        const payTab = document.querySelector('#settlement-tab-pay') as HTMLElement;
        const homeTab = document.querySelector('#settlement-tab-home') as HTMLElement;
        const payPanel = document.querySelector('#settlement-panel-pay') as HTMLElement;
        const homePanel = document.querySelector('#settlement-panel-home') as HTMLElement;

        expect(payTab).toHaveAttribute('aria-selected', 'true');
        expect(payTab).toHaveAttribute('aria-controls', payPanel.id);
        expect(payPanel).toHaveAttribute('aria-labelledby', payTab.id);
        expect(homeTab).toHaveAttribute('aria-controls', homePanel.id);
        expect(homePanel).toHaveAttribute('role', 'tabpanel');
        expect(homePanel).not.toBeVisible();

        act(() => homeTab.click());
        expect(onTabChange).toHaveBeenCalledWith(1);
        renderDialog(1);
        expect(homeTab).toHaveAttribute('aria-selected', 'true');
        expect(homePanel).toHaveTextContent('You take home');
        expect(payPanel).not.toBeVisible();

        act(() => root.unmount());
        container.remove();
    });
});
