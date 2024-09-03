import { forwardRef } from 'react';
import { Link, Navigate, Path, To, useLocation, LinkProps } from 'react-router-dom';

type SmartLinkProps = LinkProps & {
    keepSearchParams?: boolean | string[];
};

type SmartNavigateProps = SmartLinkProps & {
    redirect?: boolean;
};

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(({ to, keepSearchParams, ...rest }, ref) => {
    const location = useLocation();
    const existingSearchParams = new URLSearchParams(location.search);

    const newTo: Path = {
        pathname: '',
        search: '',
        hash: '',
    };

    if (typeof to === 'string') {
        newTo.pathname = to;
    } else if (to) {
        const { pathname, search, hash } = to;
        newTo.pathname = pathname || '';
        newTo.search = search || '';
        newTo.hash = hash || '';
    }

    const newSearchParams = new URLSearchParams(newTo.search);
    existingSearchParams.forEach((value, key) => {
        if (keepSearchParams === true || (keepSearchParams && keepSearchParams.includes(key))) {
            newSearchParams.set(key, value);
        }
    });
    newTo.search = newSearchParams.toString();

    return <Link to={newTo} ref={ref} {...rest} style={{ color: 'inherit' }} />;
});

/**
 * @description SmartNavigate will navigate using .to unless location.state.from is set
 * @note location.state.from should only be set if SmartNavigate is used in a Redirect.
 */
export const SmartNavigate = ({ to, keepSearchParams, redirect, ...rest }: SmartNavigateProps) => {
    const location = useLocation();
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
        return <Navigate state={{ ...state, from: redirectFrom }} to={newTo} {...rest} />;
    }

    return <Navigate to={newTo} {...rest} />;
};
