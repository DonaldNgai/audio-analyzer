import { useState, useRef } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper'
import axios from 'axios';
const FLASK_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT

const LiveTranscriptApp = () => {
    const [transcribedText, setTranscription] = useState("")
    const [audio, setAudio] = useState("");
    const [counterHook, updateCounter] = useState(0)
    const stateRef = useRef<number>(0);
    const maxRuns = 1

    stateRef.current = counterHook;

    const onLiveBase64 = async (blob: Blob) => {

        if (stateRef.current < maxRuns) {
            console.log(`onLiveBase64 ${stateRef.current + 1}`)

            const audioUrl = URL.createObjectURL(blob);
            setAudio(audioUrl);

            const base64 = await new Promise<string | ArrayBuffer | null>(
                (resolve) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.readAsDataURL(blob)
                }
            )

            const body = JSON.stringify({ file: base64, model: 'whisper-1' })
            const config = {
                headers: {
                    'content-type': 'application/json',
                }
            };

            updateCounter(counterHook => counterHook + 1)
            console.log(stateRef.current)
            const response = await axios.post(
                `${FLASK_ENDPOINT}/transcribe/livebase64`,
                body,
                config,
            )
            const { text } = await response.data['message']
            return {
                blob,
                text,
            }
        }


        return {
            blob,
        }
    }

    const onLiveBlob = async (blob: Blob) => {

        if (stateRef.current < maxRuns) {
            console.log(`onLiveBlob ${stateRef.current + 1}`)

            const audioUrl = URL.createObjectURL(blob);
            setAudio(audioUrl);

            const body = new FormData();

            body.append("file", blob);
            body.append("model", "whisper-1");

            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            };

            updateCounter(counterHook => counterHook + 1)

            const response = await axios.post(
                `${FLASK_ENDPOINT}/transcribe/liveblob`,
                body,
                config,
            )
            const { text } = await response.data['message']

            return {
                blob,
                text,
            }
        }
        // const stream = response.data
        // stream.on('data', (data: { [x: string]: any; }) => {
        //     console.log(data)
        //     const message = data["message"]
        //     //     // const parsedJson = JSON.parse(response)
        //     console.log(message)
        //     setTranscription(transcribedText + " " + message)

        // })

        // stream.on('end', () => {
        //     console.log("done")
        // })
        // .then(function (response) {
        //     const message = response.data["message"]
        //     // const parsedJson = JSON.parse(response)
        //     console.log(message)
        //     setTranscription(transcribedText + " " + message)
        // })

        // console.log(response)

        return {
            blob
        }
    }

    const {
        recording,
        pauseRecording,
        startRecording,
        stopRecording,
    } = useWhisper({
        autoTranscribe: false, // If this is false, onTranscribe is not called. But this needs to be true in order for onDataCallback to be called
        // callback to handle transcription with custom server
        // onTranscribe: onTranscribe,
        onDataAvailable: onLiveBase64,
        // Set this to false when we want live transcriptions. It will call onDataAvailable
        // customServer: "",
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, // YOUR_OPEN_AI_TOKEN
        streaming: true,
        timeSlice: 4_000, // 1 second
        // whisperConfig: {
        //     language: 'en',1
        // removeSilence is practically useless for me. I will remove it myself in server
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
            <p>Send Counter: {counterHook}</p>
            <button onClick={() => startRecording()}>Start</button>
            <button onClick={() => pauseRecording()}>Pause</button>
            <button onClick={() => stopRecording()}>Stop</button>
            {audio ? (
                <div className="audio-container">
                    <audio src={audio} controls></audio>
                    <a download href={audio}>
                        Download Recording
                    </a>
                </div>
            ) : null}
        </div>
    )
}

export default LiveTranscriptApp;