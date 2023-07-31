import React, { useRef, useState } from 'react'
import {CloudUploadOutlined} from '@mui/icons-material';

export default function UploadFileBtn(props) {
    const hiddenFileInput = useRef();
    const [selectedFile, setSelectedFile] = useState();
    // const [fileContent, setFileContent] = props.fileContentSetup;
    const [isFilePicked, setIsFilePicked] = useState(false);

    function handleFileUpload(e){
        e.preventDefault();
        hiddenFileInput.current.click();
    }

    function handleFileChange(e){
        setSelectedFile(e.target.files[0]);
        // setFileContent(e.target.files[0]);
        setIsFilePicked(true);
    }

  return (
    <div className='upload-button-wrapper'>
        <button className='upload-button' onClick={(e)=>handleFileUpload(e)}>
            <div className='d-flex align-items-center full-width text-black'>
                <CloudUploadOutlined/>
                <p className='m-3'>Choose a file to upload</p>
            </div>
        </button>
        <input className="form-control" type="file" id="formFile" ref={hiddenFileInput} 
        onChange={handleFileChange} style={{display: "none"}}/>
        {
            isFilePicked ?
            <div className='d-flex align-items-center m-3'>
                <div className='mx-2'>
					{selectedFile.name}
				</div>
                <button className='upload-submit-btn' style={{backgroundColor: `${props.bgColor}`}}
                    type='submit'
                    // onClick={props.handleSubmit}
                > 
                    SUBMIT
                </button>
            </div>
            :
            <></>
        }
    </div>
  )
}
