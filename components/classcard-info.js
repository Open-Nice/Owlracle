'use client'

import React, { useEffect, useState } from 'react';


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
  };
  
  useEffect(() => {

    // console.log(catalog)

    fetch('/api/eval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {'course' : {'cField': 'COMP', 'cNum': '140'} } )
    })        
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error fetching data:', error))

  }, []);

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
        {/* Evaluation here */}
        {/* <Evaluation cFieldNum = {cFieldNum.split(' ')[0]} cNum = {cFieldNum.split(' ')[1]}/> */}
    
    </div>
  )
}
