import { useState } from 'react';
import axios from 'axios';

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

  const formData = new FormData();
  formData.append('file', audioFile);

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

