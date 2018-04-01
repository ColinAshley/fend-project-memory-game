/* Initialize variables
** Create a list that holds all of your cards
** List of 8 pairs of card faces */
const cardFaces = [ 'anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt',
                    'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond',
                    'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o' ];
let openCardList = [];

/* scoreboard */
let timerIsOn = false;
let moves=0;
let matchedCards=0;
let gameDuration = 0;
const stars = document.querySelector('.stars');
const playtime = document.querySelector('.playtime');
const restart = document.querySelector('.fa-repeat');
// scoreboard restart button listener
restart.addEventListener("click", function() {
  window.location.reload(false);
});


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// shuffle the faces
const shuffledFaces = shuffle(cardFaces);
// locate the deck un-numbered list and clear it
const deck = document.querySelector('.deck');
deck.innerHTML='';
// construct the list of new cards
for (face of shuffledFaces) {
  deck.innerHTML+='<li class="card"><i class="fa fa-'+ face +'"></i></li>';
  }
// create a NodeList of the live cards
const cards = document.querySelectorAll('.card');

// listen for card clicks
for ( card of cards ) {
  card.addEventListener('click', function() {
    revealCard(this);
  });
}
// play the game
startGame();
// end of main code

// functions
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function startGame() {
  initScoreboard();
}

function revealCard(currCard) {
  // start timer on first card click
  if ( timerIsOn == false ) {
    timerIsOn = true;
    startTimer();
  }
  // reveal selected card
  currCard.classList.add('open', 'show');
  addCardToOpenList(currCard);
}

function addCardToOpenList(cardToAdd) {
  openCardList.push(cardToAdd);
  if (openCardList.length === 2) {
    checkForMatch();
    updateScoreboard();
  }
}

function checkForMatch() {
  // check if cards match
  let cardName0 = openCardList[0].querySelector('i').classList[1];
  let cardName1 = openCardList[1].querySelector('i').classList[1];
  if (cardName0 == cardName1) {
    setTimeout( function() {
      lockCardsOpen();
    }, 600 );
  }
  else {
    releaseCards();
    setTimeout( function() {
      openCardList=[];
    }, 600 );
  }
}

function lockCardsOpen() {
  // remove the card's event listener
  for (lockCard of openCardList) {
    lockCard.removeEventListener('click', function() {
      revealCard(this);
    });
    lockCard.classList.add('match');
    lockCard.classList.remove('open', 'show');
    matchedCards++;
    openCardList=[];
    console.log('locked: ' + lockCard.querySelector('i').classList );
    if (matchedCards == cardFaces.length) {
      endOfGame();
    }
  }
}

function releaseCards() {
  setTimeout( function() {
    openCardList[0].classList.remove('open', 'show');
  }, 600 );
  setTimeout( function() {
    openCardList[1].classList.remove('open', 'show');
  }, 600 );
}

function initScoreboard() {
  moves = 0;
  gameDuration = 0;
  document.querySelector('.moves').textContent = moves;
  playtime.textContent = gameDuration;
  // initialise restart button
}

function updateScoreboard() {
  // update moves and dim star if necessary
  moves++;
  document.querySelector('.moves').textContent = moves;
  switch(moves) {
    case 15:
      loseStar(1);
      break;
    case 20:
      loseStar(2);
      break;
    case 25:
      loseStar(3);
    default:
      break;
  }
}

function loseStar(starNum) {
  // dim right-most illuminated star
  let starList = stars.querySelectorAll('.fa-star');
  let dimStar = starList[starList.length-starNum];
  dimStar.style.color='silver';
}

function endOfGame() {
  // display popup summary and restart button
  console.log('Completed in ' + moves + ' moves');
  stopTimer();
  displayModal();
}

function startTimer() {
  gameTimer = window.setInterval(displayTimer, 1000);
}

function stopTimer() {
  window.clearInterval(gameTimer);
}

// TODO - Add a pause button that displays a 'paused' modal.

function displayTimer() {
  gameDuration++;
  playtime.textContent = gameDuration;
}

function displayModal() {
  // create a new document fragment and insert it into the page.
  const modalFrag = document.createDocumentFragment();
  const modal = document.createElement('div');
  modal.classList = 'modal';
  const modalSummary = document.createElement('div');
  modalSummary.classList = 'modalSummary';
  modalSummary.innerHTML =`
    <h1>Game Summary</h1>
    <span>
      <h3>Time Taken ${gameDuration} Seconds</h3>
      <h3>Total Moves ${moves}</h3>
    </span>
    <button class="restartButton">Play Again</button>
    <button class="exitButton">Exit Game</button>
    `
  modalFrag.appendChild(modal);
  modal.appendChild(modalSummary);
  const container = document.querySelector('.container');
  container.appendChild(modalFrag);
  // setup buttons
  let playAgain = modalSummary.querySelector('.restartButton');
  let exitButton = modalSummary.querySelector('.exitButton');
  // setup button eventListeners
  playAgain.addEventListener('click', function() {
    window.location.reload(false);
  });
  exitButton.addEventListener('click', function() {
    container.removeChild(modal);
  });
}

// end of file