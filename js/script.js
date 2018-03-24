const game = {
    cardsOpen: 0,
    cardsAll: 16,
    moves: 0,
    pears: 3,
    time: 0,
    comparingFinished: false,
    gamefinished: false,
    nodeList: [],
    cards: [],
    icons: ["ant", "deer", "hippo", "mosquito", "snail", "bear", "dinosaur", "horse", "panda", "spider", "beaver", "dolphin", "kangaroo", "pig", "stork", "bee", "duck", "ladybird", "rabbit", "turtle", "butterfly", "elephant", "leopard", "rhinoceros", "whale", "chicken", "frog", "lion", "seahorse", "wolf", "cow", "giraffe", "llama", "shark", "crab", "gorilla", "monkey", "sheep"],
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
        this.cardsOpen = 0;
        this.moves = 0;
        this.pears = 3;
        this.time = 0;
        this.cards = [];
        this.populate();
    },
}



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
    this.open = false;
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) { 
        game.nodeList.push(cards[i]);
    }
    game.populate();
    document.querySelector(".game").addEventListener("click", function () { 

    });
});

function handleClick(event) { 
    if (event.target.classList.contains("card-back")) { 
        event.target.parentElement.id
    }
}