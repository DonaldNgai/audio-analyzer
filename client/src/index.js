import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReceiveAudioApp from './DragnDropApp'; // Imports App.js and css and stuff
import LiveTranscriptApp from './LiveTranscript'; // Imports App.js and css and stuff
import reportWebVitals from './reportWebVitals';

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
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
