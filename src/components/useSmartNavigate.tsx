import { useLocation, NavigateOptions, To, Path, useNavigate } from 'react-router-dom';

interface UseSmartNavigateProps {
    to: To;
    keepSearchParams?: boolean | string[];
    redirect?: boolean;
}

export const useSmartNavigate = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return ({ to, keepSearchParams, redirect, ...rest }: UseSmartNavigateProps & NavigateOptions) => {
        const existingSearchParams = new URLSearchParams(location.search);
        const state = location.state;
        const from = state?.from as To | undefined;

        const newTo: Path = {
            pathname: '',
            search: '',
            hash: '',
        };

        // can have a to and a from state at the same time
        // from state takes precedence
        if (from) {
            if (typeof from === 'string') {
                newTo.pathname = from;
            } else if (from) {
                const { pathname, search, hash } = from;
                newTo.pathname = pathname || '';
                newTo.search = search || '';
                newTo.hash = hash || '';
            }
        } else {
            if (typeof to === 'string') {
                newTo.pathname = to;
            } else if (to) {
                const { pathname, search, hash } = to;
                newTo.pathname = pathname || '';
                newTo.search = search || '';
                newTo.hash = hash || '';
            }
        }

        const newSearchParams = new URLSearchParams(newTo.search);
        existingSearchParams.forEach((value, key) => {
            if (keepSearchParams === true || (keepSearchParams && keepSearchParams.includes(key))) {
                newSearchParams.set(key, value);
            }
        });
        newTo.search = newSearchParams.toString();

        if (redirect) {
            const redirectFrom = {
                pathname: location.pathname || '/',
                search: location.search,
            };
            navigate(newTo, { state: { ...state, from: redirectFrom }, ...rest });
        } else {
            navigate(newTo, { ...rest });
        }
    };
};
