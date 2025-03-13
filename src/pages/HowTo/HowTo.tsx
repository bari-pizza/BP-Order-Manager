import { List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useLayoutContext } from '../../hooks/data/useContextData';

type Story = {
    title: string;
    url: string;
    for: 'Desktop' | 'Mobile';
};

export const HowTo = () => {
    const { isMobile } = useLayoutContext();
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(-1);
    const stories: Story[] = [
        {
            title: 'How To Add an Order',
            url: 'https://scribehow.com/embed/How_To_Place_An_Order_On_Bari_Pizza__rJNs_ej2RfSWSk6hiUq62A',
            for: 'Desktop',
        },
        {
            title: 'How To Add an Order',
            url: '',
            for: 'Mobile',
        },
    ];

    const currentStory = stories[currentStoryIndex];

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction={isMobile ? 'column' : 'row'} // Change direction based on isMobile
            height="100vh"
            sx={{ border: '1px solid red' }}>
            <Stack
                direction="column"
                spacing={2}
                width={isMobile ? '100%' : '450px'} // Adjust width for mobile
                order={isMobile ? 1 : 0} // Change order for mobile
            >
                <List>
                    {stories
                        .filter((story) => !isMobile || story.for === 'Mobile')
                        .map((story, index) => (
                            <ListItem key={story.title}>
                                <ListItemButton
                                    onClick={() => setCurrentStoryIndex(index)}
                                    selected={index === currentStoryIndex}>
                                    <ListItemText
                                        primary={
                                            <strong>
                                                {story.title} {!isMobile && `(${story.for})`}
                                            </strong>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            </Stack>
            <Stack
                direction="column"
                spacing={2}
                width="100%"
                order={isMobile ? 0 : 1} // Change order for mobile
            >
                {currentStory ? (
                    currentStory.url ? (
                        <iframe
                            src={currentStory.url}
                            width="100%"
                            height="640"
                            allowFullScreen
                            frameBorder="0"></iframe>
                    ) : (
                        <Typography variant="h4">No story available</Typography>
                    )
                ) : (
                    <h1>Choose a story</h1>
                )}
            </Stack>
        </Stack>
    );
};
