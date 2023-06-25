import React from 'react';

import {Dialog, DialogTitle, DialogContent, Button} from '@mui/material';

/**
* @name MyAccountThanksPrompt
* @description This component renders a thankyou prompt when the user successfully updates their profile
* @param {display boolean, function to set display boolean}
* @returns A MyAccountThanksPrompt Component
*/
export const MyAccountThanksPrompt = ({display, setDisplay}) => {  
   return (
       <Dialog open={display}>
           <DialogTitle>
               Thanks for updating your profile
           </DialogTitle>
           <DialogContent>
               <Button sx={{backgroundColor: 'lightgreen'}} align={'center'} variant="container" onClick={() => {
                   setDisplay(false);
                   document.location.reload();
               }}>
                   OKAY!
               </Button>
           </DialogContent>
       </Dialog>
   );
}