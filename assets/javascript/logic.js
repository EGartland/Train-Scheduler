$(document).ready(function () {

    // Initialize FireBase
    var config = {
        apiKey: "AIzaSyBwMQKV--BdI93uhQGSA2RcEFFg8fHI0uM",
        authDomain: "train-schedule-d0b97.firebaseapp.com",
        databaseURL: "https://train-schedule-d0b97.firebaseio.com",
        projectId: "train-schedule-d0b97",
        storageBucket: "",
        messagingSenderId: "125798643638"
    };

    firebase.initializeApp(config);

    // initialize variables
    var database = firebase.database();
    var nextTrain = 0;
    var tMinutesTillTrain = 0;

    
    function clearForm() {
        $("#tName").val("");
        $("#tDest").val("");
        $("#tTime").val("");
        $("#tFreq").val("");
    }

    
    $("#tButton").on("click", function (event) {
        event.preventDefault();

        var tName = $("#tName").val().trim();
        var tDestination = $("#tDest").val().trim();
        var tStartTime = $("#tTime").val().trim();
        var tFrequency = $("#tFreq").val().trim();

        database.ref().push({
            name: tName,
            destination: tDestination,
            starttime: tStartTime,
            frequency: tFrequency
        });

        clearForm();

    });

    
    function calcNextTrain(p1, p2) {

        var tFrequency = p1;
        var firstTime = p2;

       
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % tFrequency;

        tMinutesTillTrain = tFrequency - tRemainder;

        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm A");

        return [nextTrain, tMinutesTillTrain];
    };

    
    database.ref().on("child_added", function (snapshot) {
        $("#trainInfo").append(`
                <tr>
                    <td>${snapshot.val().name}</td>
                    <td>${snapshot.val().destination}</td>
                    <td>${snapshot.val().frequency}</td>
                    <td>${calcNextTrain(snapshot.val().frequency, snapshot.val().starttime)[0]}</td>
                    <td>${calcNextTrain(snapshot.val().frequency, snapshot.val().starttime)[1]}</td>
                </tr>
                `);
    });

});