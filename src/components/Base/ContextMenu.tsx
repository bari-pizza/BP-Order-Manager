import { Box, Menu as MuiMenu, MenuItem as MuiMenuItem, Stack } from '@mui/material';
import React, { createContext, useContext, useState, MouseEventHandler } from 'react';

interface ContextMenuContextProps {
    handleClick: MouseEventHandler<HTMLElement>;
    // anchorEl: HTMLElement | null;
    contextMenu: { mouseX: number; mouseY: number } | null;
    handleClose: () => void;
    openOnType: 'click' | 'right-click';
}

const ContextMenuContext = createContext<ContextMenuContextProps>({
    handleClick: () => {},
    // anchorEl: null,
    handleClose: () => {},
    openOnType: 'click',
    contextMenu: null,
});

interface ContextMenuProps {
    openOnType?: 'click' | 'right-click';
    children: React.ReactNode;
}

export const ContextMenu = ({ children, openOnType = 'right-click' }: ContextMenuProps) => {
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setContextMenu({ mouseX: event.clientX + 2, mouseY: event.clientY - 6 });
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <ContextMenuContext.Provider value={{ contextMenu, handleClick, handleClose, openOnType }}>
            {children}
        </ContextMenuContext.Provider>
    );
};

const Base = ({ children }: { children: React.ReactNode }) => {
    const { handleClick, openOnType } = useContext(ContextMenuContext);

    const sx = {
        cursor: 'pointer',
    };

    if (openOnType === 'click') {
        return (
            <Box className="click-handler" sx={sx} onClick={handleClick}>
                {children}
            </Box>
        );
    }

    return (
        <Box className="click-handler" sx={sx} onContextMenu={handleClick}>
            {children}
        </Box>
    );
};

const Menu = ({ children }: { children: React.ReactNode }) => {
    const { handleClose, contextMenu } = useContext(ContextMenuContext);

    return (
        <MuiMenu
            slotProps={{ paper: { sx: { minWidth: 200 } } }}
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}>
            {children}
        </MuiMenu>
    );
};

const MenuItem = ({
    children,
    onClick,
    icon,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
}) => {
    const { handleClose } = useContext(ContextMenuContext);

    if (!onClick) {
        return (
            <MuiMenuItem disabled disableRipple>
                <Stack direction="row" alignItems="center" gap={2}>
                    {icon} {children}
                </Stack>
            </MuiMenuItem>
        );
    }

    const handleClick = () => {
        handleClose();
        onClick();
    };

    return (
        <MuiMenuItem disableRipple onClick={handleClick}>
            <Stack direction="row" alignItems="center" gap={2}>
                {icon} {children}
            </Stack>
        </MuiMenuItem>
    );
};

ContextMenu.Base = Base;
ContextMenu.Menu = Menu;
ContextMenu.MenuItem = MenuItem;
