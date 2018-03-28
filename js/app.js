/*
 * Create a list that holds all of your cards
*/
/* List of 8 pairs of card faces */
const cardFaces = [ 'anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 
                    'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 
                    'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o' ];
let openCardList = [];

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
for (const face of shuffledFaces) {
    deck.innerHTML +='<li class="card"><i class="fa fa-'+face+'"></i></li>';
};
// create a NodeList of the live cards
const cards = document.querySelectorAll('.card');

//play the game
selectCard(); 

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

function selectCard() {
	// add EventListener to each card
  for ( card of cards ) {
    card.addEventListener('click', function() {
    	return( revealCard(this) );
    });
  }
  // now wait on click events
}

function revealCard(currCard) {
	// reveal selected card
  currCard.classList.add('open', 'show');
  addCardToOpenList(currCard);
}

function addCardToOpenList(cardToAdd) {
	openCardList.push(cardToAdd);
	if (openCardList.length === 2) {
		checkForMatch();
		openCardList=[];
	}
}

function checkForMatch() {
	// check if cards match
	let cardName0 = openCardList[0].querySelector('i').classList[1];
	let cardName1 = openCardList[1].querySelector('i').classList[1];
	if (cardName0 == cardName1) {
    lockCardsOpen();
	}
  else {
  	releaseCards();
  }
}

function lockCardsOpen() {
	// remove the card's event listener
	for (lockCard of openCardList) {
	lockCard.removeEventListener('click', function() { 
			return( revealCard(this) );
		});
		lockCard.classList.add('match');
  	console.log('locked: ' + lockCard.querySelector('i').classList );		
	}
}

function releaseCards() {
	// hide card faces
  for (releaseCard of openCardList ) {
  	releaseCard.classList.remove('open', 'show');
  	console.log(releaseCard.querySelector('i').classList[1]);
  }
}
