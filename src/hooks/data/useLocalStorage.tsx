import { useLocalStorage as useLocalStorageOriginal } from 'usehooks-ts';
import { LocalStorageField } from '../../typesAndValidators';

export const useLocalStorage = <K extends keyof LocalStorageField>(key: K, initialValue?: LocalStorageField[K]) => {
    const getInitialValue = () => {
        if (initialValue) return initialValue;
        return localStorage.getItem(key) as LocalStorageField[K];
    };
    const [value, setValue, removeValue] = useLocalStorageOriginal<LocalStorageField[K]>(key, getInitialValue, {
        initializeWithValue: true,
    });

    // KEEP: critical for type safety
    const setValueWrapper = (newValue: LocalStorageField[K]) => {
        setValue(newValue);
    };

    return { value, setValue: setValueWrapper, removeValue };
};
