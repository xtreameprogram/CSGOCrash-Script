var baseBet = 100;
var maxBet = 200;
var cashOut = 2;
var onLossIncreaseQty = 2;
var maxLoseTrain = 2;
// YOU CAN SCREW THIS UP IF YOU TOUCH BELOW. IF YOU DO, I AM NOT RESPONSIBLE
var currentBet = baseBet;
window.bet = true;
var loseTrain = [];
var crashData = [];
var recovering = false;

var balance = engine.getBalance();

var automate = confirm("Do you want this script to calculate everything for you?");

if (automate === true) {
  if (balance <= 500) {
    alert('You do not have enough money to use this!');
    engine.stop();
  }
  if (balance <= 1000 && balance < 10000) {
    baseBet = 100;
    maxLoseTrain = 2;
    activateOnePOne();
  }
  if (balance <= 10000 && balance < 20000) {
    baseBet = 1000;
    maxLoseTrain = 2;
    activateOnePOne();
  }
  if (balance >= 20000) {
    baseBet = 1000;
    maxBet = 2000;
    var mainMaxBet = 2000;
    maxLoseTrain =  parseInt(window.prompt("How many times in a row should you lose before cutting off betting","2"));
    activateMartingale();
  }
}

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
  if (data.game_crash / 100 <= 5) {
    crashData.push(data.game_crash);
  } else {
    activateOnePOne();
  }
    analyzeData(crashData);
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
        activateOnePOne();
    }
});

function activateOnePOne() {
  console.log("Activated 1.1");
  maxBet = -1;
  cashOut = 1.1;
  onLossIncreaseQty = 10;
}

function activateMartingale() {
  maxBet = mainMaxBet;
  cashOut = 2;
  onLossIncreaseQty = 2;
  console.log("Activated martingale");
}

function analyzeData(crashData) {
  var sum = 0;
  for( var i = 0; i < crashData.length; i++ ){
      sum += parseInt( crashData[i], 10 );
  }
  var avg = (sum/crashData.length)/100;
  console.log("Crash Average is: ", avg);
  if (avg > 2 && automate) {
    activateMartingale();
  }
  else {
    activateOnePOne();
  }
  if (balance - baseBet*3 < balance - baseBet*3 && !recovering) {
    activateOnePOne();
    recovering = true;
  }

  if (balance <= engine.getBalance()) {
    recovering = false;
  }

}
