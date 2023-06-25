/**
 * Google Map component file
 * 
 * @author E.Omer Gul
 */


import React from "react";
import {decode} from "@googlemaps/polyline-codec"
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Polyline,
} from "@react-google-maps/api"
import { transitOptions, transitOutlineOptions, iconsUrls } from "./visual-options";
import { GOOGLEMAPSAPIKEY } from "../../config/config";

const mapContainerStyle = {
    width: "40vw",
    height: "50vh",
}

export function Map({lat, lng, polylineString, transitMethod}) {

  const [markers, setMarkers] = React.useState([]);
  const [startMarkers, setStartMarkers] = React.useState([]);
  const [middleMarkers, setMiddleMarkers] = React.useState([]);
  const [polylines, setPolylines] = React.useState([]);

  const {isLoaded,loadError} = useLoadScript({
      googleMapsApiKey: GOOGLEMAPSAPIKEY
  });

  if (loadError) return `Error loading maps ${loadError}`;
  if (!isLoaded) return "Loading Maps";

  var encodedArray = []
  if (polylineString) { // NULL CHECK
    encodedArray = polylineString.split("!") // The poly line comes is in such a way that each leg of travel is separated by a ! char
  }

  var transitArray = []
  if (polylineString) { // NULL CHECK
    transitArray = transitMethod.split("|") // The poly line comes is in such a way that each leg of travel is separated by a ! char
  }

  var decodedObjects = []; // this is an object of the form
  var decodedObjectsArray = []; // this is an array of objects of the form 

  encodedArray.forEach(function(string) { // iterating through each leg of travel
       decodedObjects = [];
       const decoded = decode(string, 5) // takes in encoded string and spits out an array of objects of the form bellow
       decoded.forEach(function(pair) { 
           var temp = {
               lat: pair[0],
               lng: pair[1]
           }
           decodedObjects.push(temp)
       })
       decodedObjectsArray.push(decodedObjects)
  })

  var temp
  const startPoints = []
  const middlePoints = []
  const endPoints = []
  const listOfPolylines = [] // We populate this for the polyline component below to call
  decodedObjectsArray.forEach(function(decodedObject,index) { // we loop through the dataobjcets that we have to get start point mid points and total polylines
      var tempobj = {
          key: index,
          path: decodedObject
      }

    temp = decodedObject[0]
    startPoints.push(temp) 

    temp = decodedObject[Math.floor(decodedObject.length/2)]
    middlePoints.push(temp)

    temp = decodedObject[decodedObject.length - 1]
    endPoints.push(temp)

    listOfPolylines.push(tempobj)

  })

  const lastObect = decodedObjectsArray[decodedObjectsArray.length -1]
  var lastPoint
  if (lastObect) {
      lastPoint = lastObect[lastObect.length -1]
  }

  if (startPoints.length === 0) {
    startPoints.push({lat: lat,lng: lng})
  }

  return (

    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={startPoints[0]} options={{ gestureHandling: 'none'}} onTilesLoaded={() => {
        setMarkers({key:100, position: startPoints[0]});
      
        setPolylines(listOfPolylines)
        setStartMarkers(startPoints)
        setMiddleMarkers(middlePoints)
      }}> 

        {polylines.map((decodedObject, index) => ( // prints polyline  and polyline outline (for visuals)
          <div>
            <Polyline key={polylines[index].key+200} path={polylines[index].path} options={transitOutlineOptions[transitArray[index]]}/>
            <Polyline key={polylines[index].key+100} path={polylines[index].path} options={transitOptions[transitArray[index]]}/>
          </div>
        ))}
        
        <Marker key={markers.key} position={markers.position}/>

        {startMarkers.map((bruh,index) => ( // printing white dot at the start of each polyline
          <Marker key={index+50} position={startMarkers[index+1]} icon={"http://labs.google.com/ridefinder/images/mm_20_white.png" }/> 
        ))}

        {middleMarkers.map((bruh,index) => ( // printing transit icons in middle of polyline
          <Marker key={index+50} position={middleMarkers[index]} icon={iconsUrls[transitArray[index]]}/> 
        ))}

        <Marker key={markers.key + 1 } position={lastPoint}/> 

    </GoogleMap>

   )
}



