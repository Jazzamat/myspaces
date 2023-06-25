import React, { useState, useEffect } from 'react';
import { timeDuration } from "../../../components/calendar/time-duration";
import { Card, CardContent, Typography, Container, Grid, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingResults } from '../../../components/loading-animation/loading-animation';
import { ErrorAlert } from '../../../components/error-alert/error-alert';
import { fetchAuthorisedUserID } from '../../../myspaces-api/myspaces-api-cookie';
import { mySpacesAPIGET, mySpacesAPIPOST } from '../../../myspaces-api/myspaces-api-server';
import { CarCleaningManager } from '../../../components/car-cleaning/car-cleaning-manager';
import { Map } from "../../../components/map/map";

/**
 * @name validateRegistration
 * @description This function governs the validation criteria for a car registration number
 * @param {theRegistrationNumber} param0
 * @param {functionToSetRegistrationError} param1
 * @returns boolean indicating whether or not it's valid
 */
const validateRegistration = (no, setNo) => {
    if (`${no}`.length === 7 && `${no}`[3] === '-'){return true;}
    setNo("Make sure you format like: (XXX-XXX)");
    return false;
}

/**
 * @name validateCardNumber
 * @description This function governs the validation criteria for a card number
 * @param {value to compare against} param0
 * @param {function to set the card number error} param1
 * @returns boolean indicating whether or not it's valid
 */
const validateCardNumber = (no, setNo) => {
    if (`${no}`.length === 16){return true;}
    setNo("Make sure you format like: (XXXXXX...XX)");
    return false;
}

/**
 * @name validateSecurityNumber
 * @description This function governs the validation crtieria for a card number
 * @param {value to comapre against} param0 
 * @param {function to set the security number error} param1
 * @returns boolean indicating whether or not it's valid
 */
const validateSecurityNumber = (no, setNo) => {
    if (`${no}`.length == 3){return true;}
    setNo("Make sure you format like: (XXX)");
    return false;
}

/**
 * @name validateExpiry
 * @description This function governs the validation criteria for a card number
 * @param {value to compare against} param0
 * @param {function to set the expiry error} param1
 * @returns boolean indicating whether or not it's valid
 */
const validateExpiry = (no, setNo) => {
    if (`${no}`.length == 5 && `${no}`[2] === '/'){return true;}
    setNo("Make sure you format like: (MM/YY)");
    return false;
}

/**
 * @name SpaceBookingTransitSummary
 * @description THis component will print the transit routing descruiptions for the PT routing!
 * @param {the API response for the PT call} param0 
 * @returns A SpaceBookingTransitSummary
 */
