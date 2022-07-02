import React from 'react';
import {useEffect,useState} from 'react';
import ALL_WORDS from './words2';
import './App.css';
import Guess from './Guess';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

function App() {

  //Game Variables
  const [chosenWord,setChosenWord] = useState<string>('');
  const [guesses,SetGuesses] = useState<string[]>(Array(6).fill(null));
  const [textInput,SetTextInput] = useState<string>('');

  //Game flags
  const [attempt,SetAttempt] = useState<number>(0);
  const [gameOver,SetGameOver] = useState<boolean>(false);
  const [win,SetWin] = useState<boolean|null>(null);

  //User feedback
  const [caption,SetCaption] = useState<string|null>("Guess a word!");

  //Other
  const [cheatMode,SetCheatMode] = useState<boolean>(false);

  const pickWord=()=>{
    const ind=Math.floor(Math.random()*ALL_WORDS.length);
    setChosenWord(ALL_WORDS[ind]);
  }

  //Initialization
  useEffect(()=>{
    pickWord();
  },[]);


  //Keyboard handling for text input
  useEffect(()=>{
    const keyDownHandler=(event:KeyboardEvent)=>{
      if(!gameOver && event.key==="Enter" && textInput.length===5){
        if(!ALL_WORDS.includes(textInput)){
          SetCaption("Invalid word!");
        }
        else{
        SetGuesses((prev:string[])=>{
          const newGuesses=[...prev];
          newGuesses[attempt]=textInput;
          return newGuesses;
        })
        if(textInput===chosenWord){
          SetGameOver(true);
          SetWin(true);
          SetCaption(null);
        }
        else{
          SetAttempt(prev=>prev+1);
          SetTextInput('');
          SetCaption('Guess another word!');
        }
        
        }
      }
      else if(!gameOver && event.key==="Backspace"){
        SetTextInput((prev)=>prev.substring(0,prev.length-1));
      }
      else if(!gameOver && event.key.length===1){
        const ans=(/[a-zA-Z]/).test(event.key); //Filter non-alphabetical characters
        if(textInput.length<5 && ans){
          SetTextInput((prev:string)=>{
            if(prev.length<5)
              return prev+event.key.toUpperCase()
            return prev
          });
        }
      }
    }

    document.addEventListener("keydown",keyDownHandler);
    return ()=>{
      document.removeEventListener("keydown",keyDownHandler);
    }
  },[textInput,guesses,attempt,gameOver,win,chosenWord]);
  
  //Lose condition
  useEffect(()=>{
    if(attempt===6 && !gameOver){
      SetGameOver(true);
      SetWin(false);
      SetCaption(null);
    }
  },[attempt,gameOver,win])

  const reset=()=>{
    SetGameOver(false);
    SetAttempt(0);
    SetGuesses(Array(6).fill(null));
    SetWin(null);
    SetTextInput('');
    pickWord();
    SetCaption("Guess a word!");
  }

  const giveUp=()=>{
    SetGameOver(true);
    SetWin(false);
    SetCaption(null);
  }

  const toggleCheat=()=>{
    console.log("Toggling cheat mode");
    SetCheatMode(prev=>!prev);
  }

  return (
    <>
    <div className="App">
      <Box>
        <AppBar position="static" className="topBar">
          <Toolbar sx={{justifyContent:"center"}}>
            <h2>Poor Man's Wordle</h2>
          </Toolbar>
          
        </AppBar>
      </Box>
      {
        cheatMode===true?(
          <h2>Chosen word: <span className="answer">{chosenWord}</span></h2>
        ):(<></>)
      }
      

      <div className="guessSpace">
        {
          guesses.map((el:string,index:number)=>{
            return (
              <Guess key={index} placeholder={!el&&(index===attempt)?textInput+' '.repeat(5-textInput.length):"     "} word={el} answer={chosenWord}/>
            )
          })
        }
        
      </div>
      <div className="captionZone">
        {
        caption?(
          <h3>{caption}</h3>
        ):(
          <></>
        )}
      </div>
      {
        gameOver?(
          <>
          {
            win?(
              <h2>You won!</h2>
            ):(
              <>
              <h2>You lost!</h2>
              <h2>The word was: <span className="answer">{chosenWord}</span></h2>
              </>
            )
          }
          <Button variant="contained" onClick={()=>reset()}>Restart</Button>
          </>
        ):(
        <>
        <Button variant="contained" color="error" onClick={()=>giveUp()}>I give up</Button>
        </>)
      }
      <SettingsIcon onClick={()=>toggleCheat()} className="cheat"/>
    </div>
    
    </>
  );
}

export default App;
