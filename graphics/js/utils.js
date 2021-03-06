'use strict';

// Replicants
var emotes = nodecg.Replicant('emotes');
var runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

// Get the next X runs in the schedule.
function getNextRuns(runData, amount) {
	var nextRuns = [];
	var indexOfCurrentRun = findIndexInRunDataArray(runData);
	for (var i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun+i]) break;
		nextRuns.push(runDataArray.value[indexOfCurrentRun+i]);
	}
	return nextRuns;
}

// Returns how long until a run, based on the estimate of the previous run.
function formETAUntilRun(previousRun, whenTotal) {
	var whenString = '';
	if (!previousRun) whenString = 'Next';
	else {
		var previousRunTime = previousRun.estimateS + previousRun.setupTimeS;
		var formatted = moment.utc().second(0).to(moment.utc().second(whenTotal+previousRunTime), true);
		whenString = 'In about '+formatted;
		whenTotal += previousRunTime;
	}
	return [whenString, whenTotal];
}

// Converts milliseconds to a time string.
function msToTime(duration) {
	var seconds = parseInt((duration/1000)%60),
		minutes = parseInt((duration/(1000*60))%60),
		hours = parseInt((duration/(1000*60*60))%24);
	
	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;
	
	return hours + ':' + minutes + ':' + seconds;
}

// Goes through each team and members and makes a string to show the names correctly together.
function formPlayerNamesString(runData) {
	var namesArray = [];
	var namesList = 'No Runner(s)';
	runData.teams.forEach(team => {
		var teamMemberArray = [];
		team.members.forEach(member => {teamMemberArray.push(member.names.international);});
		namesArray.push(teamMemberArray.join(', '));
	});
	namesList = namesArray.join(' vs. ');
	return namesList;
}

// Find array index of current run based on it's ID.
function findIndexInRunDataArray(run) {
	var indexOfRun = -1;
	
	// Completely skips this if the run variable isn't defined.
	if (run) {
		for (var i = 0; i < runDataArray.value.length; i++) {
			if (run.runID === runDataArray.value[i].runID) {
				indexOfRun = i; break;
			}
		}
	}
	
	return indexOfRun;
}

// Get a random integer, usually for selecting array elements.
// You will never get max as an output.
function getRandomInt(max) {
	return Math.floor(Math.random()*Math.floor(max));
}

// Used to get the width of supplied text.
function getTextWidth(text, size) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = size+'px Montserrat'; /* Change if layout is changed. */
	return ctx.measureText(text).width;
}

// Replaces emoticon names in a text string with imgs.
function replaceEmotes(text) {
	var textSplit = text.split(' ');
	for (var i = 0; i < textSplit.length; i++) {
		if (emotes.value[textSplit[i]])
			textSplit[i] = '<img class="emoji" draggable="false" alt="'+textSplit[i]+'" src="https://static-cdn.jtvnw.net/emoticons/v1/'+emotes.value[textSplit[i]].id+'/3.0">';
	}
	return textSplit.join(' ');
}