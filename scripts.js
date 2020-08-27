let blackJack = {
    'you': { 'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'standPhase': false,
    'turnsOver': false,
}

const YOU = blackJack['you']
const DEALER = blackJack['dealer']

const hitSound = new Audio('assets/sounds/swish.m4a')
const winSound = new Audio('assets/sounds/cash.mp3')

document.querySelector('#hit-button').addEventListener('click', hitButton)
document.querySelector('#stand-button').addEventListener('click', standButton)
document.querySelector('#clear-button').addEventListener('click', clearButton)



function hitButton() {
    if (blackJack['standPhase'] == false) {
        let card = randomCard()
        showCard(card, YOU)
        updateScore(card, YOU)
        showScore(YOU)
        document.getElementById('stand-button').disabled = false
    }
}
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardDrawn = document.createElement('img')
        cardDrawn.src = `assets/images/${card}.png`
        document.querySelector(activePlayer['div']).appendChild(cardDrawn)
        hitSound.play()
    }
}
function randomCard() {
    let randomiser = Math.floor(Math.random() * (blackJack['cards'].length - 1))
    return blackJack['cards'][randomiser]
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] += blackJack['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackJack['cardsMap'][card][1]
        }
        else {
            activePlayer['score'] += blackJack['cardsMap'][card][0]
        }
    } else {
        activePlayer['score'] += blackJack['cardsMap'][card]
    }
}
function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score']
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).innerText = 'bust'
        document.querySelector(activePlayer['scoreSpan']).style = "color: red"
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function standButton() {
    blackJack['standPhase'] == true
    document.getElementById('hit-button').disabled = true
    document.getElementById('stand-button').disabled = true

    while (DEALER['score'] < 16) {
        let card = randomCard()
        showCard(card, DEALER)
        updateScore(card, DEALER)
        showScore(DEALER)
        await sleep(1000)
    }

    let winner = decideWinner()
    updateRecord(winner)
    blackJack['standPhase'] == false
    blackJack['turnsOver'] == true
    document.getElementById('clear-button').disabled = false


}
function clearButton() {

    //slower way
    /* let myCards = document.querySelector('#your-box').querySelectorAll('img')
    for (let i = 0; i < myCards.length; i++) {
        myCards[i].remove()
        
    } */

    //better way


    document.getElementById('your-box').innerHTML = ' '
    document.getElementById('your-result').innerHTML = '0'
    YOU['score'] = 0

    document.getElementById('dealer-box').innerHTML = ' '
    document.getElementById('dealer-result').innerHTML = '0'
    DEALER['score'] = 0

    document.querySelector(YOU['scoreSpan']).style = "color: white"
    document.querySelector(DEALER['scoreSpan']).style = "color: white"

    document.querySelector('#msg-window').textContent = 'Let \'s play'
    document.querySelector('#msg-window').style.color = 'black'
    document.getElementById('hit-button').disabled = false;
    document.getElementById('clear-button').disabled = true
    
    blackJack['turnsOver'] == false

}
function decideWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU
            blackJack['wins'] += 1
            //document.querySelector('#wins').innerText = blackJack['wins']
        }
        else if (YOU['score'] < DEALER['score']) {
            winner = DEALER
            blackJack['losses'] += 1
            //document.querySelector('#losses').innerText = blackJack['losses']
        }
        else if (YOU['score'] = DEALER['score']) {
            blackJack['draws'] += 1
            //document.querySelector('#draws').innerText = blackJack['draws']
        }
    }
    else if (YOU['score'] > 21) {
        if (DEALER['score'] > 21) {
            blackJack['draws'] += 1

        }
        else if (DEALER['score'] <= 21) {
            winner = DEALER
            blackJack['losses'] += 1
        }
    }
    return winner
}
function updateRecord(player) {
    let message;
    let messageColor;

    if (player == YOU) {
        document.querySelector('#wins').innerText = blackJack['wins']
        message = 'You won'
        messageColor = 'green'
        winSound.play()
    }
    else if (player == DEALER) {
        document.querySelector('#losses').innerText = blackJack['losses']
        message = 'You lost!'
        messageColor = 'red'
    }
    else {
        document.querySelector('#draws').innerText = blackJack['draws']
        message = 'You drew'
        messageColor = 'black'
    }
    document.querySelector('#msg-window').textContent = message
    document.querySelector('#msg-window').style.color = messageColor

}
