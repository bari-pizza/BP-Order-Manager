import { toast } from 'react-toastify';
import { Profile } from '../typesAndValidators';
import { useSession } from '../hooks/data/useSession';

// const myCallback = ({ profile, driver }) => {
//     console.log({ profile, driver });
// };

type ConditionalContext = {
    profile: Profile | null;
    isMobile: boolean;
    profileFullName: string;
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
        // toast.info(JSON.stringify({ result, leftSide, rightSide, condition }, null, 2));
        return result;
    });
};

// Function to compare values based on a given condition
const compareValues = (left: unknown, right: unknown, comparison: Comparison): boolean => {
    switch (comparison) {
        case 'eq':
            return JSON.stringify(left) === JSON.stringify(right);
        case 'neq':
            return JSON.stringify(left) !== JSON.stringify(right);
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

export const useConditionalToast = ({ isMobile }: { isMobile: boolean }) => {
    const { profile } = useSession();
    const profileFullName = profile ? `${profile.first_name} ${profile.last_name}` : '';
    const context = { profile, isMobile, profileFullName };
    const handleConditions = <T,>(params: ConditionalToastParams<T>) => {
        const { scenario, payload } = params;
        scenario.forEach((s) => {
            const { conditions, getMessage } = s;
            if (evaluateConditions(conditions, context, payload)) {
                toast.info(getMessage(context), { autoClose: 1000 });
            }
        });
    };
    return handleConditions;
};
