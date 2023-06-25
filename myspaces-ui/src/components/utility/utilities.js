import { React, useState } from 'react';
import { Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { mySpacesAPIDELETE } from '../../myspaces-api/myspaces-api-server';

/**
 * @title DeletePrompt
 * @description This component renders the delete prompt if the user selects the delete button
 * @param {displayed, setDisplayed, item, itemID}
 * @returns A DeletePrompt Component
 */
 const DeletePrompt = ({displayed, setDisplayed, item, itemID, onDelete}) => {

    const callback = () => {
        setDisplayed(false);
        onDelete();
    }

    return (
        <Dialog open={displayed} onClose={() => {setDisplayed(false);}}>
            <DialogTitle>
                Are you sure you want to delete this {item}?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {mySpacesAPIDELETE(`/${item}s/${itemID}`, callback)}}
                >
                    CONFIRM DELETE
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

/**
 * @name DeleteButton
 * @description This component renders a generic delete button to be rendered on the user interface
 * @param {item passed to delete prompt, itemID, callback function on delete} param0 
 * @returns A DeletButton Component
 */
export const DeleteButton = ({item, itemID, onDelete}) => {

    const [deletePrompt, setDeletePrompt] = useState(false);

    return (
        <Grid container item xs={12}>
            <Grid 
                item 
                xs={12}
                sx={{backgroundColor: 'red'}} 
                component={Button}
                variant="contained" 
                onClick={() => {setDeletePrompt(true)}}
            >
                DELETE
            </Grid>
            <DeletePrompt displayed={deletePrompt} setDisplayed={setDeletePrompt} item={item} itemID={itemID} onDelete={onDelete}/>
        </Grid>

    );
}

/**
 * @name EditButton
 * @description This component renders a generic edit button to be rendered on the user interface
 * @param {callback function on edit} param0 
 * @returns An EditButton Component
 */
export const EditButton = ({onClick}) => {

    return (
        <Grid 
            item 
            xs={12}
            component={Button} 
            variant="contained"
            onClick={onClick}
        >
            EDIT
        </Grid>
    );
}

/**
 * @name SubmitButton
 * @description This component renders a generic submit button to be rendered on the user interface
 * @param {callback function on submit} param0 
 * @returns A SubmitButton Component
 */
export const SubmitButton = ({onClick}) => {

    return (
        <Grid 
            item 
            xs={12}
            component={Button} 
            variant="contained"
            onClick={onClick}
        >
            SUBMIT
        </Grid>
    );
}