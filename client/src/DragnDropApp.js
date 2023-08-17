import React, {useCallback, useState, useRef} from 'react';
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import getTranscription from './predict';
import './DragnDropApp.css';
// import getFileObjectFromLocalPath from 'get-file-object-from-local-path';

// Import the useDropzone hooks from react-dropzone
import { useDropzone } from "react-dropzone"
// Import cuid which allows easy Unique ID generation
import cuid from "cuid"
// Need to pass which type element can be draggable, its a simple string or Symbol. This is like an Unique ID so that the library know what type of element is dragged or dropped on.
const dragType = "Image"; 
let acceptedFormats = ['m4a', 'mp3', 'webm', 'mp4', 'mpga', 'wav', 'mpeg', 'ogg', 'oga', 'flac'];



//#region Helper Functions 

// Function to allow easy debugging as we can upload an image by clicking a button
const addFileFromButtonPress = async (path) => {
    // const fileData = new getFileObjectFromLocalPath.LocalFileData(path)
    // const file = getFileObjectFromLocalPath.constructFileFromLocalFileData(fileData)
    // The handleOnDrop funciton expects a list of file objects.
    // The following two lines reads the file at the path and puts it into a blob oject.
    const resp = await fetch(path);
    const blob = await resp.blob();
    var file = new File([blob], path.replace(/^.*[\\\/]/, ''));
    handleOnDrop([file]);
}


//Figure out splice and unique id

// simple way to check whether the device support touch (it doesn't check all fallback, it supports only modern browsers)
const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};

//#endregion

const Dropzone = ({ onDrop, accept }) => {
    // Initializing useDropzone hooks with options
    // Hooks exposed by useDropZone. Need to pass it a callback function. so we pass onDrop

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept
    });

    /* useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean  */

    return (
        <div className="dropzone-div" {...getRootProps()}>
            <input className="dropzone-input" {...getInputProps()} />
            <div className="text-center">
                {isDragActive ? (
                  <p className="dropzone-content">Release to drop the files here</p>
                ) : (
                  <p className="dropzone-content">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                )}
            </div>
        </div>
    );

};

function handleOnDrop(droppedFiles)
{
    console.log("Handle onDrop")
    console.log(droppedFiles)

    droppedFiles.map(file => {
        // Initialize FileReader Browser API
        const reader = new FileReader();
        // This callback function gets called
        // after the file is read
        console.log(`Reading ${file.name}`)
        reader.onload = function (e)
        {
            // add the image into the state. 
            // Since FileReader reading process is asynchronous, 
            // its better to get the latest snapshot state (i.e., prevState) 
            // and update it. 
            // setImages(prevState => [ ...prevState, { id: cuid(), src: e.target.result }]);
            // console.log("Read. Setting images");
            getTranscription(file)
            
        };
        // // Read the file as Data URL (since we accept only images)
        // reader.readAsDataURL(file);
        // console.log(file);
        return file;
    }, []);
}

function DropAudioApp(){
    // This can't be globally defined as it is a react hook so it must exist within function
    const [images, setImages] = useState([]); 
    // Assigning backend based on touch support on the device
    const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

    // let blob = getFileBlob("logo192.png");
    // let blob = new File("./logo192.png")
    let filePath = "./84-121123-0000.flac"

    const onDropFunction = useCallback(droppedFiles => {
        // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
        handleOnDrop(droppedFiles);
    }, []);

    // We pass onDrop function and accept prop to the component. It will be used as initial params for useDropzone hook
    return (
        <main className="App">
            <h1 className="text-center">Drag and Drop Example</h1>
            <Dropzone onDrop={onDropFunction} accept={acceptedFormats} />
            <button onClick={() => addFileFromButtonPress(filePath)}>Add Audio File</button>
            <DndProvider backend={backendForDND}>
                
            </DndProvider>
        </main>
    );
};

export default DropAudioApp;
