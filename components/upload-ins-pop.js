import React, { useEffect, useState } from 'react'

export default function Popover(props) {
    const [animate, setAnimate] = useState("");

    function trigger(){
        setAnimate("pop-animate");
    }

    function closePop() {
        setAnimate("");
    }

    useEffect(()=>{
        if (props.pop) {
            trigger();
        }
    }, [props.pop])
  return (
    <div className='pop-wrapper'>
        <div className={'popup tooltip-top tooltip-upload shadow border ' + animate} 
            onMouseEnter={closePop}
            > 
            {props.content}
        </div>
    </div>
    
  )
}
