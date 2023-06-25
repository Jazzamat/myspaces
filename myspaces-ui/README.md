# My Spaces Frontend UI

This directory contains the JavaScript logic that serves as the frontend logic of the MySpaces application.  Everything contained within the source code of this directory is code that is presented to the user in the form of a user interface.  All user experience and user interface design is managed by the developers who work closesly to this directory.  This directory is organised accordingly so post deployment of the applciation (the code) is maintainable and readable longterm.


## src directory

The src directory is the main codebase single filesystem in the frontend UI section of the application. Through this directory, the applciation manages all of its UI design and functionalities.  

## src/myspaces-app directory

The myspaces-app directory from within the src folder manages our program execution point and manages all of the routing pages in the application. The file 'myspaces-app' serves as our developer entry point into the application display from which we generate all of the components, pages, and functionalties from.  

The route directory inside myspaces-app presents a complete set of all the possible routes on the platform.  From searching for car spaces, booking car spaces, listing car spaces and to account managements, everything is contained within this file.  From within the routing pages, these functional components reach into the components folder and grab individual sections as required on the user interface.  

## src/myspaces-api directory

The myspaces-api directory manages any frontend api managers that are required to achieve specific functionalities in the MySpaces application.  There exist two files in here

 - myspaces-api-server
 - myspaces-api-cookies
 
These two files respectively manage all function calls to the MySpaces server and any interactions MySpaces has with the users browser cookies.   The functions encapsulated within these two files are used throughout the rest of the frontend code base and are crucial to the functionality of the application.  

## src/error directory

The error directory is a single folder and file that is responsible for the manner in which we handle error codes in the application.  In the case that a request to the MySpaces server results in a violation of some rule our functionalities insist on maintaining, error-handler inside the error folder helps us map the types of error codes to an associated string description of the violation.  From this implementation, the application is able to analyse the descriptions of the error and handle them appropriately.

## src/components directory

The components directory is the bulk of the MySpaces Frontend UI code base.  It contains the single components that are called from the routing pages of the application.  Each child of the components folder is a single component which has inbuilt logic and functionality that it adds to the Frontend in some manner.  Examples are the calendar component, that is reused on two of the pages.  Before searching for a listing, a date and time is required.  The calendar component offers a friendly way for the user to insert a date and time.  The use of the MySpaces components library also avoids the build up of duplicated code across the application.  

## src/config directory

This directory manages any type of private/public key configurations the application requires for API and cloud based services.  In the file: src/config/config.js a potential 'marker' of the application will need to insert the required API key accordingly.  






