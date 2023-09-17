"use client"
import React, { useEffect, useState } from 'react'
import {randomColor} from 'randomcolor';
import getContrastRatio from 'get-contrast-ratio';
import "@/components/stylings/upload.css"
import "@/components/stylings/conversation.css"
import "@/components/stylings/general.css"


const hues = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]
export default function MiniCard( props ) {
    
    const [cardColor, setCardColor] = useState("");
    const [cardTextColor, setCardTextColor] = useState("");

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
    }, [])


  return (
    <div className="mini-card"  onClick={props.handleClick}>
        <div className='mini-card-body' style={{backgroundColor: `${cardColor}`}}>
            <h5 className="card-title" style={{color: `${cardTextColor}`}}>{props.content.toUpperCase()}</h5>
        </div>
    </div>
  )
}
