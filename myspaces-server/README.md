
# My Spaces Server
This directory contains the Python3 logic that serves as the backend logic of the MySpaces application. The Psycopg2 library is used to interact with the PostgreSQL database. Data classes (booking, listing, review, user) are implemented to easily handle data coming from the data base. These data objects are used in frontend_interface.py where they are wrapped in response objects for the convenience of the receiving frontend. Error codes are attached to the response objects and are used to communicate the status of the backend to the frontend. Main.py acts as the end-point of the backend and the interface that the frontend directly interacts with. 


## data_class directory
The data_class directory contains required files to provide object mappings between:
* **Database Records** and **Python Objects** for ease of manipulation with the python backend
    * booking.py, listing.py, review.py, user.py, direction_api_cache.py are all data objects for corresponding records within the database tables.
    * All data objects inherit from the generic DataObject (dataobject.py) which implements generic database functions (such as Insert, Get, Update)
    * In addition to a 1-to-1 attribute mapping, each python data class may hold a few utility class functions (Such as insert, get object, get all objects) which call the DataObject superclass with correct database table names and ID column names
* **Python Objects** and **FastAPI Response Bodies** (For sending data to the frontend)
    * frontend_objects.py hold all the expected FastAPI request and response layouts to ensure that body request/response are well-formed and easily parse-able


## search directory
The search directory contains all required files related to the MySpaces search algorithm.
* distance_mapper.py contains simple utility functions for address-coordinate mappings, and calculating distances between listings/suburbs.
    * The free OpenStreetMap Nominatim API call is made from this file.
* search_algorithm.py contains  the main mySpaces search/pt search algorithms.


## car_cleaning_addon directory
The car_cleaning_addon directory contains all files used in pulling our partner website's car detailing services and availability.

## utility directory
The utility directory contains miscellaneous utility functions. Mainly:

* **db_interface.py** makes use of the Psycopg2 library and interacts with the PostgreSQL server. Interface functions for sql commands (select, update, insert, delete) are implemented and are used by the data classes mentioned above.

* **error_code.py** defines a series of error codes that are used to communicate backend status to the frontend.

* **frontend_interface.py** serves as an interface for all backend functionality and is called by main.py, a directory above. The return values of functions are wrapped in the correspoding resposnse objects implemented in **frontend_objects** in the data_class directory.

* email_templates directory contains all the HTML email templates loaded and sent for corresponding events. If more events want email handling, then HTML templates will be added/read from here.
* email_interface.py contains all functions for parsing HTML email templates and connecting to the Google Mail email server to send emails.

## main.py
This file implements the MySpaces Internal API that is called by the front end. FastApi is used to extensively document the routes and usages of the various functions.

# Formatting
To ensure consistent formatting, Black formatter (https://github.com/psf/black) has been used on the myspaces-server codebase.








