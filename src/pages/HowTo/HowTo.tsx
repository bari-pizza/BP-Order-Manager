import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useLayoutContext } from '../../hooks/data/useContextData';
import { toast } from '../../toast/toastWrapper';

type Story = {
    title: string;
    url: string;
    for: 'Desktop' | 'Mobile';
    /** Short in-app steps when there is no Scribe embed yet. */
    steps?: string[];
};

type StorySection = {
    section: string;
    stories: Story[];
};

type StorySectionProps = {
    storySection: StorySection;
    isMobile: boolean;
    onOpenSteps: (story: Story) => void;
};

const StorySection = ({ storySection, isMobile, onOpenSteps }: StorySectionProps) => {
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
                        if (story.steps?.length) {
                            return (
                                <ListItem key={title}>
                                    <ListItemButton sx={{ padding: 0 }} onClick={() => onOpenSteps(story)}>
                                        <ListItemText primary={title} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        }
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
    const [guideStory, setGuideStory] = useState<Story | null>(null);
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
                    steps: [
                        'Open Manager → select a drawer → Cash Transfers (unlocked drawers only).',
                        'Tap New Cash Transfer and pick Bank, Payment, or Other.',
                        'Choose the other party (Register / Drawer), set direction (From / To / Spent / Received), enter an amount greater than $0, then Save.',
                        'Bank is only available once per driver day and usually seeds from Add Driver.',
                    ],
                },
                {
                    title: 'Editing a Cash Transfer',
                    url: '',
                    for: 'Desktop',
                    steps: [
                        'Open Cash Transfers on the drawer and tap Edit on a row.',
                        'You can change the amount and direction. Parties (source/destination) stay locked — delete and recreate if you picked the wrong drawers.',
                        'Save with the check icon, or Cancel to discard.',
                    ],
                },
                {
                    title: 'Deleting a Cash Transfer',
                    url: '',
                    for: 'Desktop',
                    steps: [
                        'Open Cash Transfers → Edit the row → trash icon.',
                        'Confirm the delete toast.',
                        'Remove all cash transfers before removing a driver from the day.',
                    ],
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
            section: 'App Usage',
            stories: [
                {
                    title: 'Changing a Setting',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Downloading the App',
                    url: '',
                    for: 'Desktop',
                },
                {
                    title: 'Downloading the App on IOS',
                    url: '',
                    for: 'Mobile',
                },
                {
                    title: 'Downloading the App on Android',
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
                    <StorySection
                        key={storySection.section}
                        isMobile={isMobile}
                        storySection={storySection}
                        onOpenSteps={setGuideStory}
                    />
                ))}
            </Stack>
            <Dialog open={Boolean(guideStory)} onClose={() => setGuideStory(null)} fullWidth maxWidth="sm">
                <DialogTitle>{guideStory?.title}</DialogTitle>
                <DialogContent>
                    <Stack component="ol" spacing={1} sx={{ pl: 2, m: 0 }}>
                        {guideStory?.steps?.map((step) => (
                            <Typography component="li" key={step} variant="body1">
                                {step}
                            </Typography>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGuideStory(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
