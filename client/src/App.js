import React, {useCallback, useState, useRef} from 'react';
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import logo from './logo.svg'; // Give logo a link from a variable
import './App.css';

// Import the useDropzone hooks from react-dropzone
import { useDropzone } from "react-dropzone"
// Import cuid which allows easy Unique ID generation
import cuid from "cuid"
// Need to pass which type element can be draggable, its a simple string or Symbol. This is like an Unique ID so that the library know what type of element is dragged or dropped on.
const dragType = "Image"; 
let acceptedFormats = 'application/pdf, image/*';

// Function to allow easy debugging as we can upload an image by clicking a button
var uploadImageToServer = async (path, images, setImages) => {
    const resp = await fetch(path);
    const blob = await resp.blob();
    handleOnDrop([blob], images, setImages);
}

//Figure out splice and unique id

// simple way to check whether the device support touch (it doesn't check all fallback, it supports only modern browsers)
const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};

// Create a state called images using useState hooks and pass the initial value as empty array
// States are important in react as it tells when the DOM model gets
// Re-rendered. It rerenders when a state changes
const Image = ({ image, index, moveImage }) => {
    const ref = useRef(null); // Initialize the reference

    // useDrop hook is responsible for handling whether any item gets hovered or dropped on the element
    // useDrop provides a reference returned "drop" which we can use to identify what is droppable
    const [, drop] = useDrop({
        // Accept will make sure only these element type can be droppable on this element
        accept: dragType,
        // Called when an item is hovered over the component
        hover(item) { // item is the dragged element hovering over component
            // If somehow ref is invalid, don't do anything.
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index; // index of dragged component
            const hoverIndex = index; // index of component hovered on
            // If the dragged element is hovered in the same place, then do nothing
            if (dragIndex === hoverIndex) { 
                return;
            }

            // If it is dragged around other elements, then move the image and set the state with position changes
            moveImage(dragIndex, hoverIndex);
            /*
            Update the index for dragged item directly to avoid flickering
            when the image was half dragged into the next
            */
            item.index = hoverIndex;
        }
    });

    // useDrag will be responsible for making an element draggable. It also expose, isDragging method to add any styles while dragging
    const [{ isDragging }, drag] = useDrag(() => ({
        // what type of item this to determine if a drop target accepts it
        type: dragType,
        // data of the item to be available to the drop methods
        item: { id: image.id, index },
        // method to collect additional data for drop handling like whether is currently being dragged
        collect: (monitor) => {
          return {
            isDragging: monitor.isDragging(), // This is destructuring?
          };
        },
    }));

    /* 
        Initialize drag and drop into the element using its reference.
        Here we initialize both drag and drop on the same element (i.e., Image component)
    */
    drag(drop(ref));

    return (
        // Add reference to the element to be dragged
        <div className="file-item"
        ref={ref}
        style={{ opacity: isDragging ? 0 : 1 }}
        >
            <img alt={'img - ${image.id}'} src={image.src} className="file-img" />
        </div>
    );
};

const ImageList = ({ images, setImages }) => {
    console.log("Rendering imagelist")
    console.log(images)

    // Helper function for when we drag an image and need to move it
    // Placing it here so we have access to images list
    const moveImage = (dragIndex, hoverIndex) => {
        // Get the dragged element
        const draggedImage = images[dragIndex];
        /*
          - copy the dragged image before hovered element (i.e., [hoverIndex, 0, draggedImage])
          - remove the previous reference of dragged element (i.e., [dragIndex, 1])
          - here we are using this update helper method from immutability-helper package
        */
        // setImages is the state updater function
        setImages(
            // Use immutability helper update function
            update(images, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]
            })
        );
    };

    // render each image by calling Image component
    const renderImage = ( image, index ) => {
        return image ? (
            <Image image={image} index={index} key={'${image.id}-image'} moveImage={moveImage}/>
        ): null;
    };

    // Return the list of files
    return (
        <section className="file-list">
            {images.map(renderImage)}
        </section>
    );
};

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

function handleOnDrop(acceptedFiles, images, setImages)
{
    console.log("Handle onDrop")

    acceptedFiles.map(file => {
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
            setImages(prevState => [ ...prevState, { id: cuid(), src: e.target.result }]);
            console.log("Read. Setting images");
            
        };
        // Read the file as Data URL (since we accept only images)
        reader.readAsDataURL(file);
        console.log(file);
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
    let filePath = "./logo192.png"

    const onDrop = useCallback(acceptedFiles => {
        // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
        handleOnDrop(acceptedFiles, images, setImages);
    }, []);

    // We pass onDrop function and accept prop to the component. It will be used as initial params for useDropzone hook
    return (
        <main className="App">
            <h1 className="text-center">Drag and Drop Example</h1>
            <Dropzone onDrop={onDrop} accept={acceptedFormats} />
            <button onClick={() => uploadImageToServer(filePath, images, setImages)}>ADD IMAGE</button>
            <DndProvider backend={backendForDND}>
                <ImageList images={images} setImages={setImages} />
            </DndProvider>
        </main>
    );
};

export default DropAudioApp;
