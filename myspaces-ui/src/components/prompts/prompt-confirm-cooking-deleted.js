import React from 'react';
import {Dialog, DialogTitle, DialogContent, Button} from '@mui/material';

/**
 * @name ConfirmBookingDeletedPrompt
 * @description This prompt is displayed to the user when the API successfully deletes a booking.  
 * It will then redirect the user and reload the page
 * @param {displayed boolean, function to set the displayed boolean} param0 
 * @returns A ConfirmBookingDeletedPrompt
 */
export const ConfirmBookingDeletedPrompt = ({displayed, setDisplayed}) => {
    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Your booking has been deleted.
            </DialogTitle>
            <DialogContent>
                <Button 
                    align={'center'}
                    variant="container" 
                    
                    sx={{backgroundColor: 'lightgreen'}} 
                    onClick={() => {
                        setDisplayed(false);                       
                        document.location.reload();
                    }}>
                    OK
                </Button>
            </DialogContent>
        </Dialog>
    );
}
