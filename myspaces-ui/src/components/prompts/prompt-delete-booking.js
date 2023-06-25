import React from 'react';
import {DialogTitle, DialogContent, Dialog, Button} from '@mui/material';
import { mySpacesAPIDELETE } from '../../myspaces-api/myspaces-api-server';

/**
 * @name DeletedBookingPrompt
 * @description This prompt requests the user to confirm the deletion of a booking before executing the API call
 * @param {displayed boolean, function to set displayed boolean, booking ID, function to set the cancelled boolean} param0 
 * @returns A DeleteBookingPrompt Component
 */
export const DeleteBookingPrompt = ({displayed, setDisplayed, bookingID, setCanceled}) => {

    const callback = () => {
        setCanceled(true);                    
    }

    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Are you sure you want to delete this booking?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {
                        setDisplayed(false);
                        mySpacesAPIDELETE(`/bookings/${bookingID}`, callback); 
                    }}>
                    YES
                </Button>
                <Button 
                    align={'right'}
                    variant="container" 
                    onClick={() => {
                        setDisplayed(false);    
                    }}>
                    Never Mind!
                </Button>
            </DialogContent>
        </Dialog>
    );
}