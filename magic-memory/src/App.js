import { useEffect, useState } from 'react'
import './App.css'
import SingleCard from './components/SingleCard'

const cardImages = [
  {"src": "/img/helmet-1.png", matched: false},
  {"src": "/img/potion-1.png", matched: false},
  {"src": "/img/ring-1.png", matched: false},
  {"src": "/img/scroll-1.png", matched: false}
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] =useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [userCode, setUserCode] = useState('');
  const [userScore, setUserScore] = useState(0);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort( () => Math.random() - 0.5)
      .map((card) => ({...card, id: Math.random()}))

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)

      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])


  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  // handle user code input
  const handleUserCodeChange = (event) => {
    setUserCode(event.target.value);
  };

  // handle game start
  const startGame = () => {
    if (userCode.length === 6) {
      shuffleCards();
      setUserScore(0);
    } else {
      alert('Please enter your employee code.');
    }
  };

  // start a new game automatically
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Matching Game</h1>
      <input
        type="text"
        value={userCode}
        onChange={handleUserCodeChange}
        placeholder="Enter your employee code"
      />
      <button onClick={startGame}>New Game</button>
      <div className='card-grid'>
        {cards.map(card => (
          <SingleCard 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped = {card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            />
        ))}
      </div>
      <div className="score">Score: {userScore}</div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App