const SpaceBookingTransitSummary = ({responsePT}) => {

    if (!responsePT.payload || responsePT.payload.TransitSummary === ''){return;}
    
    const transits = responsePT.payload.TransitSummary.split('|');

    return (
        <Grid item xs={12}>
            <br/>
            <Card align={'left'} style= {{backgroundColor: "#F0F8FF" }}>
                <CardContent>
                    <Typography component={"span"}gutterBottom sx={{ fontSize: 16}} align="left">
                        <p><b>Transit Summary:</b></p>
                        {transits.map((transit) => {
                            return <p>{transit}</p>
                        })}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

/**
 * @name SpaceBookingPage
 * @description Designs the UI and functionality of the Space Registration process
 - A user can enter all their required details into this page
 - If the user enters information incorrectly, they are notified appropriately
 - A user cannot book a prebooked slot
 - A user will be able to see what the availability is on the car space
 - If the booking is successful, they are redirected to the my bookings page.
 * @returns A SpaceBookingPage Component
 */
export const SpaceBookingPage = () => {

    const [querying, setQuerying] = useState(true);
    const [error, setError] = useState('');
    const [response, setResponse] = useState({
        payload: null
    });
    
    const [responsePT, setResponsePT] = useState({
        payload: null
    });

    useEffect(() => {
        if (!querying){return;}
        const listingID = (new URL(document.location)).searchParams.get('listingID');
        const suburbPT = (new URL(document.location)).searchParams.get('suburbPT');
        
        mySpacesAPIGET(`/listings/${listingID}`, setError, setResponse, setQuerying);
    
        if (suburbPT !== 'null') {
            mySpacesAPIGET(`/listings/${listingID}/pt?suburb=${suburbPT}`, setError, setResponsePT, () => {});
        }
        
    });

    return (
        <div>
            {!error ? (null) : 
                <Grid container item xs={12} alignItems='left'>
                    <br/>
                    <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                        {error}
                    </ErrorAlert>
                </Grid>
            }
            {querying ? 
                <LoadingResults /> : <SpaceBookingForm spotDetails={response.payload} responsePT={responsePT} setError={setError}/>    
            }
        </div>
    )
}

/**
 * @name SpaceBookingForm
 * @description Once the API returns from querying, this component is rendered to the user
 * - Checks validatin criteria for all card details and car registration
 * - Loads car space cleaning add-ons asyncronously to rest of page
 * - Loads car space map and public transport asyncronously to rest of page
 * @param {spot details object, function to set error} param0 
 * @returns A SpaceBookingForm Component
 */
const SpaceBookingForm = ({spotDetails, responsePT, setError}) => {

    const listingID = (new URL(document.location)).searchParams.get('listingID');
    var startDateTime = (new URL(document.location)).searchParams.get('startBooking');
    var finishDateTime = (new URL(document.location)).searchParams.get('finishBooking');

    startDateTime = startDateTime.slice(4, startDateTime.length - 44)
    finishDateTime = finishDateTime.slice(4, finishDateTime.length - 44)

    const [cardNumber, setCardNumber] = useState();
    const [cardExpiry, setCardExpiry] = useState();
    const [securityCode, setSecurityCode] = useState();
    const [registrationNumber, setRegistrationNumber] = useState();

    const [costOfAddon, setCostOfAddon] = useState(0);
    const [bookingChosen, setBookingChosen] = useState(null);
    
    const [registrationError, setRegistrationError] = useState(null);
    const [cardNumberError, setCardNumberError] = useState(null);
    const [expiryError, setExpiryError] = useState(null);
    const [securityCodeError, setSecurityCodeError] = useState(null);

    const [queryingAddons, setQueryingAddons] = useState(true);
    const [queryingBookingTimes, setQueryingBookingTimes] = useState(true);
   
    let navigate = useNavigate();

    const handleBooking = () => {
      
        if (!startDateTime || !finishDateTime || !cardNumber || !cardExpiry || !securityCode){
            setError('Make sure you have filled in all fields');
            return;
        }

        if (Number(costOfAddon) !== 0 && bookingChosen === null) {
            setError('Make sure you have selected an Addon Service Times');
            return
        }
        
        if (!validateRegistration(registrationNumber, setRegistrationError)){
            setError("Make sure you've entered your car registration in the following format: (XXX-XXX)!");
            return;
        }
        
        if (!validateCardNumber(cardNumber, setCardNumberError)){
            setError("Make sure you've entered your card number in the following format: (XXXXXX...XX)!");
            return;
        }
        
        if (!validateExpiry(cardExpiry, setExpiryError)){
            setError("Make sure you've entered your card expiry in the following format: (XX/XX)!");
            return;
        }
        
        if (!validateSecurityNumber(securityCode, setSecurityCodeError)){
            setError("Make sure you've entered your security number in the following format: (XXX)!");
            return;
        }

        if (queryingAddons || queryingBookingTimes){
            setError("Please wait until we have finished fetching potential add-on services!");
            return;
        }

        const callback = () => {
            navigate("/View%20My%20Bookings");
            document.location.reload();
        }
        
        mySpacesAPIPOST("/bookings/", JSON.stringify({
            BookedBy: fetchAuthorisedUserID(),
            BookedSpace: listingID,
            StartDate: startDateTime,
            EndDate: finishDateTime,
            TotalCost: spotDetails.HourlyPrice * timeDuration(startDateTime, finishDateTime) + Number(costOfAddon),
            Plate: registrationNumber,
            CardNo: cardNumber,
            CardExpiry: cardExpiry,
            SecurityCode: securityCode
        }),
        setError, callback);
    }

    return (
        <Container maxWidth="md">
        <br/>
        <Card variant="outlined">
        <Box
        component="form"
        sx={{'& .MuiTextField-root': { m: 1.5}, p: 3}}
        noValidate
        autoComplete="off"
        >
        <br/>
        <Typography component={"span"} gutterBottom variant="h4"> 
            Car Space Booking 
        </Typography>
        <br/>
        <br/>

        
        <Grid 
        container 
        alignItems="center"
        justifyContent="center"
        sx={{ m: 1.3 }}
        >
            <Grid item xs={12}>
                <Card align={'left'} style= {{backgroundColor: "#F0F8FF" }}>
                    <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                    Address: {`${spotDetails.StreetNumber} ${spotDetails.Street}, ${spotDetails.Suburb}, ${spotDetails.PostCode}`}
                    </Typography>

                    <Typography gutterBottom variant="body1">
                    - Cost Per Hour: ${spotDetails.HourlyPrice} 
                    </Typography>

                    <Typography gutterBottom variant="body1">
                    - Size: {`Width: ${spotDetails.Width} Metres, Depth: ${spotDetails.Depth} Metres, Height: ${spotDetails.Height} Metres`}
                    </Typography>

                    <br/>

                    <Typography gutterBottom variant="h6">
                    Description:
                    </Typography>

                    <Typography gutterBottom variant="body2" color="text.secondary">
                    {spotDetails.Notes}
                    </Typography>

                    <br/>

                    <Typography gutterBottom variant="h6">
                    Booking Time Details:
                    </Typography>

                    <Typography gutterBottom variant="body1">
                    - Check-in is: {startDateTime} <br/>
                    - Check-out is: {finishDateTime} <br/>
                    </Typography>

                    </CardContent>
                </Card>
            </Grid>

            
            <Grid item xs={12} justifyContent="center" align={"center"} style={{position: 'relative', width: "40vw"}}>
                <br/>
                <Card align={'center'} style= {{backgroundColor: "#F0F8FF" }}>
                    
                    <CardContent>
                        <Map 
                            lat={spotDetails.Latitude} 
                            lng={spotDetails.Longitude} 
                            polylineString={responsePT.payload ? responsePT.payload.Polyline:null } 
                            transitMethod={responsePT.payload ? responsePT.payload.TransitMethod:null} />
                    </CardContent>
                </Card>
            </Grid>  
            
            <SpaceBookingTransitSummary responsePT={responsePT ?? null}/>
            
            <Grid item xs={12} align="center">
               <CarCleaningManager 
                    setCostOfAddon={setCostOfAddon} 
                    setBookingChosen={setBookingChosen} 
                    startDateTime={startDateTime} 
                    finishDateTime={finishDateTime}
                    queryingAddons={queryingAddons}
                    setQueryingAddons={setQueryingAddons}
                    queryingBookingTimes={queryingBookingTimes}
                    setQueryingBookingTimes={setQueryingBookingTimes}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography component={"span"} gutterBottom sx={{ fontSize: 18}}>   
                    <b>Car Details:</b><br/>
                    <TextField
                        required
                        id="outlined-required"
                        label="Registration Plate"
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        onFocus={() => {setRegistrationError(null)}}
                        onBlur={() => {validateRegistration(registrationNumber, setRegistrationError)}}
                        error={registrationError !== null}
                        helperText={registrationError}
                    />
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography component={"span"} gutterBottom sx={{ fontSize: 18}}>   
                    <p><b>Billing Details:</b></p>

                    <TextField
                        required
                        id="outlined-required"
                        label="Card Number"
                        onChange={(e) => setCardNumber(e.target.value)}
                        onFocus={() => {setCardNumberError(null)}}
                        onBlur={() => {validateCardNumber(cardNumber, setCardNumberError)}}
                        error={cardNumberError !== null}
                        helperText={cardNumberError}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        label="Expiry"
                        onChange={(e) => setCardExpiry(e.target.value)}
                        onFocus={() => {setExpiryError(null)}}
                        onBlur={() => {validateExpiry(cardExpiry, setExpiryError)}}
                        error={expiryError !== null}
                        helperText={expiryError}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        label="Security Code"
                        onChange={(e) => setSecurityCode(e.target.value)}
                        onFocus={() => {setSecurityCodeError(null)}}
                        onBlur={() => {validateSecurityNumber(securityCode, setSecurityCodeError)}}
                        error={securityCodeError !== null}
                        helperText={securityCodeError}
                    />

                </Typography>
            </Grid>

            <Grid item xs={3}>
                <br/><br/>
                <Card style = {{backgroundColor: "#F0F8FF" }}>
                    <Typography component={"span"} gutterBottom sx={{ fontSize: 18}}>   
                        <p><b>Total Cost for Period:</b></p>
                        <Card variant="outlined">
                            {spotDetails.HourlyPrice * timeDuration(startDateTime, finishDateTime) + Number(costOfAddon)}
                        </Card>
                    </Typography>
                </Card>
                <br/>
            </Grid>
            
            <Grid item xs={12}>
                <Button variant="contained" sx={{ m: 2 }} onClick={handleBooking}>
                Confirm Booking
                </Button>
            </Grid>

        </Grid>

        </Box>
        </Card>
        </Container>
    );
}

