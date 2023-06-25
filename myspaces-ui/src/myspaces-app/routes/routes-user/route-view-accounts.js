import React, {useState, useEffect} from 'react';

import { Container, Card, Grid, Typography, TextField, Button} from '@mui/material';
import { DesignerRowSeparator, DesignerColumnSeparator } from '../../../components/mui-helpers/grid-spacers';
import { LoadingResults } from '../../../components/loading-animation/loading-animation';
import { SecondaryTitle } from '../../../components/page-title/page-title';
import { fetchAuthorisedUserID} from '../../../myspaces-api/myspaces-api-cookie';
import { useNavigate } from 'react-router';
import { ErrorAlert } from '../../../components/error-alert/error-alert';
import { mySpacesAPIGET, mySpacesAPIPUT } from '../../../myspaces-api/myspaces-api-server';
import { MyAccountThanksPrompt } from '../../../components/prompts/prompt-account-thanks';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

/**
 * @name validateBSB
 * @description This function validates the BSB format string
 * @param {the bsb number in string format} bsb 
 * @param {a function to set the BSB error} setNo 
 * @returns a boolean indicating the validity of the bsb number
 */
const validateBSB = (bsb, setNo) => {
    if (!bsb || !(bsb.length !== 7 || bsb.lastIndexOf('-') !== 3)){return true;}
    setNo("Please enter your BSB in the following format: (XXX-XXX)");
    return;
}

/**
 * @name validateAccountNumber
 * @description This function validates the account number string
 * @param {the account number in string format} accountNum 
 * @param {the function to set the account number string} setNo 
 * @returns 
 */
const validateAccountNumber = (accountNum, setNo) => {
    console.log(accountNum.length)
    if (!(accountNum.length !== 8) || !accountNum){return true;}
    setNo("Please enter your account number the following formatr: (XXXXXXXX)");
    return false;
}

/**
 * @name MyAccountResultsContentComponent
 * @description Designs the UI for a single component to be reused between edit fields on the MyAccount page
 * @param {value, function to change value, name of title}
 * @returns A MyAccountResultsContentComponent Component
 */
const MyAccountResultsContentComponent = ({item, setItem, itemTitle}) => {

    return (
        <Grid container item align={'center'} xs={12}>
            
            <Grid item xs={6} align={'right'}>
                <SecondaryTitle title={itemTitle} />
            </Grid>
            
            <Grid item xs={4} >
                {itemTitle === "Phone Number" ? 
                    <PhoneInput
                        required
                        id="phone-number" 
                        placeholder="phone number" 
                        value={`${item}`}
                        onChange={(e) => setItem(e)}
                        maxLength={15}
                    />
                
                : 
                    <TextField 
                        required
                        label={itemTitle} 
                        defaultValue={`${item}`}
                        variant="outlined" 
                        onChange={(event) => {setItem(event.target.value)}}
                    /> 
                }
            </Grid>
            
        </Grid>
    );
}

/**
 * @name MyAccountResultsContentNoEditComponent
 * @description This component renders user data but does not allow any editing to occur
 * @param {item to print, the title we want to display} param0 
 * @returns A MyAccountResultsContentNoEditComponent Component
 */
