export const orderOriginsWithTypes = {
    DoorDash: {
        origin: {
            name: 'DoorDash',
            can_tip: false,
            can_deliver: false,
            icon: 'https://vqsrmrwphnuitcxtoxqy.supabase.co/storage/v1/object/public/order_origins/DoorDash/1726079810418-logo.png',
            is_third_party: true,
            default_is_prepaid: true,
            is_prepaid_toggleable: false,
            has_order_number: false,
            origin_id: '3ddc27f3-ae67-41ea-932a-cc59a3d1ca8a',
        },
        validTypes: ['pickup'] as const,
        validPayments: ['third_party'] as const,
    },
    Pizzamico: {
        origin: {
            name: 'Pizzamico',
            can_tip: true,
            can_deliver: true,
            icon: 'https://vqsrmrwphnuitcxtoxqy.supabase.co/storage/v1/object/public/order_origins/Pizzamico/1726079822797-logo.ico',
            is_third_party: true,
            default_is_prepaid: true,
            is_prepaid_toggleable: true,
            has_order_number: false,
            origin_id: 'ea62ffad-1b60-4619-a630-c7b701db3fa4',
        },
        validTypes: ['pickup', 'delivery'] as const,
        validPayments: ['cash', 'card', 'third_party'] as const,
    },
    'Bari Pizza': {
        origin: {
            name: 'Bari Pizza',
            can_tip: true,
            can_deliver: true,
            icon: 'https://vqsrmrwphnuitcxtoxqy.supabase.co/storage/v1/object/public/order_origins/Bari Pizza/1726080409161-logo.png',
            is_third_party: false,
            default_is_prepaid: false,
            is_prepaid_toggleable: false,
            has_order_number: true,
            origin_id: 'ef31855b-4087-4fed-9298-56d39896d87d',
        },
        validTypes: ['pickup', 'delivery'] as const,
        validPayments: ['cash', 'card'] as const,
    },
} as const;

type OrderOriginKey = keyof typeof orderOriginsWithTypes;

// Use this type to infer the valid combinations from the object above
type OriginDependent = {
    [K in OrderOriginKey]: {
        orderOrigin: (typeof orderOriginsWithTypes)[K]['origin'];
        orderType: (typeof orderOriginsWithTypes)[K]['validTypes'][number];
        paymentType: (typeof orderOriginsWithTypes)[K]['validPayments'][number];
        orderNumber?: (typeof orderOriginsWithTypes)[K]['origin']['has_order_number'] extends true ? string : never;
        orderName?: (typeof orderOriginsWithTypes)[K]['origin']['has_order_number'] extends false ? string : never;
    };
}[OrderOriginKey];

export type OrderData = {
    origin: OriginDependent['orderOrigin'];
    orderType: OriginDependent['orderType'];
    paymentType: OriginDependent['paymentType'];
    total_in_cents: number;
} & (
    | { orderNumber: string; orderName?: never } // If orderNumber exists, orderName cannot exist
    | { orderName: string; orderNumber?: never } // If orderName exists, orderNumber cannot exist
);

// const Order: {
//     business_date: string;
//     created_at: string;
//     delivery_fee_in_cents: number;
//     drawer_id: string | null;
//     is_locked: boolean;
//     order_id: string;
//     order_name: string | null;
//     order_number: number | null;
//     order_type: "pickup" | "delivery";
//     origin_id: string;
//     phone: string | null;
//     total_in_cents: number;
// }
