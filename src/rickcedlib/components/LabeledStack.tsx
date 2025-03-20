import { SxProps, useTheme } from '@mui/material';
import { StackProps, TypographyProps, Stack, Typography } from '@mui/material';
import { forwardRef } from 'react';

interface LabeledStackProps extends StackProps {
    label: string;
    labelProps?: TypographyProps;
    alignLabel?: 'left' | 'center' | 'right';
    color?: string;
    fixed?: boolean;
}

export const LabeledStack = forwardRef<HTMLDivElement, LabeledStackProps>(
    ({ children, label, labelProps, alignLabel = 'center', color, fixed, ...props }, ref) => {
        const theme = useTheme();
        color = color || theme.palette.primary.main;

        const { sx: labelSx, ...labelPropsRest } = labelProps || {};
        const { sx: stackSx, ...stackPropsRest } = props || {};

        const typographySx = {
            position: 'absolute',
            top: '-12px', // Adjust as needed
            left: '',
            right: '',
            transform: '',
            padding: '0 8px',
            backgroundColor: theme.palette.background.paper,
            color,
            fontSize: '0.875rem', // Adjust to your needs
            fontWeight: 500,
            textTransform: 'capitalize', // Capitalizes the label by default
            ...labelSx, // Allow overriding styles with labelProps
        };

        if (alignLabel === 'left') {
            typographySx.left = theme.spacing(1.5);
        } else if (alignLabel === 'right') {
            typographySx.right = theme.spacing(1.5);
        } else if (alignLabel === 'center') {
            typographySx.left = '50%';
            typographySx.transform = 'translateX(-50%)';
        }

        if (fixed) {
            return (
                <Stack
                    className="labeled-stack"
                    {...stackPropsRest}
                    ref={ref}
                    sx={{
                        position: 'relative',
                        border: `2px solid ${color}`,
                        borderRadius: '4px',
                        padding: theme.spacing(2),
                        marginTop: theme.spacing(1.5),
                        ...stackSx,
                    }}>
                    <Typography
                        component="span"
                        sx={typographySx as SxProps}
                        {...labelPropsRest} // Spread any additional label props passed by the user
                    >
                        {label}
                    </Typography>
                    {children}
                </Stack>
            );
        }
        return (
            <Stack
                className="labeled-stack"
                {...stackPropsRest}
                ref={ref}
                sx={{
                    position: 'relative',
                    border: `2px solid ${color}`,
                    borderRadius: '4px',
                    padding: theme.spacing(2),
                    marginTop: theme.spacing(1.5),
                    ...stackSx,
                }}>
                <Typography
                    component="span"
                    sx={typographySx as SxProps}
                    {...labelPropsRest} // Spread any additional label props passed by the user
                >
                    {label}
                </Typography>
                {children}
            </Stack>
        );
    },
);

// USE IN FUTURE PROJECTS
