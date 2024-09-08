import { faker } from '@faker-js/faker/locale/en_US';
import dayjs from 'dayjs';
import type { Order_Payment, NewOrder, OrderType, OrderOrigin } from '../typesAndValidators';

type DummyNewOrder = {
    data?: Partial<Order_Payment>;
    isNew: true;
};

type DummyExistingOrder = {
    data?: Partial<Order_Payment>;
    isNew: false;
};

type FakerOriginOrderType = {
    origin: OrderOrigin['name'];
    orderType: OrderType;
};

function createDummyOrder<
    T extends DummyNewOrder | DummyExistingOrder,
    R = T extends DummyExistingOrder ? Order_Payment : NewOrder,
>(props?: T) {
    const { origin, orderType } = faker.helpers.arrayElement<FakerOriginOrderType>([
        { origin: 'Bari Pizza', orderType: 'delivery' },
        { origin: 'Bari Pizza', orderType: 'pickup' },
        { origin: 'DoorDash', orderType: 'pickup' },
        { origin: 'Pizzamico', orderType: 'pickup' },
        { origin: 'Pizzamico', orderType: 'delivery' },
    ]);

    const { data = {}, isNew = false } = props || {};
    const order: Partial<Order_Payment> = {};
    order.business_date = data.business_date || dayjs(faker.date.recent()).format('YYYY-MM-DD');
    order.drawer_id = data.drawer_id || faker.string.uuid();
    order.origin_id = data.origin_id || origin; // missing origin_id for new orders
    order.order_number = data.order_number || faker.number.int({ min: 1, max: 100 });
    order.order_type = data.order_type || orderType;
    order.phone = data.phone || faker.helpers.fromRegExp(/([1-9][0-9]{2}) [0-9]{3}-[0-9]{4}/);
    order.total_in_cents = data.total_in_cents || faker.number.int({ min: 1000, max: 8000 });
    order.payments = data.payments || []; // add payments here eventually

    if (!isNew) {
        order.order_id = data.order_id || faker.string.uuid();
        order.created_at = data.created_at || faker.date.recent().toISOString();
    }

    return order as R;
}

const sortOrders = (a: Order_Payment | NewOrder, b: Order_Payment | NewOrder) =>
    (a?.order_number || 0) - (b?.order_number || 0);

const createDummyOrders = (number = 5, isNew = false) =>
    Array.from({ length: number })
        .map(() => {
            const order = createDummyOrder({ isNew });
            return order as Order_Payment;
        })
        .sort(sortOrders);

export default {
    existing: (number = 5) => createDummyOrders(number, false) as Order_Payment[],
    new: (number = 5) => createDummyOrders(number, true) as NewOrder[],
    one: {
        existing: () => createDummyOrders(1, false)[0] as Order_Payment,
        new: () => createDummyOrders(1, true)[0] as NewOrder,
    },
};
