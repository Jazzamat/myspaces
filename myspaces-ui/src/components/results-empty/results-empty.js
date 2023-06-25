import React from 'react';
import {Grid, Typography} from '@mui/material';

/**
 * @name EmptyResults
 * @description This component is rendered when a specific results section has no content
 * @returns An EmptyResults Component
 */
export const EmptyResults = () => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                {"We couldn't find anything for you :( "}
            </Typography>
        </Grid>
    );
}