const MyAccountResultsContentNoEditComponent = ({item, itemTitle}) => {
    return (
        <Grid container item align={'center'} xs={12} sx={{ m: 0.4 }}>

            <Grid item xs={6} align={'right'}>
                <SecondaryTitle title={itemTitle} />
            </Grid>

            <DesignerColumnSeparator xs={0.8}/>
            
            <Grid item xs={4}>
                <Typography variant="h6" align={'left'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                {item}                           
                </Typography>
            </Grid>
        
        </Grid>
    );
}

/**
 * @name MyAccountResultsContentBankDetails
 * @description Provides the UI for banking details on the MyAccount Page
 * @returns A MyAccountResultsContentBankDetails Component
 */
const MyAccountResultsContentBankDetails = ({bsb, acc, setBSB, setACC, bsbError, setBsbError, accountNumError, setAccountNumError}) => {

    return (
        <Grid container align={'center'} item xs={12} sx={{ m: 3 }}>

            <Grid item xs={12}>
                <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                    Bank Details
                </Typography>
                <br/><br/>
            </Grid> 
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={3} />
            
            <Grid item xs={3} >
                <TextField 
                    required
                    label={'BSB'} 
                    defaultValue={`${bsb}`}
                    variant="outlined" 
                    onChange={(event) => {setBSB(event.target.value)}}
                    onFocus={() => {setBsbError(null)}}
                    onBlur={() => {validateBSB(bsb, setBsbError)}}
                    error={bsbError !== null}
                    helperText={bsbError}
                /> 
            </Grid>
            
            <Grid item xs={3}>
                <TextField 
                    required
                    label={'Account Number'} 
                    defaultValue={`${acc}`}
                    variant="outlined" 
                    onChange={(event) => {setACC(event.target.value)}}
                    onFocus={() => {setAccountNumError(null)}}
                    onBlur={() => {validateAccountNumber(acc, setAccountNumError)}}
                    error={accountNumError !== null}
                    helperText={accountNumError}
                /> 
            </Grid>
            
            <DesignerColumnSeparator xs={3} />
            
        </Grid>
    );
}

/**
 * @name MyAccountResultsContentButtons
 * @description Designs the UI for the My Account page buttons for updating and not saving any changes
 * @param {function definition to handleUpdate} 
 * @returns A MyAccountResultsContentButtons Component
 */
const MyAccountResultsContentButtons = ({handleProfileUpdate}) => {

    let navigate = useNavigate();

    return (
        <Grid container item xs={12}>

            <Grid item xs={6} align={'right'}>
                <Button variant="contained" sx={{backgroundColor: 'red',  m: 2, minWidth: "150px" }} onClick={() => {navigate("/")}}>
                    {"DON'T SAVE"}
                </Button>
            </Grid>

            <Grid item xs={6} align={'left'}>
                <Button variant="contained" onClick={handleProfileUpdate} sx={{ m: 2 }}>
                    {"UPDATE PROFILE"}
                </Button>
            </Grid>
            
        </Grid>
    );
}

/**
 * @name MyAccountResultsContent
 * @description Prints the page content of a successful API call
 * @param {user details, function definition} 
 * @returns A MyAccountResutlsContent Component
 */
const MyAccountResultsContent = ({user, setError}) => {

    const [firstname, setFirstname] = useState(user.FirstName);
    const [lastname, setLastname] = useState(user.LastName);
    const [phone, setPhone] = useState(user.PhoneNo);
    const [bsb, setBSB] = useState(user.BSB);
    const [accountNum, setAccountNum] = useState(user.AccountNum);

    const [successPrompt, setSuccessPrompt] = useState(false);
    
    const [bsbError, setBsbError] = useState(null);
    const [accountNumError, setAccountNumError] = useState(null);

    const handleProfileUpdate = () => {
    
        if (!firstname || !lastname  || !phone){
            setError("Please ensure all fields are filled in!");
            return;
        }

        if ((bsb && !accountNum) || (accountNum && !bsb)){
            setError("Please ensure both bank detail fields are filled in!");
            return;
        }
        
        if (!((`${phone}`.length === 11 && `${phone}`[0] !== '+') || (`${phone}`.length === 12 && `${phone}`[0] === '+'))){
            setError('Please enter a valid phone number!');
            return;
        }

        
        if (!validateBSB(bsb, setBsbError)){
            setError("Please ensure your BSB is in format: (XXX-XXX)");
            return;
        }
        
        if (!validateAccountNumber(accountNum, setAccountNumError)){
            setError("Please ensure your account number is in format: (XXXXXXXX)");
            return;
        }
        
        setError(null);

        mySpacesAPIPUT(`/user`, JSON.stringify({
            UserID: user.UserID,
            FirstName: firstname,
            LastName: lastname,
            PhoneNo: phone,
            BSB: bsb,
            AccountNum: accountNum
        }) , setError, () => {
            setSuccessPrompt(true);
        });
    }

    return (
        <Grid container item xs={12} rowSpacing={1} >
        
            <DesignerRowSeparator />
            <MyAccountResultsContentNoEditComponent item={user.Email} itemTitle={'Email'}/>
            
            <DesignerRowSeparator />
            <MyAccountResultsContentNoEditComponent item={user.Username} itemTitle={'Username'}/>
        
            <DesignerRowSeparator />
            <MyAccountResultsContentComponent item={firstname} setItem={setFirstname} itemTitle={'First Name'}/>
            
            <DesignerRowSeparator />
            <MyAccountResultsContentComponent item={lastname} setItem={setLastname} itemTitle={'Last Name'}/>


            <DesignerRowSeparator />
            <MyAccountResultsContentComponent item={phone} setItem={setPhone} itemTitle={'Phone Number'}/>

            <DesignerRowSeparator />
            <MyAccountResultsContentBankDetails 
                bsb={bsb} 
                acc={accountNum} 
                setBSB={setBSB} 
                setACC={setAccountNum} 
                bsbError={bsbError} 
                setBsbError={setBsbError}
                accountNumError={accountNumError}
                setAccountNumError={setAccountNumError}
            />
            
            <DesignerRowSeparator />
            <MyAccountResultsContentButtons handleProfileUpdate={handleProfileUpdate}/>
        
            <DesignerRowSeparator />
            <DesignerRowSeparator />
            
            <MyAccountThanksPrompt display={successPrompt} setDisplay={setSuccessPrompt}/>
            
        </Grid>
    );

}

/**
 * @name MyAccountResultsError
 * @description In the case that we do not receive good results from the API, this component renders an error
 * @returns A MyAccountResultsError Component
 */
const MyAccountResultsError = () => {
    return (
        <Grid item xs={6}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                {"Something went wrong :( "}
            </Typography>
        </Grid>
    );
}

/**
 * @name MyAccountResults
 * @description In the case that we correctly receive user details from API, we generate this component
 * @param {response object, function definition} 
 * @returns A MyAccountResutls component
 */
const MyAccountResults = ({response, setError}) => {
    if (!response.payload){return <MyAccountResultsError />}
    return <MyAccountResultsContent user={response.payload} setError={setError}/>
}

/**
 * @name MyAccountPage
 * @description Designs the UI for the MyAccount Page and controls all functionality
 - A user can edit any of their details except email and password
 - A user can add in their bank details from this page
 - A user can press a button to save their changes
 * @returns A MyAccountPage Component
 */
export const MyAccountPage = () => {

    const [querying, setQuerying] = useState(true);
    const [response, setResponse] = useState({
        payload: null
    });
    
    const [error, setError] = useState(null);
    
    useEffect(() => {
        handleAccountQuery()
    }, []);
    
    const handleAccountQuery = () => {
        const userID = fetchAuthorisedUserID();
        mySpacesAPIGET(`/user/${userID}`,setError,setResponse,setQuerying);
    }
    

   return (
    <div className="my-account-page">
        <Container maxWidth="md">
            <Card variant="outlined">
                <Grid container rowSpacing={5} columnSpacing={{xs: 1}}>
            
                <DesignerRowSeparator />
                
                <Grid item xs={12} rowSpacing={5}>
                    <Typography align={'center'} variant="h5" sx={{fontWeight: 'bold'}}>
                        My Account Details
                    </Typography>
                </Grid>
                
                {!error ? (null) : 
                    <Grid item xs={12} alignItems='left'>
                        <DesignerColumnSeparator xs={2} />
                        <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                            {error}
                        </ErrorAlert>
                    </Grid>
                }
                
                {querying ? 
                    <LoadingResults /> : <MyAccountResults response={response} setError={setError}/>     
                }
                </Grid>
            </Card>
        </Container>
    </div>  
   );

}