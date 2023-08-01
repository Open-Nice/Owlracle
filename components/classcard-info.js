import React from 'react'

export default function ClassCardInfo() {
  const courseInfo = {
    cFieldNum: "COMP 140",
    course_name: "COMP 140",
    course_long_title: "basics of computer programming",
    course_credit: 4,
    course_department: "cs",
    course_type: "balabala",
    distribution: "d3",
    grade_mode: "letter grade",
    language_instruction: "English",
    description:"balablablablabflafaea"

  };
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
