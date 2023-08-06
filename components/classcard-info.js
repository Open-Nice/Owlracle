'use client'

import React, { useState, useMemo } from 'react';
import useSWR from 'swr'
import Evaluation from "./classcard-evaluation"
import CircularProgress from '@mui/material/CircularProgress';
import "@/components/stylings/general.css"
import '@/components/stylings/classCard.css'

export default function ClassCardInfo( { catalog }) {
  // console.log('catalog: ', catalog)
  const courseInfo = {
    cFieldNum: `${catalog.cField} ${catalog.cNum}`,
    course_name: `${catalog.course_name}`,
    course_long_title: `${catalog.course_long_title}`,
    course_credit: `${catalog.course_credit}`,
    course_department: `${catalog.course_department}`,
    course_type: `${catalog.course_type}`,
    distribution:  catalog.distribution === 'N/A' ? null : `${catalog.distribution}`,
    grade_mode: `${catalog.grade_mode}`,
    language_instruction: `${catalog.language_instruction}`,
    description: catalog.description  === 'N/A' ? null : `${catalog.description}`,
  }

  const fetcher = (url, body) => 
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())

  const fetchWithBody = (body) => (url) => fetcher(url, body)

  const { data, error } = useSWR(
    '/api/eval', 
    fetchWithBody({'course' : {'cField': `${catalog.cField}`, 'cNum': `${catalog.cNum}`}})
  )

  return (
    <div className='text-black'>
        <div className='mb-3'>
            <div className='color-mid-purple' style={{fontSize: "1.25em"}}>Basic Information</div>
            <div><b>Course Name:</b> {courseInfo.course_name}</div>
            <div><b>Long Title:</b> {courseInfo.course_long_title}</div>
            <div><b>Credit Hours:</b> {courseInfo.course_credit}</div>

            <div><b>Course Type:</b> {courseInfo.course_type}</div>
            {courseInfo.distribution ? <div><b>Distribution:</b> {courseInfo.distribution}</div> : <></>}
            <div><b>Grade Mode:</b> {courseInfo.grade_mode}</div>

            <div><b>Course Department:</b> {courseInfo.course_department}</div>
            <div><b>Language of Instruction:</b> {courseInfo.language_instruction}</div>
            {courseInfo.description ? <div><b>Course Description:</b> {courseInfo.description}</div> : <></>}
        </div>

        <div className='color-mid-purple' style={{fontSize: "1.25em"}}>Evaluation</div>
        {
          error || !data || ! (data.cField == catalog.cField && data.cNum == catalog.cNum)?
          // evaluation is still loading
          <div className="spinner-border text-secondary" role="status">
              {/* <span className="visually-hidden">Loading...</span> */}
              <CircularProgress color='inherit'/>
          </div>
          :
          // Evaluation here
          <Evaluation scores = {data.scores} comments = {data.comments}/>
        }
    </div>
  )
}
