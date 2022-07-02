import React from 'react';
import "./Letter.css";

type LetterProps = {
    letter:string|null;
    status:string;
}

const Letter:React.FunctionComponent<LetterProps> = (props)=>{
    const {letter,status}=props;
    return (
        <div className={"cell "+status}>
        <span>{letter}</span>
        </div>
    )
}

export default Letter;