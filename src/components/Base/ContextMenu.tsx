import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';
import React, { createContext, useContext, useState, MouseEventHandler } from 'react';

interface ContextMenuContextProps {
    handleClick: MouseEventHandler<HTMLElement>;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    openOnType: 'click' | 'right-click';
}

const RightClickContext = createContext<ContextMenuContextProps>({
    handleClick: () => {},
    anchorEl: null,
    handleClose: () => {},
    openOnType: 'click',
});

interface ContextMenuProps {
    openOnType?: 'click' | 'right-click';
    children: React.ReactNode;
}

export const ContextMenu = ({ children, openOnType = 'right-click' }: ContextMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick: MouseEventHandler<HTMLElement> = (e: React.MouseEvent) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.preventDefault();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <RightClickContext.Provider value={{ handleClick, anchorEl, handleClose, openOnType }}>
            {children}
        </RightClickContext.Provider>
    );
};

const Base = ({ children }: { children: React.ReactNode }) => {
    const { handleClick, openOnType } = useContext(RightClickContext);

    const style = { cursor: 'pointer' };

    if (openOnType === 'click') {
        return (
            <div style={style} onClick={handleClick}>
                {children}
            </div>
        );
    }

    return <div onContextMenu={handleClick}>{children}</div>;
};

const Menu = ({ children }: { children: React.ReactNode }) => {
    const { anchorEl, handleClose } = useContext(RightClickContext);
    const open = Boolean(anchorEl);

    return (
        <MuiMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {children}
        </MuiMenu>
    );
};

const MenuItem = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
    const { handleClose } = useContext(RightClickContext);
    const handleClick = () => {
        handleClose();
        onClick();
    };
    return <MuiMenuItem onClick={handleClick}>{children}</MuiMenuItem>;
};

ContextMenu.Base = Base;
ContextMenu.Menu = Menu;
ContextMenu.MenuItem = MenuItem;
