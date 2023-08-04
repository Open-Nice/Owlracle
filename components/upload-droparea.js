"use client"
import React, {useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import {CloudUploadOutlined} from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import "../components/stylings/general.css"
import "../components/stylings/upload.css"

export default function DropZoneAreaBtn () {
  const [files, setFiles] = useState([]);
  const [selectedFilesZone, setSelectedFilesZone] = useState(<></>)

  const handleDelete = (deleteFile) => {
    setFiles(files.filter((file)=>{return (file.name !== deleteFile.name)}))
  };

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles])
  }
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  useEffect(()=>{
    setSelectedFilesZone(
        files.length > 0 ?
        <div>
            <p className='text-black' style={{marginTop: "10px", marginBottom: "5px"}}>Selected files: </p>
            <div className='select-files-block'>
            {
                files.map((file, idx)=>{
                    return (
                    <div key={idx} className='selected-file-chip'>
                        <Chip label={file.name} variant='outlined' 
                        sx={{maxWidth: "350px"}}
                        onDelete={()=>handleDelete(file)} />
                    </div>)
                })
            }
            </div>
            
        </div>
        
        :
        <></>
    )
  }, [files])

    return (
        <form>
            <div className='upload-span'>Info Description *</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='Give me a one-sentence description of your info!' className='upload-input' required/>
            </div>
            <div className='upload-span'>Url</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='A link to google doc, website, etc.' className='upload-input'/>
            </div>
            <div className='upload-span'>File(s)</div>
            <div {...getRootProps()} className={isDragActive? 'upload-dropzone-drag':'upload-dropzone'}>
                <input {...getInputProps()} />
                <div className='upload-dropzone-content'>
                    <CloudUploadOutlined fontSize='large' color='inherit'/>
                    <p>Drag and drop files here, or click to select files</p>
                </div>
            </div>
            {selectedFilesZone}
            <div className='d-flex justify-content-end full-width'>
                <button className='upload-submit-btn shadow' type='submit'>Submit</button>
            </div>
        </form>
        
    )
  
}