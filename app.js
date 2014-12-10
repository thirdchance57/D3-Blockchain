var wsUri = "wss://ws.blockchain.info/inv";
var initOutput;
var TYPE_BLOCK = "block";

function init() {
  // initOutput = document.getElementById("output");
  initWebSocket();
}

function initWebSocket() {
  "use strict";
    //  init blockchain websocket (activity, blocks)
  var blockchain = new WebSocket('ws://ws.blockchain.info/inv');
  // var litecoin = new WebSocket('ws://ws.ltcchain.com:8000');
  
  blockchain.onopen = function () {
    blockchain.send( JSON.stringify( {"op":"unconfirmed_sub"} ) );  //  subscribe to uncofirmed activity
    blockchain.send( JSON.stringify( {"op":"blocks_sub"} ) );   //  subscribe to new blocks
  };

  // litecoin.onopen = function () {
  //   litecoin.send( JSON.stringify( {"op":"unconfirmed_sub"} ) );  //  subscribe to uncofirmed activity
  //   litecoin.send( JSON.stringify( {"op":"blocks_sub"} ) );   //  subscribe to new blocks
 
  // };
 
 // when messages is received turn it to json and pass it to message.data
  blockchain.onmessage = function (message) {
    var response = JSON.parse(message.data);
    // console.log(message);
    
    // unconfirmed transactions 
    if( response.op == "utx") {
      var amount = 0;
      
      for(var i = 0; i < response.x.out.length; i++ )
        amount += response.x.out[i].value;
      
      // DIVIDES THE AMOUNT and COVERTS TO BTC
      response.amount = amount / 100000000;
      initOutput = response.amount;
      console.log(initOutput);

      // PRINTS THE INITAL OUTPUT TO THE HTML        converts to string and back to integer 
      document.getElementById("output").innerHTML = "$" + (initOutput.toString().match(/^\d+(?:\.\d{0,2})?/)) * 375;

      // these if else sets the min and max size tokens for d3
      if( response.amount <= 5 ) {
        response.amount = 5 ;
      }
      else if( response.amount >= 140   ) {
        response.amount = 140 ;
      }
    }

    // if a block is created
    else if( response.op == "block" ) {
      console.log("BLOCK FOUND BLOCK FOUND BLOCK FOUND BLOCK FOUND");
      response.amount = Math.round( response.x.height / 10000 );
    }
    
    // this function fires when an onmessage is received
    writeToScreen(response.amount);
  };
}

// fires a function to drop a d3 token (message is the btc transaction size from response.amount)
function writeToScreen(message) {
  "use strict";
  barChart.addToken( {
    id:'myId',
    size: message,
    category:0,
    texture: {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc-tI1b7luXJgfHdwbTwCmSpciFwSrVG_cqMlOeF-0CEzrS6NAxw'
    }
  });
}

// fires init function when the window is loaded
window.addEventListener("load", init, false);