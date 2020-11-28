import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className='f3'>
          {'Smart-brain will detect faces in your pictures. Give it a try.'}
      </p>
      <p>
          {"(Smart-brain won't work with data/image(base64) types of images)"}
      </p>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} placeholder="Enter image link" />
          <button 
            className='w-30 f4 link ml2 ph3 pv2 dib black ba b--black br2 bg-white hover-bg-black bg-animate hover-white'
            onClick={onButtonSubmit}> 
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;