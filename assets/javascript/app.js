// link to my firebase database
var config = {
    apiKey: "AIzaSyDRyLQCxeLz-SGUkkDSIiYC-T9fw5Pi0lM",
    authDomain: "train-scheduler-f689e.firebaseapp.com",
    databaseURL: "https://train-scheduler-f689e.firebaseio.com",
    projectId: "train-scheduler-f689e",
    storageBucket: "train-scheduler-f689e.appspot.com",
    messagingSenderId: "300540676288"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
// once the submit button is clicked then it will take the values and sort them into a object and database
  $("#add-train-btn").on("click", function(event){

    event.preventDefault();

    var trainName = $("#inputName").val().trim();
    var trainDest = $("#inputPlace").val().trim();
    var trainTime = $("#inputTime").val().trim();
    var trainFreq = $("#inputFreq").val().trim();

    var newTrain = 
    {
        name: trainName,
        dest: trainDest,
        time: trainTime,
        freq: trainFreq
    };
// boject pushed to the database
    database.ref().push(newTrain);
// console log tests
    // console.log(newTrain.name);
    // console.log(newTrain.dest);
    // console.log(newTrain.time);
    // console.log(newTrain.freq);
    $("#inputName").val(" ");
    $("#inputPlace").val(" ");
    $("#inputTime").val(" ");
    $("#inputFreq").val(" ");

});
// this function is used to add a train as "child add"
database.ref().on("child_added", function(snapShot)
{
    // console.log(snapShot.val());
// same thing to use the values from the input
    var trainName = snapShot.val().name;
    var trainDest = snapShot.val().dest;
    var trainTime = snapShot.val().time;
    var trainFreq = snapShot.val().freq;

    // console.log(trainName);
    // console.log(trainDest);
    // console.log(trainTime);
    // console.log(trainFreq);

    var Frequency = trainFreq;
    var firstTime = trainTime;
// i used frquency and the time of the first train to get the time when the next train will come
    var timeConverted = moment(firstTime, "HH:mm").subtract(1,"years");
    console.log(timeConverted);
// thei gets the time right now in the format of hours and minutes
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
// this takes the time now and takes the difference from timeConverted of the firsttrain
    var differTime = moment().diff(moment(timeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " +differTime);

    var remainder = differTime % Frequency;
    console.log(remainder);
// use remainder because convert time to hours and minutes
    var minutesTill = Frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minutesTill);
// adds the current time when to the time when the next train should come
    var nextTrain = moment().add(minutesTill, "minutes");
    // then converts it to hours and minutes
    var nTrain = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
// lastly display the info to DOM and stored in the database
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(Frequency),
        $("<td>").text(nTrain),
        $("<td>").text(minutesTill)
      );

      $("#train-table > tbody").append(newRow);
});