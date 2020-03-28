var stompClient = null;
var sessionId = "";

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
       onConnected(frame);
    });
}

function onConnected(frame){
    setConnected(true);
    stompClient.subscribe('/user/queue/chat.send', onMessageReceived);
    stompClient.subscribe('/topic/'+ $("#username").val(), onMessageReceived);
    stompClient.subscribe('/topic/public', onMessageReceived);
    var messageType = {
        sender:$("#username").val(),
        type:"JOIN"
    }
    stompClient.send("/app/chat.register", {}, JSON.stringify(messageType));
    }

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    var messageType = {
        sender:$("#username").val(),
        receiver:$("#receiver").val(),
        content:$("#message").val(),
        type:"CHAT"
    }
    stompClient.send("/app/chat.send", {}, JSON.stringify(messageType));
}

function onMessageReceived(paylod){
    showGreeting(JSON.parse(paylod.body));
}

function showGreeting(message) {
    if(message.type !== "CHAT" ){
        $("#heading").remove();
        $("#header").append("<h6 id='heading'>"+message.sender+ ":" + message.type + "</h6>");
    }
    else{
    $("#messages").append("<tr><td>"+ message.sender+ ":" + message.content + "</td></tr>");
}}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

