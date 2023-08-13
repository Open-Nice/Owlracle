"use client"
import React, {useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'
import {useDropzone} from 'react-dropzone'
import {CloudUploadOutlined} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import {uploadFile, uploadURL, getUser} from "@/app/upload"
import "../components/stylings/general.css"
import "../components/stylings/upload.css"

export default function DropZoneAreaBtn () {
  const [userId, setUserId] = useState();
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedFilesZone, setSelectedFilesZone] = useState(<></>)
  const [submitBtn, setSubmitBtn] = useState("Submit")

  async function setId(){
    const getUserId = await getUser();
    setUserId(getUserId.id);
  }
  
  function calcFileTotalSize(uploadFiles){
    var totalsize = 0
    for (var i = 0; i < uploadFiles.length; i++) {
        totalsize += parseInt(uploadFiles[i].size)
    }
    return totalsize
  }

  const isValidUrl = urlString=> {
        let url;
        try { 
            url = new URL(urlString); 
        }
        catch(e){ 
            return false; 
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

  async function handleSubmit(){
    if (description.trim() === "") {
        toast.error("Please type in something in your info description. Otherwise I won't be able to acurrately understand the info!");
        return;
    }
    if (url.trim() === "" && files.length === 0) {
        toast.error("Please submit at least a url or a file.");
        return;
    }
    setSubmitBtn(
        <div className='text-white'><CircularProgress color='inherit' size={20}/></div>
    )

    if (url.trim() !== "") {
        if (! isValidUrl(url)) {
            toast.error("Url not valid. May be you forget to add 'https'?");
            setSubmitBtn("Submit");
            return;
        }
        const result = await uploadURL(description, url, userId)
        if (result !== 0) {
            toast.error(result)
            setSubmitBtn("Submit");
            return;
        }
    }

    for (var i = 0; i < files.length; i++){
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadFile(description, formData, userId);
        if (result !== 0) {
            toast.error(result)
            setSubmitBtn("Submit");
            return;
        }
    }

    setDescription("");
    setUrl("");
    setFiles([]);
    
    setSubmitBtn("Submit");
    toast.success("Info successfully uploaded!")
  }

  const handleDelete = (deleteFile) => {
    setFiles(files.filter((file)=>{return (file.name !== deleteFile.name)}))
  };


  const onDrop = (acceptedFiles) => {
    if (calcFileTotalSize(files) + calcFileTotalSize(acceptedFiles) > 52428800){
        toast.error("Total file size excceed limit. Maximum total file size: 50MB.");
        return;
    }
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

  useEffect(()=>{
    setId();
  }, [])

    return (
        <form onSubmit={handleSubmit}>
            <div className='upload-span'>Description *</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='Give me a short description of the info you upload!' 
                className='upload-input' required value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <div className='upload-span'>Url</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='A link to google doc, website, etc.' className='upload-input' value={url} onChange={(e)=>setUrl(e.target.value)}/>
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
                <button className='upload-submit-btn shadow' type='submit'>{submitBtn}</button>
            </div>
        </form>
        
    )
  
}