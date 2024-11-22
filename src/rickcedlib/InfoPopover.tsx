import { IconButton, Popover } from '@mui/material';
import React, { useState } from 'react';
import { Info as InfoIcon } from '@mui/icons-material';

type InfoPopoverProps = {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
    transformOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
};

export const InfoPopover = ({ children, size = 'small', anchorOrigin, transformOrigin }: InfoPopoverProps) => {
    // TODO: implement
    // allow for size, color, absolute positioning, on click and on hover
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <div
                style={{
                    position: 'absolute',
                }}>
                <IconButton onClick={handleInfoClick} color="info" size={size}>
                    <InfoIcon />
                </IconButton>
                <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    slotProps={{ paper: { sx: { padding: 2 } } }}
                    anchorOrigin={{
                        vertical: anchorOrigin?.vertical ?? 'bottom',
                        horizontal: anchorOrigin?.horizontal ?? 'left',
                    }}
                    transformOrigin={{
                        vertical: transformOrigin?.vertical ?? 'top',
                        horizontal: transformOrigin?.horizontal ?? 'left',
                    }}>
                    {children}
                </Popover>
            </div>
        </div>
    );
};
