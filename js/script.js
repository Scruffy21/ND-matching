const game = {
    cardsOpen: 0,
    cardsAll: 16,
    moves: 0,
    stars: 3,
    time: 0,
    comparingFinished: false,
    gamefinished: false,
}

const icons = ["ant", "deer", "hippo", "mosquito", "snail", "bear", "dinosaur", "horse", "panda", "spider", "beaver", "dolphin", "kangaroo", "pig", "stork", "bee", "duck", "ladybird", "rabbit", "turtle", "butterfly", "elephant", "leopard", "rhinoceros", "whale", "chicken", "frog", "lion", "seahorse", "wolf", "cow", "giraffe", "llama", "shark", "crab", "gorilla", "monkey", "sheep"];


//first get the required number of unique icons
//then add pairs to these icons
//then shuffle and return the final combination
function randomiser(icons) {
    const iconsCopy = icons.slice();
    let chosen = [];
    const len = iconsCopy.length;
    for (let i = 0; i < game.cardsAll / 2; i++) {
        chosen.push(iconsCopy.splice(randIndex(len-i), 1)[0])
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

function card(source) { 
    this.source = source;
}

