import { faker } from '@faker-js/faker/locale/en_US';
import dayjs from 'dayjs';
import type { Order, NewOrder } from '../typesAndValidators';

type DummyNewOrder = {
    data?: Partial<Order>;
    isNew?: true;
};

type DummyExistingOrder = {
    data?: Partial<Order>;
    isNew?: false;
};

function createDummyOrder<
    T extends DummyNewOrder | DummyExistingOrder | undefined,
    R = T extends DummyExistingOrder ? Order : NewOrder,
>(props?: T) {
    const { data = {}, isNew = false } = props || {};
    const order: Partial<Order> = {};
    order.business_date = data.business_date || dayjs(faker.date.recent()).format('YYYY-MM-DD');
    order.drawer_id = data.drawer_id || faker.string.uuid();
    order.order_number = data.order_number || faker.number.int({ min: 1, max: 100 });
    order.order_type = data.order_type || faker.helpers.arrayElement(['pickup', 'delivery']);
    order.phone = data.phone || faker.helpers.fromRegExp(/([1-9][0-9]{2}) [0-9]{3}-[0-9]{4}/);
    order.total_in_cents = data.total_in_cents || faker.number.int({ min: 1000, max: 8000 });

    if (!isNew) {
        order.order_id = data.order_id || faker.string.uuid();
        order.created_at = data.created_at || faker.date.recent().toISOString();
    }

    return order as R;
}

const sortOrders = (a: Order | NewOrder, b: Order | NewOrder) => (a?.order_number || 0) - (b?.order_number || 0);

const dummyExistingOrders = Array.from({ length: 20 })
    .map(() => {
        const order = createDummyOrder({ isNew: false });
        return order;
    })
    .sort(sortOrders);

const dummyNewOrders = Array.from({ length: 20 })
    .map(() => {
        const order = createDummyOrder({ isNew: true });
        return order;
    })
    .sort(sortOrders);

export default {
    existing: dummyExistingOrders,
    new: dummyNewOrders,
};
