'use client'

import React, { useState, useMemo } from 'react';
import useSWR from 'swr'

const CourseEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className="rate-worse">{dic['Class Mean']}</td>
        <td className="color-light-grey">{dic['Rice Mean']}</td>
        <td className="color-light-grey text-center">{dic['Responses']}</td>
    </tr>

const InstructorEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className="rate-worse">{dic['Class Mean']}</td>
        <td className="color-light-grey">{dic['Rice Mean']}</td>
        <td className="color-light-grey text-center">{dic['Responses']}</td>
    </tr>

const Evaluation= ( {scores, comments} ) => {
  const [yearSemester, setYearSemester] = useState(null);
  const [instructor, setInstructor] = useState(null);

  const instructors = useMemo(() =>

      yearSemester ? 
      
      [...new Set(comments
                  .filter(comment => `${comment.year} ${comment.semester}` === yearSemester)
                  .map(comment => comment.instructor))]

      :

      [... new Set(comments.map(comment => comment.instructor))]

  , [yearSemester]);

  const yearSemesters = useMemo(() =>
      
      instructor ?

          [...new Set(comments
              .filter(comment => comment.instructor === instructor)
              .map(comment => `${comment.year} ${comment.semester}`))]

          :

          [... new Set(comments.map(comment => `${comment.year} ${comment.semester}`))]

  , [instructor]);

  const comment = useMemo(() =>

      instructor && yearSemester  ? 
          
      comments.filter(comment => comment.instructor === instructor
                      && `${comment.year} ${comment.semester}` == yearSemester)[0]
      
      :
     
      null

  , [instructor, yearSemester]);

  const score = useMemo(() =>

      instructor && yearSemester  ? 
          
      scores.filter(score => score.instructor === instructor
                      && `${score.year} ${score.semester}` == yearSemester)[0]

      :

      null

  , [instructor, yearSemester]);

  return (
      <div>
          <div className='d-flex align-items-center'>
              <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className='me-2'>{yearSemester ? yearSemester : "Year"}</div>
                  </button>
                  <ul className="dropdown-menu">
                      {
                          yearSemesters.map((yearSemester, index) =>
                                  <li key={index}>
                                      <a className="dropdown-item" href="#" onClick={() => setYearSemester(yearSemester)}>
                                          {yearSemester}
                                      </a>
                                  </li>
                          )
                      }
                  </ul>
              </div>
              <div className="dropdown mx-2">
                  <button className="btn btn-secondary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className='me-2'>{instructor ? instructor : "Instructor"}</div>
                  </button>
                  <ul className="dropdown-menu">
                      {
                          instructors.map((instructor, index) =>
                              <li key={index}>
                                  <a className="dropdown-item" href="#" onClick={() => setInstructor(instructor)}>
                                      {instructor}
                                  </a>
                              </li>
                          )
                      }
                  </ul>
              </div>
              <i className="bi bi-arrow-counterclockwise fs-4" style={{cursor: "pointer"}} onClick={() => { setYearSemester(null); setInstructor(null); }}></i>
          </div>
          
          {
                  yearSemester && instructor ?
                      <>
                          <div className='mt-3'>
                              <h5>Course Evaluation</h5>
                              <div> 
                                  <span className='color-green'>Higher than average</span> | 
                                  <span className='color-red'>lower than average, heavier workload</span>
                              </div>

                              <table className="my-3 text-black table table-sm table-striped table-borderless">
                                  <thead className="color-mid-grey">
                                      <tr>
                                          <th>Ratings</th>
                                          <th>Class Mean</th>
                                          <th>Rice Mean</th>
                                          <th>Responses</th>
                                      </tr>
                                  </thead>

                                  <tbody>
                                      <CourseEvalComponent text={"Course Organization:"} dic={score.organization} />
                                      <CourseEvalComponent text={"Assignment Quality:"} dic={score.assignment} />
                                      <CourseEvalComponent text={"Overall Rating:"} dic={score.overall_quality} />
                                      <CourseEvalComponent text={"Course Challenge:"} dic={score.challenge} />
                                      <CourseEvalComponent text={"Course Workload:"} dic={score.workload} />
                                      <CourseEvalComponent text={"Why take this course:"} dic={score.why_take_this_course} />
                                      <CourseEvalComponent text={"Expected grade:"} dic={score.expected_grade} />
                                      <CourseEvalComponent text={"Expected P&F:"} dic={score.expectedPF} />
                                  </tbody>

                              </table>


                              <div className='color-light-purple'>Student comments</div>
                              <div className='student-comment-frame'>
                                  <Scrollbars autoHide autoHideTimeout={250} 
                                              renderThumbVertical={({ style, ...props }) =>
                                                  <div {...props} style={{ ...style, backgroundColor: '#2b2b2b', borderRadius:"5px"}}/>
                                              }>
                                      
                                      {
                                          comment.comments.map((comment, index) => <div key={index} className='p-3'>{comment}</div>)
                                      }
                                  
                                  </Scrollbars>
                              </div>
                          </div>

                          {
                              score.instructor_evaluations.map((instructor_evaluation, index) => 
                                  <div key={index} className='mt-3'>
                                      <h5>{instructor_evaluation['instructor']}</h5>
                                      <div> <span className='color-green'>Higher than average</span> | <span className='color-red'>lower than average, heavier workload</span></div>
                                      <table className="my-3 text-black table table-sm table-striped table-borderless">
                                          <thead className="color-mid-grey">
                                              <tr>
                                                  <th>Ratings</th>
                                                  <th>Class Mean</th>
                                                  <th>Rice Mean</th>
                                                  <th>Responses</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <InstructorEvalComponent text = {"Organization:"} dic = {instructor_evaluation['Organization']}/>
                                              <InstructorEvalComponent text = {"Presentation:"} dic = {instructor_evaluation['Presentation']}/>
                                              <InstructorEvalComponent text = {"Responsiveness:"} dic = {instructor_evaluation['Responsiveness']}/>
                                              <InstructorEvalComponent text = {"Class Atmosphere:"} dic = {instructor_evaluation['Class Atmosphere']}/>
                                              <InstructorEvalComponent text = {"Independence:"} dic = {instructor_evaluation['Independence']}/>
                                              <InstructorEvalComponent text = {"Stimulation:"} dic = {instructor_evaluation['Stimulation']}/>
                                              <InstructorEvalComponent text = {"Knowledge:"} dic = {instructor_evaluation['Knowledge']}/>
                                              <InstructorEvalComponent text = {"Effectiveness:"} dic = {instructor_evaluation['Effectiveness']}/>
                                              <InstructorEvalComponent text = {"Responsibility:"} dic = {instructor_evaluation['Responsibility']}/>
                                          </tbody>
                                      </table>

                                      <div className='color-light-purple'>Student comments</div>

                                      <div className='student-comment-frame'>
                                          <Scrollbars autoHide autoHideTimeout={250} 
                                                      renderThumbVertical={({ style, ...props }) =>
                                                          <div {...props} style={{ ...style, backgroundColor: '#2b2b2b', borderRadius:"5px"}}/>
                                                      }>

                                              
                                              {
                                                  comment.instructor_comments[index].comments.map((comment, index) => <div key={index} className='p-3'>{comment}</div>)
                                              }

                                          </Scrollbars>
                                      </div>

                                  </div>
                              )
                          }
                      
                      </>
                  :
                      <></>
          }

      </div>

)
}

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
