import { useContext } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { UserContext } from '../UserContext';
import {Login} from './Login';

export  function NavBar() {
    const { profile } = useContext(UserContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Supaship
                </Typography>
                {profile ? <div>Welcome {profile.email}</div> : <Login />}
            </Toolbar>
        </AppBar>
    );
}
