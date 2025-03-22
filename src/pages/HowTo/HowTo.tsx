import { List, ListItem, ListItemButton, ListItemText, Stack, Typography, Button } from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useLayoutContext } from '../../hooks/data/useContextData';
import { toast } from 'react-toastify';

type Story = {
    title: string;
    url: string;
    for: 'Desktop' | 'Mobile';
};

type StorySection = {
    section: string;
    stories: Story[];
};

type StorySectionProps = {
    storySection: StorySection;
    isMobile: boolean;
};

const StorySection = ({ storySection, isMobile }: StorySectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { section, stories } = storySection;

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const sectionStories = isMobile ? stories.filter((s) => s.for === 'Mobile') : stories;
    if (sectionStories.length === 0) {
        return null;
    }

    return (
        <Stack spacing={0}>
            <Button
                onClick={handleToggleCollapse}
                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">{section}</Typography>
                {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </Button>
            {!isCollapsed && (
                <List>
                    {sectionStories.map((story) => {
                        const title = `${story.title}${!isMobile && story.for === 'Mobile' ? ' (Mobile)' : ''}`;
                        if (story.url === '') {
                            return (
                                <ListItem key={title}>
                                    <ListItemButton
                                        sx={{ padding: 0 }}
                                        onClick={() =>
                                            toast.error("This story isn't available yet", { autoClose: 5000 })
                                        }>
                                        <ListItemText primary={<em>{title}</em>} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        }
                        return (
                            <ListItem key={title}>
                                <ListItemButton sx={{ padding: 0 }} onClick={() => window.open(story.url, '_blank')}>
                                    <ListItemText primary={title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Stack>
    );
};

export const HowTo = () => {
    const { isMobile } = useLayoutContext();
    const storySections: StorySection[] = [
        {
            section: 'Orders',
            stories: [
                {
                    title: 'Adding an Order',
                    url: 'https://scribehow.com/embed/How_To_Place_An_Order_On_Bari_Pizza__rJNs_ej2RfSWSk6hiUq62A',
                    for: 'Desktop',
                },
                {
                    title: 'Adding an Order',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Editing an Order',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing an Order',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Deleting an Order',
                    url: '',
                    for: 'Desktop',
                },
            ],
        },
        {
            section: 'Payments',
            stories: [
                {
                    title: 'Adding a Payment',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Adding a Payment',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Editing a Payment',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing a Payment',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Deleting a Payment',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Deleting a Payment',
                    url: '',
                    for: 'Mobile',
                },
            ],
        },
        {
            section: 'Business Day',
            stories: [
                {
                    title: 'Adding a Driver',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Removing a Driver',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Closing a Driver',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Closing a Drawer',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Closing a Business Day',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Changing Business Day',
                    url: '',
                    for: 'Desktop',
                },
            ],
        },
        {
            section: 'Employees',
            stories: [
                {
                    title: 'Adding an Employee',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing an Employee',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Deleting an Employee',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Sending PW Reset Email',
                    url: '',
                    for: 'Desktop',
                },
            ],
        },
        {
            section: 'Order Origins',
            stories: [
                {
                    title: 'Adding an Order Origin',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing an Order Origin',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Deleting an Order Origin',
                    url: '',
                    for: 'Desktop',
                },
            ],
        },
        {
            section: 'Cash Transfers',
            stories: [
                {
                    title: 'Adding a Cash Transfer',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing a Cash Transfer',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Deleting a Cash Transfer',
                    url: '',
                    for: 'Desktop',
                },
            ],
        },
        {
            section: 'Profile',
            stories: [
                {
                    title: 'Editing Your Profile',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Editing Your Profile',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Changing Your Password',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Changing Your Password',
                    url: '',
                    for: 'Mobile',
                },
            ],
        },
        {
            section: 'App Settings',
            stories: [
                {
                    title: 'Changing a Setting',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Check for Updates',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Check for Updates',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Downloading the App',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Downloading the App',
                    url: '',
                    for: 'Mobile',
                },
            ],
        },
    ];

    return (
        <Stack direction="column" spacing={2} width="100%" height="100vh" mt={2} className="hover-scroll">
            <Stack className="hover-scroll-content" height="100%">
                {storySections.map((storySection) => (
                    <StorySection key={storySection.section} isMobile={isMobile} storySection={storySection} />
                ))}
            </Stack>
        </Stack>
    );
};
