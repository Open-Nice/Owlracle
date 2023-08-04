"use client"
import React, { useEffect, useMemo, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const CourseEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className={dic['Class Mean'] <= dic['Rice Mean']?"rate-better":"rate-worse"}>{dic['Class Mean']}</td>
        <td className="color-mid-grey">{dic['Rice Mean']}</td>
        <td className="color-mid-grey">{dic['Responses']}</td>
    </tr>
;

const InstructorEvalComponent = ({text, dic}) => 
    <tr className="align-middle">
        <td className="fw-bold">{text}</td>
        <td className={dic['Class Mean'] <= dic['Rice Mean']?"rate-better":"rate-worse"}>{dic['Class Mean']}</td>
        <td className="color-mid-grey">{dic['Rice Mean']}</td>
        <td className="color-mid-grey">{dic['Responses']}</td>
    </tr>
;

export default function Evaluation(props) {
    const scores = props.scores;
    const comments = props.comments;
    const [checkComments, setCheckComments] = useState([])

    const [yearSemester, setYearSemester] = useState("0");
    const [instructor, setInstructor] = useState("0");

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

    function handleCheckComment(e, idx){
        e.preventDefault();
        var checkList = checkComments;
        checkList[idx] = !checkList[idx]
        setCheckComments([...checkList]);
    }

    useEffect(()=>{
        setCheckComments([]);
        const checkNum = score?.instructor_evaluations.length + 1;
        const checkList = [];
        for (var i = 0; i < checkNum; i++) {
            checkList.push(false);
        }
        setCheckComments([...checkList]);
    }, [])

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
                <div className='tooltip'>
                    <button onClick={() => { setYearSemester("0"); setInstructor("0"); }} className='color-mid-purple cursor-pt'>
                        <RefreshRoundedIcon color='inherit'/>
                    </button>
                    <span className='tooltiptext tooltip-reset shadow bg-white text-black'>Reset</span>
                </div>
                
            </div>
            
            {
                    yearSemester !== "0" && instructor !== "0" ?
                        <>
                            <div className='text-black mt-4'>
                                <b>Course Evaluation</b>
                                <div style={{paddingLeft: "5px"}}>
                                    <div className='color-mid-grey'> 
                                        <span className='color-green'>Higher than average</span> {" | "} 
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


                                    <div className='flex justify-between items-center' style={{marginTop: "30px", marginBottom: "5px"}}>
                                        <div className='color-mid-purple'>Student comments</div>
                                        <button className='comment-type-btn shadow color-mid-grey' onClick={(e)=>{handleCheckComment(e, 0)}}>
                                            <SearchRoundedIcon/>
                                            See comment <span className='color-green'>positivity</span>/<span className='color-red'>negativity</span>
                                        </button>
                                    </div>

                                    <div className='student-comment-frame'>
                                        <div className='student-comment-scroll-wrapper'>
                                            {
                                                comment.comments.map((comment, idx) => 
                                                    <div key={idx} className='p-3'>
                                                        <div className='student-comment'>
                                                            {
                                                                checkComments[0] ?
                                                                <div className='student-comment-judgement bg-red'></div>
                                                                :
                                                                <></>
                                                            }
                                                            {comment}
                                                        </div>
                                                    </div>
                                                
                                                )
                                            }
                                        </div>                    
                                    </div>
                                </div>
                                
                            </div>

                            {
                                score.instructor_evaluations.map((instructor_evaluation, index) => 
                                    <div key={index} className='mt-4'>
                                        <b>Instructor Evaluation: {instructor_evaluation['instructor']}</b>
                                        <div style={{paddingLeft: "5px"}}>
                                            <div> <span className='color-green'>Higher than average</span> {" | "} <span className='color-red'>lower than average, heavier workload</span></div>
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

                                            <div className='flex justify-between items-center' style={{marginTop: "30px", marginBottom: "5px"}}>
                                                <div className='color-mid-purple'>Student comments</div>
                                                <button className='comment-type-btn shadow color-mid-grey' onClick={(e)=>{handleCheckComment(e, index + 1)}}>
                                                    <SearchRoundedIcon/>
                                                    See comment <span className='color-green'>positivity</span>/<span className='color-red'>negativity</span>
                                                </button>
                                            </div>

                                            <div className='student-comment-frame'>
                                                <div className='student-comment-scroll-wrapper'>
                                                    {
                                                        comment.instructor_comments[index].comments.map((comment, idx) => 
                                                        <div key={idx} className='p-3'>
                                                            <div className='student-comment'>
                                                                {
                                                                    checkComments[index + 1] ?
                                                                    <div className='student-comment-judgement bg-red'></div>
                                                                    :
                                                                    <></>
                                                                }
                                                                {comment}
                                                            </div>
                                                        </div>
                                                        )
                                                    }
                                                </div>                                      
                                            </div>
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
