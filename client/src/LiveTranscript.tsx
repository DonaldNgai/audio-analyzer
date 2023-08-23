import { useState } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper'
import axios from 'axios';
const FLASK_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT

const LiveTranscriptApp = () => {
    const [transcribedText, setTranscription] = useState("")
    // const getTranscription = async (audioFile) => {
    //     // e.preventDefault();
    //     // fetchAudioFile();

    //     console.log("Getting audio file transcription")

    //     const formData = new FormData();
    //     formData.append('file', audioFile);

    //     const config = {
    //       headers: {
    //           'content-type': 'multipart/form-data'
    //       }
    //     };

    //     await axios.post(
    //       'http://localhost:5000/upload',
    //       formData,
    //       config,
    //     )
    //     .then((res) => {
    //       console.log(res.data);
    //       return res.data
    //     })


    //   };

    const onTranscribe = async (blob: Blob) => {

        console.log(blob)

        const audiofile = new File([blob], "audiofile.mpeg", {
            type: "audio/mpeg",
        });
        const formData = new FormData();
        formData.append("file", audiofile);
        formData.append("model", "whisper-1");

        console.log(audiofile)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        const response = await axios.post(
            `${FLASK_ENDPOINT}/transcribe/file`,
            formData,
            config,
        )
            .then(function (response) {
                const message = response.data["message"]
                // const parsedJson = JSON.parse(response)
                console.log(message)
                setTranscription(transcribedText + " " + message)
            })

        // const { text } = await response.data['message']
        // console.log(response)

        // return {
        //     blob,
        //     text,
        // }
    }

    const {
        recording,
        pauseRecording,
        startRecording,
        stopRecording,
    } = useWhisper({
        autoTranscribe: true, // If this is false, onTranscribe is not called. But this needs to be true in order for onDataCallback to be called
        // callback to handle transcription with custom server
        // onTranscribe: null,
        onDataAvailable: onTranscribe,
        // Set this to false when we want live transcriptions. It will call onDataAvailable
        // customServer: "",
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, // YOUR_OPEN_AI_TOKEN
        streaming: true,
        timeSlice: 5_000, // 1 second
        // whisperConfig: {
        //     language: 'en',
        // prompt : last text TODO: feedback audio into this
        // },

        removeSilence: false, // Setting this to true seems to return an empty audio clip
    })

    return (
        <div>
            <p>Recording: {recording}</p>
            {recording ? (
                <p>Recording In Progress</p>
            ) :
                (
                    <p>Not Recording</p>
                )
            }
            {/* honestly, looking at the code, no idea what this variable is trying to show
            it seems to just show the same info as recording */}
            {/* {speaking ? (
                <p>You are speaking</p>
            ) :
                (
                    <p>Silence</p>
                )
            } */}
            {/* transcribing doesn't mean anything since it's when onTranscribe is called but since we're doing a
            live transcription, we call ondataavailable instead */}
            {/* {transcribing ? (
                <p>Transcribing</p>
            ) :
                (
                    <p>Listening</p>
                )
            } */}
            {/* transcribed test also doens't make sense since it's only useful if the api itself is doing the transcription */}
            {/* <p>Transcribed Text: {transcript.text}</p> */}
            <p>Transcribed Text: {transcribedText}</p>
            <button onClick={() => startRecording()}>Start</button>
            <button onClick={() => pauseRecording()}>Pause</button>
            <button onClick={() => stopRecording()}>Stop</button>
        </div>
    )
}

export default LiveTranscriptApp;