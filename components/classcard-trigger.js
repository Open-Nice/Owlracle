"use client"
import React, { useEffect, useState } from 'react'
import {randomColor} from 'randomcolor';
import getContrastRatio from 'get-contrast-ratio';
import "@/components/stylings/upload.css"
import "@/components/stylings/general.css"

const hues = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]
export default function ClassCardTrigger( {catalog, setOpen} ) {
    const courseInfo = {
        cFieldNum: `${catalog.cField} ${catalog.cNum}`,
        course_long_title: `${catalog.course_long_title}`,
        course_credit: `${catalog.course_credit}`,
        course_department: `${catalog.course_department}`,
        course_type: `${catalog.course_type}`,
        distribution:  catalog.distribution === 'N/A' ? null : `${catalog.distribution}`
    };

    const [cardColor, setCardColor] = useState("");
    const [cardTextColor, setCardTextColor] = useState("");
    const [cardScale, setCardScale] = useState(0);

    function titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }

    function randomColorSets(idx){
        var randBg = randomColor({luminosity: 'light', hue: `${hues[idx]}`})
        var randText = randomColor({luminosity: 'dark', hue: `${hues[idx]}`})
        return [randBg, randText]
    }

    useEffect(()=>{
        const hueNum = Math.floor(Math.random() * 7);
        var [randBg, randText] = randomColorSets(hueNum);
        while (getContrastRatio(randText, randBg) <= 3){
            [randBg, randText] = randomColorSets(hueNum);
        }
        setCardColor(randBg);
        setCardTextColor(randText);
        setTimeout(()=>{setCardScale(1)}, 10)
    }, [])


  return (
    <div className="course-card" style={{transform: `${"scale(" + cardScale + ")"}`}}>
        <div className='card-color-cap' style={{backgroundColor: `${cardColor}`}}>
            <div className={'course-code-cap d-flex justify-content-center align-items-center cursor-pt fs-3'} 
            onClick={()=>setOpen("open")}
            >
                <div className="card-body">
                    <h5 className="card-title" style={{color: `${cardTextColor}`}}>{courseInfo.cFieldNum}</h5>
                    <div className='card-long-title'>{titleCase(courseInfo.course_long_title)}</div>
                    <div className='card-tag-wrap'>
                        <div className='tag'>{courseInfo.course_credit} credit hours</div>
                        {courseInfo.distribution ? <div className='tag'>{courseInfo.distribution}</div> : <></>}
                    </div>
                </div>
            </div>
        </div>
        
    </div>
  )
}
