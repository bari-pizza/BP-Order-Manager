import { useEffect, useState } from 'react';

export const useIsMouseOffScreen = () => {
    const [isMouseOffScreen, setIsMouseOffScreen] = useState(false);

    useEffect(() => {
        const handleMouseLeave = () => {
            // When the mouse leaves the document (off-screen), set to true
            setIsMouseOffScreen(true);
        };

        const handleMouseEnter = () => {
            // When the mouse re-enters the document, set to false
            setIsMouseOffScreen(false);
        };

        // Add event listeners to document.documentElement
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            // Cleanup event listeners when the component unmounts
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    return isMouseOffScreen;
};
