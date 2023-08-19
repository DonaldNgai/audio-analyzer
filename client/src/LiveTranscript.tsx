import { useWhisper } from '@chengsokdara/use-whisper'

const LiveTranscriptApp = () => {
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

        const base64 = await new Promise<string | ArrayBuffer | null>(
            (resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.readAsDataURL(blob)
            }
        )
        const body = JSON.stringify({ file: base64, model: 'whisper-1' })
        const headers = { 'Content-Type': 'application/json' }
        const { default: axios } = await import('axios')
        const response = await axios.post('/api/whisper', body, {
            headers,
        })
        const { text } = await response.data
        // you must return result from your server in Transcript format
        return {
            blob,
            text,
        }
    }

    const {
        recording,
        speaking,
        transcribing,
        transcript,
        pauseRecording,
        startRecording,
        stopRecording,
    } = useWhisper({
        // callback to handle transcription with custom server
        onTranscribe: onTranscribe,
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, // YOUR_OPEN_AI_TOKEN
        // streaming: true,
        // timeSlice: 1_000, // 1 second
        // whisperConfig: {
        //     language: 'en',
        // },
        removeSilence: true,
    })

    return (
        <div>
            <p>Recording: {recording}</p>
            <p>Speaking: {speaking}</p>
            <p>Transcribing: {transcribing}</p>
            <p>Transcribed Text: {transcript.text}</p>
            <button onClick={() => startRecording()}>Start</button>
            <button onClick={() => pauseRecording()}>Pause</button>
            <button onClick={() => stopRecording()}>Stop</button>
        </div>
    )
}

export default LiveTranscriptApp;