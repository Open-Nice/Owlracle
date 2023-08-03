"use client"
import React, { useEffect, useMemo, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const CourseEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className="rate-worse">{dic['Class Mean']}</td>
        <td className="color-light-grey">{dic['Rice Mean']}</td>
        <td className="color-light-grey text-center">{dic['Responses']}</td>
    </tr>
;

const InstructorEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className="rate-worse">{dic['Class Mean']}</td>
        <td className="color-light-grey">{dic['Rice Mean']}</td>
        <td className="color-light-grey text-center">{dic['Responses']}</td>
    </tr>
;

export default function Evaluation(props) {
    const scores = props.scores;
    const comments = props.comments;

    const [yearSemester, setYearSemester] = useState("0");
    const [instructor, setInstructor] = useState("0");

    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const instructors = useMemo(() =>

        yearSemester !== "0" ? 
        
        [...new Set(comments
                    .filter(comment => `${comment.year} ${comment.semester}` === yearSemester)
                    .map(comment => comment.instructor))]

        :

        [... new Set(comments.map(comment => comment.instructor))]

    , [yearSemester]);

    const yearSemesters = useMemo(() =>
        
        instructor !== "0" ?

            [...new Set(comments
                .filter(comment => comment.instructor === instructor)
                .map(comment => `${comment.year} ${comment.semester}`))]

            :

            [... new Set(comments.map(comment => `${comment.year} ${comment.semester}`))]

    , [instructor]);

    const comment = useMemo(() =>

        yearSemester !== "0" && instructor !== "0"  ? 
            
        comments.filter(comment => comment.instructor === instructor
                        && `${comment.year} ${comment.semester}` == yearSemester)[0]
        
        :
       
        null

    , [instructor, yearSemester]);

    const score = useMemo(() =>

        yearSemester !== "0" && instructor !== "0"  ? 
            
        scores.filter(score => score.instructor === instructor
                        && `${score.year} ${score.semester}` == yearSemester)[0]

        :

        null

    , [instructor, yearSemester]);

    return (
        <div>
            <div className='flex items-center'>
                <select onChange={(e)=> {setYearSemester(e.target.value)}} value={yearSemester} className="classcard-dropdown shadow">
                    <option value={"0"}>Year</option>
                    {
                        yearSemesters.map((yearSemester, index) =>
                                {return (<option key={index} value={yearSemester} className="classcard-dropdown-item">
                                    {yearSemester}
                                </option>)}
                        )
                    }
                </select>
                <select onChange={(e)=> {setInstructor(e.target.value)}} value={instructor} className="classcard-dropdown shadow">
                    <option value={"0"}>Instructor</option>
                    {
                        instructors.map((instructor, index) =>
                            <option key={index} value={instructor} className="classcard-dropdown-item">
                                {instructor}
                            </option>
                        )
                    }
                </select>
                <button onClick={() => { setYearSemester("0"); setInstructor("0"); }}>
                    <RefreshRoundedIcon color='inherit'/>
                </button>
                
            </div>
            
            {
                    yearSemester !== "0" && instructor !== "0" ?
                        <>
                            <div className='text-black'>
                                <h5>Course Evaluation</h5>
                                <div> 
                                    <span className='color-green'>Higher than average</span> | 
                                    <span className='color-red'>lower than average, heavier workload</span>
                                </div>

                                <table className="classcard-table">
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
                                        {
                                            comment.comments.map((comment, index) => <div key={index} className='p-3'>{comment}</div>)
                                        }
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
                                                {
                                                    comment.instructor_comments[index].comments.map((comment, index) => <div key={index} className='p-3'>{comment}</div>)
                                                }
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
