"use client"
import React, {useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress';
import {uploadURL, getUser} from "@/app/upload"
import "../components/stylings/general.css"
import "../components/stylings/upload.css"

export default function SuggestionArea ({question}) {
  const [userId, setUserId] = useState();
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [submitBtn, setSubmitBtn] = useState("Submit")

  async function setId(){
    const getUserId = await getUser();
    setUserId(getUserId);
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
        toast.error("Please type in something as description of the topic for improvement. Otherwise I won't be able to acurrately understand the info!");
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

    setDescription("");
    setUrl("");

    setSubmitBtn("Submit");
    toast.success("Info successfully uploaded!")
  }

  useEffect(()=>{
    setId();
    if (question != ""){
        setDescription(question)
    }
  }, [])

    return (
        <form onSubmit={handleSubmit}>
            <div className='upload-span'>Question I did poorly:</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='e.g. Where can I find finance career fairs?'
                className='upload-input' required value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <div className='upload-span'>Where I could find answer (URL):</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='https://' className='upload-input' value={url} onChange={(e)=>setUrl(e.target.value)} required/>
            </div>
            <div className='d-flex justify-content-end full-width'>
                <button className='upload-submit-btn shadow' type='submit'>{submitBtn}</button>
            </div>
        </form>

    )

}