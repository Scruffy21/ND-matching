const game = {
    cardsOpen: 0,
    cardsAll: 16,
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
    populate: function () {
        const selection = randomiser(game.icons);
        selection.forEach(function (el, index) {
            game.cards.push(new card(el, index));
            game.nodeList[index].firstElementChild.firstElementChild.src = "images/cards/" + el + ".png";
            game.nodeList[index].id = "card-" + index;
            // faces[1].id = "card-" + index;
        });
    },    
    reset: function () { 
        closeCards(this.cards);
        this.moves = 0;
        this.stars = 3;
        this.time = 0;
        this.cards = [];
        this.populate();
        paintMoves();
        paintStars();
        paintTime();
    },
    update: function () {
        if (game.moves === 10) {
            game.stars--;
            paintStars();
        }

        else if (game.moves === 20) { 
            game.stars--;
            paintStars();
        }
        if (this.cardsOpen === this.cardsAll) { 
            gameWon();
        }
        paintMoves();

    }
}

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
        return Math.floor(Math.random() * range)
    }
}



function card(source, id) { 
    this.source = source;
    this.id = id;
    this.isOpen = false;
    this.open = function () {
        this.isOpen = true;
        game.cardsOpen++;
        game.nodeList[this.id].classList.add("flip");
    }
    this.close = function () { 
        this.isOpen = false;
        game.cardsOpen--;
        game.nodeList[this.id].classList.remove("flip");
    },
    this.compare = function (otherCard) {
        return this.source === otherCard.source;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) { 
        game.nodeList.push(cards[i]);
    }
    game.populate();
    document.querySelector(".game").addEventListener("click", play);

    paintJob["starCont"] = document.querySelector(".stars");
    paintJob["timer"] = document.querySelector(".timer");
    paintJob["moveCounter"] = document.querySelector(".moves");
});

function play(event) { 
    if (event.target.classList.contains("card-back")) {
        const curCard = game.cards[event.target.parentElement.id.slice(5)];
        if (game.cardsOpen % 2 === 0 && game.comparingFinished) {
            game.lastCard = curCard;
            curCard.open();
        }
        else if (game.cardsOpen % 2 === 1) { 
            game.comparingFinished = false;
            curCard.open();
            game.moves++;
            game.update();
            if (curCard.compare(game.lastCard)) {
                game.comparingFinished = true;
            }
            else { 
                setTimeout(function () {
                    closeCards([curCard, game.lastCard]);
                    game.comparingFinished = true;  
                }, 700)

            }
        }

    }
}

function closeCards(arr) { 
    arr.forEach(function (card) {
        card.close();
    })
}

function gameWon() { 

}

function paintStars() { 

}

function paintMoves() { 
    paintJob.moveCounter.textContent = "moves: " + game.moves;
}

function paintTime() {
    const seconds = ("0" + game.time % 60).slice(-2);
    const minutes = ("0" + Math.floor(game.time / 60)).slice(-2);
    paintJob.timer.textContent = minutes + ":" + seconds;
}


const timer = setInterval(function () {
    game.time++;
    paintTime();
}, 1000);



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