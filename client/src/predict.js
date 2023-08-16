import { useState } from 'react';
import axios from 'axios';

const model = "whisper-1";
// app.post('/api/transcribe', upload.single('file'), async (req, res) => {
//     try {
//       const  audioFile  = req.file;
//       if (!audioFile) {
//         return res.status(400).json({ error: 'No audio file provided' });
//       }
//       const  formData  =  new  FormData();
//       const  audioStream  =  bufferToStream(audioFile.buffer);
//       formData.append('file', audioStream, { filename: 'audio.mp3', contentType: audioFile.mimetype });
//       formData.append('model', 'whisper-1');
//       formData.append('response_format', 'json');
//       const  config  = {
//         headers: {
//           "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       };
//       // Call the OpenAI Whisper API to transcribe the audio
//       const  response  =  await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
//       const  transcription  = response.data.text;
//       res.json({ transcription });
//     } catch (error) {
//       res.status(500).json({ error: 'Error transcribing audio' });
//     }
//   });

const PredictApp = () => {
  const [file, setFile] = useState();
  const [filename, setFileName] = useState('Choose File');
  const [prediction, setPrediction] = useState(null);
  const [response, setResponse] = useState(null)

  const onChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const fetchAudioFile = async () =>{
    const formData = new FormData();
    formData.append('model', model);
    formData.append('file', file);
    console.log(file);
    console.log("Sending");

    

    axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          "Content-Type" : "multipart/form-data",
          // Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,

        },

      }
    )
    .then((res) => {
      console.log(res.data);
      setResponse(res.data);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const onSubmit = async e => {
    e.preventDefault();
    // fetchAudioFile();

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };

    axios.post(
      'http://localhost:5000/upload',
      formData,
      config,
    )
    // fetch('http://localhost:5000/upload', {
    //   method: 'POST',
    //   body: formData
    // })
      // .then(res => res.json())
      // .then(data => {
      //   console.log(data);
      //   setPrediction(data);
      // });
  };

  return (
    <div className='App'>
      <form onSubmit={onSubmit}>
        <div className='custom-file'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btm-block mt-4'
        />
      </form>
      {/* {prediction && <h1>{prediction.message}</h1>} */}
      {response && <h1>{JSON.stringify(response, null, 2)}</h1>}
    </div>
  );
};

export default PredictApp;