export const DEFAULT_TEST_PASSWORD = 'testtest';

export type TestAccount = {
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_manager: boolean;
    is_driver: boolean;
};

export const TEST_ACCOUNTS: TestAccount[] = [
    {
        email: 'test.admin@gmail.com',
        first_name: 'Test',
        last_name: 'Admin',
        is_admin: true,
        is_manager: true,
        is_driver: false,
    },
    {
        email: 'test.driver1@gmail.com',
        first_name: 'Test',
        last_name: 'Driver1',
        is_admin: false,
        is_manager: false,
        is_driver: true,
    },
    {
        email: 'test.driver2@gmail.com',
        first_name: 'Test',
        last_name: 'Driver2',
        is_admin: false,
        is_manager: false,
        is_driver: true,
    },
];

export const getTestPassword = () => process.env.TEST_ACCOUNT_PASSWORD?.trim() || DEFAULT_TEST_PASSWORD;

export const getManagerCredentials = () => ({
    email: process.env.TEST_USER_EMAIL?.trim() || TEST_ACCOUNTS[0].email,
    password: process.env.TEST_USER_PASSWORD?.trim() || getTestPassword(),
});

export const getDriverEmails = () => {
    const fromEnv = process.env.TEST_DRIVER_EMAIL?.trim();
    const emails = fromEnv
        ? fromEnv
              .split(',')
              .map((email) => email.trim().toLowerCase())
              .filter(Boolean)
        : TEST_ACCOUNTS.filter((account) => account.is_driver).map((account) => account.email);

    const managerEmail = getManagerCredentials().email.toLowerCase();
    if (emails.includes(managerEmail)) {
        throw new Error(
            'TEST_DRIVER_EMAIL must be a different user than TEST_USER_EMAIL (desktop stays logged in as the manager).',
        );
    }

    return emails;
};

export const passwordForEmail = (email: string) => {
    const manager = getManagerCredentials();
    if (email.trim().toLowerCase() === manager.email.toLowerCase()) {
        return manager.password;
    }
    return getTestPassword();
};
