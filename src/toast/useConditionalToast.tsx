import { toast } from 'react-toastify';
import { Profile } from '../typesAndValidators';
import { useSession } from '../hooks/data/useSession';
import { useLayoutContext } from '../hooks/data/useContextData';

// const myCallback = ({ profile, driver }) => {
//     console.log({ profile, driver });
// };

type ConditionalContext = {
    profile: Profile | null;
    isMobile: boolean;
};

type Comparison = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';

// The condition type which can either compare a field in context with a value or use a dynamic field from the payload
type Condition =
    | {
          ctxField: string;
          ctxValue: unknown; // Static value to compare against context field
          comparison: Comparison;
      }
    | {
          ctxField: string;
          payloadField: unknown; // Dynamic value from payload to compare against context field
          comparison: Comparison;
      };

// This is the main type used for showing toasts based on conditions
interface ConditionalToastParams<T> {
    scenario: {
        conditions: Condition[];
        getMessage: (context: ConditionalContext) => string;
    }[];
    payload: T;
}

// Utility function to get a value from the context based on the `ctxField` path
const getContextValue = (context: ConditionalContext, ctxField: string): unknown => {
    const fields = ctxField.split('.');
    let value: unknown = context;
    fields.forEach((field) => {
        if (value && typeof value === 'object' && field in value) {
            value = (value as Record<string, unknown>)[field];
        } else {
            value = undefined;
        }
    });
    return value;
};

// Function to evaluate the conditions and determine whether to show the toast
const evaluateConditions = <T,>(conditions: Condition[], context: ConditionalContext, payload: T): boolean => {
    return conditions.every((condition) => {
        const leftSide = getContextValue(context, condition.ctxField);
        let rightSide: unknown;

        if ('ctxValue' in condition) {
            rightSide = condition.ctxValue;
        } else if ('payloadField' in condition) {
            rightSide = payload[condition.payloadField as keyof T];
        }

        const result = compareValues(leftSide, rightSide, condition.comparison);
        // toast.info(JSON.stringify({ result, leftSide, rightSide, condition }, null, 2), {
        //     autoClose: false,
        //     closeOnClick: true,
        // });
        return result;
    });
};

// Function to compare values based on a given condition
const compareValues = (left: unknown, right: unknown, comparison: Comparison): boolean => {
    switch (comparison) {
        case 'eq':
            return left === right;
        case 'neq':
            return left !== right;
        // case 'lt':
        //     return left < right;
        // case 'lte':
        //     return left <= right;
        // case 'gt':
        //     return left > right;
        // case 'gte':
        //     return left >= right;
        default:
            return false;
    }
};

export const useConditionalToast = () => {
    const { profile } = useSession();
    const { isMobile } = useLayoutContext();
    const context = { profile, isMobile };
    const handleConditions = <T,>(params: ConditionalToastParams<T>) => {
        const { scenario, payload } = params;
        scenario.forEach((s) => {
            const { conditions, getMessage } = s;
            // toast.error(getMessage(context));
            if (evaluateConditions(conditions, context, payload)) {
                toast.info(getMessage(context), { autoClose: false, closeOnClick: true });
            }
        });
    };
    return handleConditions;
};

// const ExampleUsage = () => {
//     const { handleConfirmation } = useConfirmationToast({
//         message: 'Are you sure?',
//         confirmProps: {
//             handler: () => {
//                 alert('Confirmed');
//             },
//             buttonText: 'Do it!',
//         },
//         cancelProps: {
//             handler: () => {
//                 alert('Cancelled');
//             },
//             buttonText: 'Cancel',
//         },
//     });
//     const handleClick = () => {
//         handleConfirmation();
//     };

//     return <Button onClick={handleClick}>Confirm</Button>;
// };
