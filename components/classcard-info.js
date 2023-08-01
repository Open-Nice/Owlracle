'use client'

import React, { useEffect, useState } from 'react';
import useSWR from 'swr'

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
    <div className='p-3 p-lg-5 text-black'>
        <h2>{courseInfo.cFieldNum}</h2>
        <div className='mb-3'>
            <h4 className='color-light-purple'>Course Basic Information</h4>
            <div>Course Name: {courseInfo.course_name}</div>
            <div>Long Title: {courseInfo.course_long_title}</div>
            <div>Credit Hours: {courseInfo.course_credit}</div>

            <div>Course Type: {courseInfo.course_type}</div>
            {courseInfo.distribution ? <div>Distribution: {courseInfo.distribution}</div> : <></>}
            <div>Grade Mode: {courseInfo.grade_mode}</div>

            <div>Course Department: {courseInfo.course_department}</div>
            <div>Language of Instruction: {courseInfo.language_instruction}</div>
            {courseInfo.description ? <div>Course Description: {courseInfo.description}</div> : <></>}
        </div>
        
        <h4 className='color-light-purple'>Course Evaluation</h4>
        {
          error || !data ?
          // evaluation is still loading
          <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
          </div>
          :
          <span>Eval shown here</span>
          // Evaluation here
          // <Evaluation scores = {data.scores} comments = {data.comments}/>
        }
    </div>
  )
}
