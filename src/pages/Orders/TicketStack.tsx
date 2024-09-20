import { Stack, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Ticket = styled(Paper)({
    width: 25, // Narrower ticket
    height: 50, // Taller ticket
    backgroundColor: '#f4f4f4',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center the index number
});

export const TicketStack = ({ count }: { count: number }) => {
    const visibleTickets = Math.min(count, 10); // Show up to 10 tickets in the stack

    return (
        <div style={{ position: 'relative' }}>
            <Stack direction="row" spacing={-1}>
                {[...Array(visibleTickets)].map((_, index) => (
                    <Ticket key={index}>
                        <Typography variant="body2" color="textSecondary">
                            {index + 1} {/* Display the ticket index */}
                        </Typography>
                    </Ticket>
                ))}
            </Stack>
        </div>
    );
};
