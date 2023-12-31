import { useState } from 'react';
import axios from 'axios';
const FLASK_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT

// const model = "whisper-1";


// const [file, setFile] = useState();
// const [filename, setFileName] = useState('Choose File');
// const [response, setResponse] = useState(null)

// const onChange = e => {
//   setFile(e.target.files[0]);
//   setFileName(e.target.files[0].name);
// };

const getTranscription = async (audioFile) => {
  // e.preventDefault();
  // fetchAudioFile();

  console.log("Getting audio file transcription")

  const formData = new FormData();
  formData.append('file', audioFile);
  console.log(audioFile)

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };

  await axios.post(
    `${FLASK_ENDPOINT}/transcribe/file`,
    formData,
    config,
  )
    .then((res) => {
      console.log(res.data);
      return res.data
    })


};

export default getTranscription

  // return (
  //   <div className='App'>
  //     <form onSubmit={getTranscription}>
  //       <div className='custom-file'>
  //         <input
  //           type='file'
  //           className='custom-file-input'
  //           id='customFile'
  //           onChange={onChange}
  //         />
  //         <label className='custom-file-label' htmlFor='customFile'>
  //           {filename}
  //         </label>
  //       </div>
  //       <input
  //         type='submit'
  //         value='Upload'
  //         className='btn btn-primary btm-block mt-4'
  //       />
  //     </form>
  //     {/* {prediction && <h1>{prediction.message}</h1>} */}
  //     {response && <h1>{JSON.stringify(response, null, 2)}</h1>}
  //   </div>
  // );

