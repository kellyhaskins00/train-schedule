$(document).ready(function () {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyC3CQJXuiKKrNwa-0gqmEP6jJUvcl-URrM",
		authDomain: "homework-7-train-schedul-4902f.firebaseapp.com",
		databaseURL: "https://homework-7-train-schedul-4902f.firebaseio.com",
		projectId: "homework-7-train-schedul-4902f",
		storageBucket: "homework-7-train-schedul-4902f.appspot.com",
		messagingSenderId: "116708646402"
	};

	if (!firebase.apps.length) {
		firebase.initializeApp(config);
	}

	// Create a variable to reference the database.
	var database = firebase.database();

	var trains = [];

	function displayTable(ele) {
		appendTableColumn($('table'), ele);
	}

	function makeTable(container, data) {
		var table = $("table");
		$.each(data, function (rowIndex, r) {
			var row = $("<tr/>");
			$.each(r, function (colIndex, c) {
				row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
			});
			table.append(row);
		});
		return container.append(table);
	}

	function appendTableColumn(table, rowData) {
		var lastRow = $('<tr/>').appendTo(table.find('tbody:last'));
		$.each(rowData, function (colIndex, c) {
			lastRow.append($('<td/>').text(c));
		});

		return lastRow;
	}

	function editRow(row) {
		$('td', row).each(function () {
			$(this).html('<input type="text" value="' + $(this).html() + '" />');
		});
	}

	function retrieveTravels() {
		// debugger
		var rootRef = database.ref();
		var urlRef = rootRef.once("value", function (snapshot) {
			snapshot.forEach(function (child) {
				var trainTable = makeTable($(document.table),
					[[child.val().name, child.val().destination, child.val().frequency, child.val().nextArrive, child.val().away]]);
				trains.push([child.val().name, child.val().destination, child.val().frequency, child.val().nextArrive, child.val().away]);
			});
		});
	}

	function databasePush(name, destination, frequency, nextArrive, away) {
		database.ref().push({
			name: name,
			destination: destination,
			frequency: frequency,
			nextArrive: nextArrive,
			away: away
		});
	}

	$('th').on('click', function () {
		debugger
		editRow(this);
	});

	$("#submit").on("click", function (event) {
		debugger
		event.preventDefault();
		// Capture user inputs and store them into variables
		var name = $("#name").val().trim();
		var destination = $("#destination").val().trim();

		var firstTime = $("#firstTime").val().trim();

		var frequency = $("#frequency").val().trim();

		var nextArrive = "3:00 PM";
		var away = "2";

		databasePush(name, destination, frequency, nextArrive, away);
		var obj;
		database.ref().limitToLast(1).on("child_added", function (snapshot) {
			console.log(snapshot.val());
			if (snapshot.child("name").exists() &&
				snapshot.child("destination").exists() &&
				snapshot.child("frequency").exists() &&
				snapshot.child("nextArrive").exists() &&
				snapshot.child("away").exists()) {

				obj = [
					snapshot.val().name,
					snapshot.val().destination,
					snapshot.val().frequency,
					snapshot.val().nextArrive,
					snapshot.val().away
				]
				trains.push(obj);
			}
		});
		displayTable(obj);
	});

	retrieveTravels();

});
