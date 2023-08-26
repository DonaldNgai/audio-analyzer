import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReceiveAudioApp from './DragnDropApp'; // Imports App.js and css and stuff
import LiveTranscriptApp from './LiveTranscript'; // Imports App.js and css and stuff
import reportWebVitals from './reportWebVitals';
import logger from 'loglevel';

const isDevelopment = process.env.NODE_ENV === 'development';
logger.setDefaultLevel(isDevelopment ? logger.levels.DEBUG : logger.levels.ERROR); // This seems to set it even for livetranscript, amazing!

// Script entry

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // This indicates specific checks are to be ran for App whenever compiles
  <React.StrictMode>
    <ReceiveAudioApp />
    <LiveTranscriptApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(logger.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(logger.log);
