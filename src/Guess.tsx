import React from 'react';
import { useEffect,useState } from 'react';
import './Guess.css';
import Letter from './Letter';

type GuessProps = {
    word:string|null;
    placeholder?:string|null;
    answer:string;
}

const Guess:React.FunctionComponent<GuessProps> = (props)=>{
    const {word,placeholder,answer}=props;
    
    const [renderArray,SetRenderArray]=useState(Array(5).fill('noMatch'))

    //Process on change
    useEffect(()=>{
        if(!word || word.length<5)return;
        
        let i:number=0;
        let tempArray=Array(5).fill('nomatch');
        for (let c of word){
            if(answer[i]===c)
                tempArray[i]='match';
            else if(answer.includes(c))
                tempArray[i]='contains';
            i++;
        }
        SetRenderArray(tempArray);
    },[word,answer])

    return (
        <div className="line">
            
        {
            word!=null&&placeholder==='     '?(
                <>
                {
                    word.split('').map((letter:string,index:number)=>{
                        return (
                            <Letter key={index} letter={letter} status={renderArray[index]}/>
                        )
                    })
                }
                </>
            ):(
                <>
                {
                    placeholder?.split('').map((x,i)=>{
                        return (
                            <Letter key={i} letter={x} status={""}/>
                        )
                    })
                }
                </>
            )

        }
        </div>
    )
}

export default Guess