import { IconButton, Popover } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Info as InfoIcon } from '@mui/icons-material';

type InfoPopoverProps = {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
    transformOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
};

export const InfoPopover = ({ children, size = 'small', anchorOrigin, transformOrigin }: InfoPopoverProps) => {
    const popoverAnchor = useRef<HTMLButtonElement | null>(null);
    const [openedPopover, setOpenedPopover] = useState(false);

    const handlePopoverEnter = () => {
        setOpenedPopover(true);
    };

    const handlePopoverLeave = () => {
        setOpenedPopover(false);
    };

    const handleClose = () => {
        setOpenedPopover(false);
    };

    const handleInfoClick = () => {
        setOpenedPopover(true);
    };

    /* TODO: figure out this issue
        Blocked aria-hidden on an element because its descendant retained focus. The focus must not be hidden from assistive technology users. Avoid using aria-hidden on a focused element or its ancestor. Consider using the inert attribute instead, which will also prevent focus. For more details, see the aria-hidden section of the WAI-ARIA specification at <URL>.
    */

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
                <IconButton
                    ref={popoverAnchor}
                    onClick={handleInfoClick}
                    color="info"
                    size={size}
                    disableFocusRipple
                    onMouseEnter={handlePopoverEnter}
                    onMouseLeave={handlePopoverLeave}>
                    <InfoIcon />
                </IconButton>
                <Popover
                    aria-modal
                    open={openedPopover}
                    anchorEl={popoverAnchor.current}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: anchorOrigin?.vertical ?? 'bottom',
                        horizontal: anchorOrigin?.horizontal ?? 'left',
                    }}
                    transformOrigin={{
                        vertical: transformOrigin?.vertical ?? 'top',
                        horizontal: transformOrigin?.horizontal ?? 'left',
                    }}
                    onMouseEnter={handlePopoverEnter}
                    onMouseLeave={handlePopoverLeave}
                    slotProps={{ paper: { sx: { pointerEvents: 'auto', padding: 2 } } }}
                    sx={{ pointerEvents: 'none' }}>
                    {children}
                </Popover>
            </div>
        </div>
    );
};
