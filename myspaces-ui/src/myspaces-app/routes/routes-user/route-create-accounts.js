import React, { useState } from "react"
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../../components/error-alert/error-alert";
import { mySpacesAPIPOST } from "../../../myspaces-api/myspaces-api-server";

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

/**
 * @name validateEmail
 * @description This function checks if the given email is valid, sets the email error if it is not
 * @param {the email value in string} no 
 * @param {the function to set the email error} setNo 
 * @returns a boolean indicating the emails validity
 */
const validateEmail = (no, setNo) => {
    /* eslint-disable no-useless-escape */
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(no)) {return (true)} 
    setNo("You have entered an invalid email address!");
    return (false);
}

/**
 * @name validatePassword
 * @description This function checks that the user input password meets MySpaces security criteria
 * @param {the password value in string} no 
 * @param {a function to set the password error} setNo 
 * @returns a boolean indicating the passwords validity
 */
const validatePassword = (no, setNo) => {
    /* eslint-disable no-useless-escape */
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(no)) {return true;}
    setNo("Password must be at least 8 characters and contain at least one Uppercase letter, Lowercase letter and number!");
    return false;
}

/**
 * @name validateConfirmedPassword
 * @description This function checks if the confirmed password matches the previous password
 * @param {the original password in string} no 
 * @param {the confirmed password in string} confirmedNo 
 * @param {a function to setht ehc confirmed password error} setConfirmedNo 
 * @returns a boolean indicating the validity of the confirmed password
 */
const validateConfirmedPassword = (no, confirmedNo, setConfirmedNo) => {
    if (no === confirmedNo){return true;}
    setConfirmedNo("Your passwords do not match!");
    return false;
}

/**
 * @name CreateAccountPage
 * @description Designs the UI and Functionality of the create account page
 - If a user does not fill in every field, they are notified to fill in all details
 - If a user enters in an email, phone, or username field that is already being used, they are displayed an error.
 - If a user enters all information correctly, the account is created and they are redircted to login page.
 * @returns A CreateAccountPage Component
 */
export const CreateAccountPage = () => {

    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [username, setUsername] = useState(String);

    const [email, setEmail] = useState(String);

    const [phoneNumber, setPhoneNumber] = useState(Number);
    const [password, setPassword] = useState(String);
    const [passwordConfirmation, setPasswordConfirmation] = useState(String);
    
    const [error, setError] = useState(null);
    
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmedPasswordError, setConfirmedPasswordError] = useState(null);
  
    let navigate = useNavigate();

    const handleCreateUser = () => {
    
        if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !passwordConfirmation){
            setError('Make sure you have filled out all your details please!');
            return;
        }
        
        if (!validateEmail(email, setEmailError)){
            setError("Make sure you have entered your email correctly!");
            return;
        }
        
        if (!((`${phoneNumber}`.length === 11 && `${phoneNumber}`[0] !== '+') || (`${phoneNumber}`.length === 12 && `${phoneNumber}`[0] === '+'))){
            setError('Please enter a valid phone number!');
            return;
        }
        
        if (!validatePassword(password, setPasswordError)){
            setError('Please enter a valid password!');
            return;
        }

        if (!validateConfirmedPassword(password, passwordConfirmation, setConfirmedPasswordError)) {
            setError("Please ensure your your confirmed password matches your original password!");
            return;
        }
        
        mySpacesAPIPOST("/user", 
            JSON.stringify({
                Username: username,
                UserPassword: password,
                Email: email,
                FirstName: firstName,
                LastName: lastName,
                PhoneNo: phoneNumber,
                IsAdmin: false
        }),
        setError, () => {}, () => {navigate('/Log%20In')})
    }
  
    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": { m: 1.5 },
                    p: 2
                }}
                noValidate
                autoComplete="off"
            >
            
                {!error ? (null) : 
                    <ErrorAlert severity="error" onClick={() => setError(null)}>
                        {error !== "Passed Identification Number is already in use!" ? error : "This email is already in use!"}
                    </ErrorAlert>
                }
                
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            align="center"
                        >
                            Create MySpaces Account
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                            required 
                            id="first name" 
                            label="first name" 
                            fullWidth 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                            required 
                            id="last name" 
                            label="last name" 
                            fullWidth 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            required 
                            id="username" 
                            label="username" 
                            fullWidth 
                            onChange={(e) => setUsername(e.target.value)}
                        />                    
                    </Grid>

                    <Grid item xs={12}>
                    <TextField
                        required
                        onChange={(e) => {setEmail(e.target.value)}}
                        id="email" 
                        label="email" 
                        fullWidth
                        onFocus={() => {setEmailError(null)}}
                        onBlur={() => {validateEmail(email, setEmailError)}}
                        error={emailError !== null}
                        helperText={emailError}
                    />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <PhoneInput
                            required
                            id="phone-number" 
                            placeholder="phone number" 
                            value={""}
                            onChange={(value) => setPhoneNumber(value)}
                            maxLength={15}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            type="password"
                            id="password"
                            label="password"
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => {setPasswordError(null)}}
                            onBlur={() => {validatePassword(password, setPasswordError)}}
                            error={passwordError !== null}
                            helperText={passwordError}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            type="password"
                            id="password-confirmation"
                            label="confirm password"
                            fullWidth
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            onFocus={() => {setConfirmedPasswordError(null)}}
                            onBlur={() => {validateConfirmedPassword(password, passwordConfirmation, setConfirmedPasswordError)}}
                            error={confirmedPasswordError !== null}
                            helperText={confirmedPasswordError}
                        />
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button 
                            variant="contained" 
                            onClick={handleCreateUser}
                        >
                            Create Account
                        </Button>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button
                            component={Link} to="/log%20In"
                        >
                            Already have an account?
                            <br />
                            Sign in
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};
