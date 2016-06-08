var baseBet = 100;
var maxBet = 200;
var cashOut = 2;
var onLossIncreaseQty = 2;
var maxLoseTrain = 2;
// YOU CAN SCREW THIS UP IF YOU TOUCH BELOW. IF YOU DO, I AM NOT RESPONSIBLE
var currentBet = baseBet;
window.bet = true;
var loseTrain = [];

engine.on('game_starting', function() {
        var lastGamePlay = engine.lastGamePlay();

        if (lastGamePlay == 'LOST') {
            currentBet = currentBet * onLossIncreaseQty;

        } else if (lastGamePlay == 'WON') {
            currentBet = baseBet;
        }

        if (currentBet > maxBet) {
            currentBet = baseBet;
        }
        if (window.bet) {
            engine.placeBet(currentBet * 100, Math.round(cashOut * 100), false);
            console.log('Bet placed');
        }
});

engine.on('game_crash', function(data) {
    if (data.game_crash / 100 >= cashOut) {
        loseTrain = [];
        window.bet = true;
        console.log('Last was win, resetting settings');
    } else {
        loseTrain.push('LOSE');
        console.log('Loss');
    }
    if (loseTrain.length > maxLoseTrain - 1) {
        window.bet = false;
        console.log('Lose Train Exceeded');
    }
});
