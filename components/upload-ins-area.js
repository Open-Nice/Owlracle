"use client"
import React, {useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress';
import {uploadURL, getUser} from "@/app/upload"
import Tags from "@/components/upload-tags"
import "../components/stylings/general.css"
import "../components/stylings/upload.css"

const defaultTagList = ["Club Ins Page", "Undergraduate Events","Graduate Events", 
    "Visual/Performing Arts Events", "Sport Events", "Culture/International Events", "Environment/Sustainability Events",
     "STEM Events", "Academic Events", "Special Interest Events", "Spiritial Events", "Residential College Events", 
    "Courses", "Research", "Art Department", "Computer Science Department", "Music Department"];
export default function InsArea () {
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
          toast.error("Please give me your club name. Otherwise I won't be able to acurrately understand the info!");
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
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <div className='color-mid-purple' style={{marginBottom: "20px"}}> 
                <span>👀</span> Check out the clubs already in support 
                <a target='_blank' href='https://docs.google.com/document/d/1Ge-diK3vwA-AcSh1lSCn99-QE-F6txnSuhQhSXtfiPs/edit?usp=sharing' className='color-dark-purple font-bold'> HERE</a> !</div>
            <div className='upload-span'>Club name:</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='The coolest name ever...'
                className='upload-input' required value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            {/* <Tags/> */}
            <div className='upload-span'>Club ins/facebook page (URL):</div>
            <div style={{paddingRight: "20px"}}>
                <input placeholder='e.g. https://www.instagram.com/riceuniversity' className='upload-input' value={url} onChange={(e)=>setUrl(e.target.value)} required/>
            </div>
            <div className='d-flex justify-content-end full-width'>
                <button className='upload-submit-btn shadow' type='submit'>{submitBtn}</button>
            </div>
        </form>

    )

}