var wsUri = "wss://ws.blockchain.info/inv";
var output;
var TYPE_BLOCK = "block";

function init() {
  // output = document.getElementById("output");
  initWebSocket();
}

function initWebSocket() {
  //  init blockchain websocket (activity, blocks)
  var blockchain = new WebSocket('ws://ws.blockchain.info/inv');
  

  //  subscribe to uncofirmed activity
  blockchain.onopen = function () {
    blockchain.send( JSON.stringify( {"op":"unconfirmed_sub"} ) );
  };
 
 // when messages is received turn it to json and pass it to message.data
  blockchain.onmessage = function (message) {
    var response = JSON.parse(message.data);
    // console.log(message);
    
    // unconfirmed transactions 
    if( response.op == "utx") {
      var amount = 0;
      
      for(var i = 0; i < response.x.out.length; i++ )
        amount += response.x.out[i].value;
      
      response.amount = amount / 100000000;

      if( response.amount <= 3 ) {
        response.amount = 3 ;
      }
      console.log (response.amount);

    }

    // blocks created
    else if( response.op == "block" ) {
      response.type = TYPE_BLOCK;
      response.amount = Math.round( response.x.height / 10000 );
    }
    
    writeToScreen(response.amount);
  };
}


function writeToScreen(message) {
  var pre = barChart.addToken( {
    id:'myId',
    size: message,
    category:0,
    texture: {
      src:'http://img.vanislervrentals.com/payments/bitcoin.gif'
    }
  });

  // message = document.getElementByClass('output');
}

window.addEventListener("load", init, false);
