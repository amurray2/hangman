import "./App.css";
import VikingsLogo from "./Vikings-Logo.png";
import alphabet from "./alph";
import words from "./words";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";

let WORD_TO_GUESS = words[Math.floor(Math.random() * words.length)];

function generateGuessingWord() {
  let guessingWord = [];

  for (var x = 0; x < WORD_TO_GUESS.length; x++) {
    if (/^[a-zA-Z]+$/.test(WORD_TO_GUESS[x])) {
      guessingWord.push("_");
    } else {
      guessingWord.push(WORD_TO_GUESS[x]);
    }
  }
  return guessingWord;
}

function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <div className="img-div">
          <img src={VikingsLogo} className="viking-img" />
        </div>
        <h3 className="header-title">Word Guess - Program</h3>
      </div>
      <div className="header-right">
        <span>
          <a
            onClick={() => {
              window.location.reload(false);
            }}
          ></a>
        </span>
      </div>
    </div>
  );
}

function Content() {
  const [alph, setAlph] = useState(alphabet);
  const [numGuesses, setNumGuesses] = useState(0);
  const [letterGuessed, setLetterGuessed] = useState("");
  const [lettersGuessed, setLettersGuessed] = useState([]);
  const [propIn, setPropIn] = useState(false);

  function updateLetter(letter_id) {
    setAlph((prevAlph) => {
      return prevAlph.map((letter) => {
        if (letter.id === letter_id) {
          setLetterGuessed(letter.value);
          return { ...letter, isGuessed: !letter.isGuessed };
        } else {
          return letter;
        }
      });
    });

    setNumGuesses((prevGuessCount) => {
      return (prevGuessCount += 1);
    });

    setPropIn(!propIn);
  }

  function restart() {
    setAlph((prevAlph) => {
      return prevAlph.map((letter) => {
        return { ...letter, isGuessed: false };
      });
    });
    setLetterGuessed("");
    setNumGuesses(0);
    setLettersGuessed([]);
  }

  return (
    <div className="content">
      <LeftNav alph={alph} handleClick={updateLetter} propIn={propIn} />
      <Main
        alph={alph}
        restartClick={restart}
        numGuesses={numGuesses}
        letterGuessed={letterGuessed}
        lettersGuessed={lettersGuessed}
        setLetterGuessed={setLettersGuessed}
        propIn={propIn}
      />
    </div>
  );
}

function Main(props) {
  const [notGuessedInProp, setNotGuessedInProp] = useState(false);

  useEffect(() => {
    props.setLetterGuessed(
      props.alph.map((letter) => {
        if (
          letter.isGuessed &&
          !WORD_TO_GUESS.includes(letter.value.toLowerCase())
        ) {
          return (
            <LetterGuessed
              key={letter.id}
              letter={letter}
              notGuessedInProp={notGuessedInProp}
            />
          );
        }
      })
    );
  }, [notGuessedInProp]);

  useEffect(() => {
    console.log(props.letterGuessed);
    if (!WORD_TO_GUESS.includes(props.letterGuessed.toLowerCase())) {
      setNotGuessedInProp(!notGuessedInProp);
    }
  }, [props.letterGuessed]);

  console.log(notGuessedInProp);
  return (
    <div className="main">
      <div className="results">
        <div className="wordguess-div">
          <WordChecker
            letterGuessed={props.letterGuessed}
            numGuesses={props.numGuesses}
            propIn={props.propIn}
          />
          <a className="button" onClick={props.restartClick}>
            restart
          </a>
        </div>
        <div className="lettersguessed-div">
          Letters Guessed:
          <CSSTransition in={notGuessedInProp} timeout={200} classNames="fade">
            {<div>{props.lettersGuessed}</div>}
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}

function WordChecker(props) {
  const [guessingWord, setGuessingWord] = useState(generateGuessingWord());
  const [userWon, setUserWon] = useState(false);

  let position = 0;
  let elements;

  useEffect(() => {
    let wordBeingGuessed = guessingWord.join("");
    if (wordBeingGuessed === WORD_TO_GUESS.toUpperCase()) {
      setUserWon(true);
    } else {
      setUserWon(false);
    }
  }, [guessingWord]);

  useEffect(() => {
    if (props.letterGuessed !== "") {
      let myArray = [...guessingWord];
      for (var x = 0; x < WORD_TO_GUESS.length; x++) {
        if (props.letterGuessed === WORD_TO_GUESS[x].toUpperCase()) {
          myArray[x] = props.letterGuessed;
        }
      }
      setGuessingWord(myArray);
    } else {
      setGuessingWord(generateGuessingWord());
    }
  }, [props.letterGuessed]);

  elements = guessingWord.map((element) => {
    position += 1;
    if (element !== " ") {
      return (
        <div key={position - 1} className="guessing-elements">
          {element}
        </div>
      );
    } else {
      return <br key={position - 1}></br>;
    }
  });

  return (
    <div className="word-guesser-results">
      <div className="word-guesser-div">
        <div className="div-guessing">{elements}</div>
      </div>
      <div className="final-results">
        {userWon ? (
          <YouWin numGuesses={props.numGuesses} />
        ) : (
          <NumGuesses numGuesses={props.numGuesses} />
        )}
      </div>
    </div>
  );
}

function NumGuesses(props) {
  return (
    <div className="numguesses-div">
      <h2>Num Guesses: {props.numGuesses}</h2>
    </div>
  );
}

function YouWin(props) {
  return (
    <div className="youwin-div">
      <h1>Congratulations! It took you {props.numGuesses} guesses</h1>
      <a
        className="button"
        onClick={() => {
          window.location.reload(false);
        }}
      >
        Play Again
      </a>
    </div>
  );
}

function LetterGuessed(props) {
  return <div>{props.letter.value}</div>;
}

function LeftNav(props) {
  let alphElements = props.alph.map((letter) => {
    if (!letter.isGuessed) {
      return (
        <LetterButton
          key={letter.id}
          letter={letter}
          handleClick={props.handleClick}
        />
      );
    }
  });

  return (
    <div className="nav-left">
      <CSSTransition in={props.propIn} timeout={200} classNames="quick-fade">
        <div className="letter-available-div">{alphElements}</div>
      </CSSTransition>
    </div>
  );
}

function LetterButton(props) {
  return (
    <div className="div-btn">
      <button
        className="letter-btn"
        onClick={() => props.handleClick(props.letter.id)}
      >
        {props.letter.value}
      </button>
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Content />
    </>
  );
}

export default App;
