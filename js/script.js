const game = {
    cardsOpen: 0,
    cardsAll: 16,
    waitTime: 700,
    started: false,
    moves: 0,
    stars: 3,
    time: 0,
    comparingFinished: true,
    gamefinished: false,
    nodeList: [],
    cards: [],
    lastCard: null,
    icons: ["ant", "deer", "hippo", "mosquito", "snail", "bear", "dinosaur", "horse", "panda", "spider", "beaver", "dolphin", "kangaroo", "pig", "stork", "bee", "duck", "ladybird", "rabbit", "turtle", "butterfly", "elephant", "leopard", "rhinoceros", "whale", "chicken", "frog", "lion", "seahorse", "wolf", "cow", "giraffe", "llama", "shark", "crab", "gorilla", "sheep"],
    // randomise the icons and put them inside the cards
    populate: function () {
        const selection = randomiser(game.icons);
        selection.forEach(function (el, index) {
            game.cards.push(new card(el, index));
            game.nodeList[index].firstElementChild.firstElementChild.src = "images/cards/" + el + ".png";
            game.nodeList[index].id = "card-" + index;
            // faces[1].id = "card-" + index;
        });
    },
    // resets game properties to initial and repaints them on screen. also closes all cards.
    reset: function () {
        window.clearInterval(game.timer);
        game.started = false;
        closeCards(game.cards);
        game.moves = 0;
        game.stars = 3;
        game.time = 0;
        game.cards = [];
        game.populate();
        paintMoves();
        paintStars();
        paintTime();
    },
    // checks if a certain number of moves was made, if so, reduces star rating
    // also checks if all the cards are open. if so, calls the gameWon function
    update: function () {
        if (game.moves === 10) {
            hideStar(game.stars);
            game.stars--;
        }

        else if (game.moves === 20) {
            hideStar(game.stars);
            game.stars--;

        }
        if (this.cardsOpen === this.cardsAll) {
            gameWon();
        }
        paintMoves();

    }
};

//stores elements that will need to be updated as the game progresses
// such as timer, rating, moves counter and I think that's it.
const paintJob = {};

//first get the required number of unique icons
//then add pairs to these icons
//then shuffle and return the final combination
function randomiser(icons) {
    const iconsCopy = icons.slice();
    let chosen = [];
    const len = iconsCopy.length;
    for (let i = 0; i < game.cardsAll / 2; i++) {
        chosen.push(iconsCopy.splice(randIndex(len - i), 1)[0]);
    }
    chosen = chosen.concat(chosen);
    const shuffled = [];
    while (chosen.length) { 
        shuffled.push(chosen.splice(randIndex(chosen.length), 1)[0]);
    }
    return shuffled;
    function randIndex(range) { 
        return Math.floor(Math.random() * range);
    }
}


//card object creator
function card(source, id) { 
    this.source = source;
    this.id = id;
    this.isOpen = false;
    this.open = function () {
        this.isOpen = true;
        game.cardsOpen++;
        game.nodeList[this.id].classList.add("flip");
    };
    this.close = function () {
        this.isOpen = false;
        game.cardsOpen--;
        game.nodeList[this.id].classList.remove("flip");
    };
    this.compare = function (otherCard) {
        return this.source === otherCard.source;
    };
    //get the node this card is related to
    this.getNode = function () {
        return game.nodeList[this.id];
    };
    //add 'matched' classes to a card and its front
    this.matched = function () {
        // this.getNode().classList.add("card-matched");
        // this.getNode().firstElementChild.classList.add("front-matched");
        this.getNode().firstElementChild.classList.add("card-matched");
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) { 
        game.nodeList.push(cards[i]);
    }
    game.populate();
    document.querySelector(".game").addEventListener("click", play);
    document.querySelector(".reset").addEventListener("click", game.reset);
    document.querySelector(".play-again").addEventListener("click", function () {
        paintJob.modal.style.display = "none";
        game.reset();
    });

    paintJob["starCont"] = document.querySelector(".stars");
    paintJob["timer"] = document.querySelector(".timer");
    paintJob["moveCounter"] = document.querySelector(".moves");
    paintJob["modal"] = document.querySelector(".success-modal");
    paintJob["modalStats"] = document.querySelector(".modal-stats");
});

//main game function. reacts to user clicks
function play(event) {
    //react only if the back of a card was clicked
    if (event.target.classList.contains("card-back")) {
        if (!game.started) {
            game.started = true;
            startTimer();
        }
        //get the card object formt the cards array
        const curCard = game.cards[event.target.parentElement.id.slice(5)];
        //if even number of cards open
        if (game.cardsOpen % 2 === 0 && game.comparingFinished) {
            game.lastCard = curCard;
            curCard.open();
        }
        //if odd number of cards open
        else if (game.cardsOpen % 2 === 1) { 
            game.comparingFinished = false;
            curCard.open();
            game.moves++;
            game.update();
            if (curCard.compare(game.lastCard)) {
                setTimeout(function () {
                    game.comparingFinished = true;
                    curCard.matched();
                    game.lastCard.matched();
                }, game.waitTime);

            }
            else { 
                setTimeout(function () {
                    // closeCards([curCard, game.lastCard]);
                    curCard.close();
                    game.lastCard.close();
                    game.comparingFinished = true;
                }, game.waitTime);

            }
        }
    }
}

//close an array of cards
function closeCards(arr) { 
    arr.forEach(function (card) {
        card.close();
    });
    game.cardsOpen = 0; //hack because can't be bothered to pass only the cards that need closing
}

//display modal and stop timer after game is won
function gameWon() {
    window.clearInterval(game.timer);
    paintJob.modal.style.display = "flex";
    paintJob.modalStats.textContent = "You made " + game.moves + " move(s), took " + game.time + " second(s), earned " + game.stars + " generic achievement point(s).";
}

// show the stars after a game is reset
function paintStars() { 
    const stars = paintJob.starCont.children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].style.display = "inline-block";
    }
}

function hideStar(index) {
    const stars = paintJob.starCont.children;
    stars[index - 1].style.display = "none";
}

function paintMoves() { 
    paintJob.moveCounter.textContent = "moves: " + game.moves;
}

// paint the time on screen
function paintTime() {
    const seconds = ("0" + game.time % 60).slice(-2);
    const minutes = ("0" + Math.floor(game.time / 60)).slice(-2);
    paintJob.timer.textContent = minutes + ":" + seconds;
}

// stars the timer. it's invoked only after clicking on a card
function startTimer() {
    game.timer = window.setInterval(function () {
        game.time++;
        paintTime();
    }, 1000);
}    



//polyfill for IE
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
  
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
          return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
        while (k < len) {
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }
        return false;
      }
    });
}