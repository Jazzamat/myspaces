import './myspaces-app.css';

import React from 'react'
import { Routes, Route, Navigate, Outlet} from "react-router"

import {checkCookie} from "../myspaces-api/myspaces-api-cookie";
import{HeaderBar} from '../components/header-bar/header-bar';

import {AdminPage} from './routes/routes-user/route-admin-dashboard';
import {MyAccountPage} from './routes/routes-user/route-view-accounts';
import {SpaceBookingPage} from './routes/routes-booking/route-create-bookings';
import {EditMyListingPage} from './routes/routes-listing/route-edit-listings'
import {SpaceRegistrationPage} from "./routes/routes-listing/route-create-listings";
import {ViewMyBookingsPage} from './routes/routes-booking/route-view-bookings';
import {ViewMyListingsPage} from './routes/routes-listing/rute-view-listings';
import {LandingPage} from "./routes/routes-searching/route-landing";
import {SpaceSearchPage} from './routes/routes-searching/route-searching';

import {CreateAccountPage} from "./routes/routes-user/route-create-accounts";
import {LoginPage} from "./routes/routes-user/route-login";

/**
 * @name AdminAuthorisedRoutes
 * @description Protects any nested route in this component to admin only
 * @returns Route that was prompted by the user or the landing page depenidng on authorisation
 */
const AdminAuthorisedRoutes = () => {
  return checkCookie('IsAdmin') ? <Outlet /> : <Navigate to="/"/>;
}

/**
 * @name UserAuthorisedRoutes
 * @description Protects any nested route in this component to user logged in only
 * @returns Route that was prompted by the user or the login page depending on authorisation
 */
const UserAuthorisedRoutes = () => {
  return checkCookie('MySpacesActiveSessionUserID') ? <Outlet /> : <Navigate to="/Log%20In"/>;
}

/**
 * @name GuestAuthorisedRoutes
 * @description Protects any nested route in this component to guest user only
 * @returns Route that was prompted by the user or the landing page depending on authorisation
 */
const GuestAuthorisedRoutes = () => {
  return !checkCookie('MySpacesActiveSessionUserID') ? <Outlet /> : <Navigate to="/"/>;
}

/**
 * @name GeneralRoutes
 * @description Wrapper for any route that does not require any protection from user authorisation whatsoever
 * @returns Route that was prompted by the user
 */
const GeneralRoutes = () => {
  return <Outlet />
}

/**
 * @name MySpacesAppRoutes
 * @description This component controls all the routing between pages on the platform.
 * @returns Nested Routing Component
 */
const MySpacesAppRoutes = () => {

  return (
    <Routes>

      <Route element={<UserAuthorisedRoutes />} >
        <Route path="/My%20Account" element={<MyAccountPage/>} />
        <Route path ="/List%20A%20Space" element={<SpaceRegistrationPage/>} />
        <Route path="/View%20My%20Listings" element={<ViewMyListingsPage/>}/>
        <Route path="/View%20My%20Bookings" element={<ViewMyBookingsPage />} />
        <Route path="/Edit%20My%20Listing" element={<EditMyListingPage />} />
        <Route path="/Space%20Booking%20Page" element={<SpaceBookingPage />} />
      </Route>
      
      <Route element={<GuestAuthorisedRoutes />}>
        <Route path="/Log%20In" element={<LoginPage/>}/>
        <Route path="/Create%20Acount" element={<CreateAccountPage/>}/>
      </Route>
      
      <Route element={<GeneralRoutes />}>
        <Route path="/" element={<LandingPage/>}/>
        <Route path='Space%20Search%20Page' element={<SpaceSearchPage />}/>
      </Route>

      <Route element={<AdminAuthorisedRoutes />}>
        <Route path="/Admin" element={<AdminPage/>}/>
      </Route>
      
    </Routes>
  );
}

/**
 * @name MySpacesApp
 * @description Main Application Component for the MySpacesPlatform
 * @returns React Component
 */
export const MySpacesApp = () => {
  
  return (
    <div className="myspaces-app">
      <HeaderBar/>
      <MySpacesAppRoutes />
    </div>
  );
}