// @ts-nocheck
// The Post url to send the embed to. This is where you should paste your webhook link.
var POST_URL = "DISCORD WEBHOOK HERE";

// onSubmit function that should be triggered when a new form is submitted.
function onSubmit(e) {
  // Get the form object
  var form = FormApp.getActiveForm();
  // Get all of the form's responses
  var allResponses = form.getResponses();
  // Get the latest response submitted to the form
  var latestResponse = allResponses[allResponses.length - 1];
  // Get an array containing all the responses to each question
  var response = latestResponse.getItemResponses();

  // Get the answers for the title questions.  Adjust these indices (0 and 1)
  // to match the actual question indices in your form (starting from 0).
  var titleQuestion1 = response[1].getResponse(); // Answer to the first title question
  var titleQuestion2 = response[2].getResponse(); // Answer to the second title question

  // Create the thread name from the answers.  You can customize this format.
  var thread_name = `${titleQuestion1} - ${titleQuestion2}`;

  // Current items array to use in embed
  var items = [];
  // Current number characters being used in the current embed
  var currentEmbedCharacterNum = 0;
  // Tracks part number for multi-embed responses
  var partNumber = 1;
  // Leave this null. This is used to keep track of the thread_id in future.
  var thread_id = null;

  // For loop to iterate through responses (start from index 2 to skip title questions)
  for (var i = 0; i < response.length; i++) {
    // Get the question text
    var question = response[i].getItem().getTitle();
    // Get the answer text
    var answer = response[i].getResponse();

    // Handle checkbox questions
    if (answer instanceof Array) {
      answer = answer.join(", ");
    }

    // Handle long answers by splitting them into parts
    try {
      var parts = answer.match(/[\s\S]{1,1024}/g) || [];
    } catch (e) {
      var parts = answer;
    }

    // Skip blank answers
    if (answer == "") {
      continue;
    }

    // Truncate long question titles
    if (question.length > 256) {
      question = question.substring(0, 220) + "...";
    }

    // Iterate through answer parts
    for (var j = 0; j < parts.length; j++) {
      currentEmbedCharacterNum += parts[j].length + question.length;

      if (currentEmbedCharacterNum >= 5000) {
        if (thread_id == null) {
          thread_id = sendEmbed(items, thread_name);
        } else {
          sendFollowupEmbed(items, thread_id, partNumber);
          partNumber += 1;
        }
        Utilities.sleep(50);
        currentEmbedCharacterNum = 0;
        items = [];
      }

      items.push({
        "name": (j == 0) ? question : question.concat(" (cont.)"),
        "value": parts[j],
        "inline": false
      });
    }
  }

  // Send the final embed
  if (thread_id == null) {
    thread_id = sendEmbed(items, thread_name);
  } else {
    sendFollowupEmbed(items, thread_id, partNumber);
    partNumber += 1;
  }
};


function sendEmbed(items, thread_name) {
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
    },
    "payload": JSON.stringify({
      "thread_name": thread_name, // Use the generated thread name here
      "embeds": [{
        "title": "",
        "color": 33023,
        "fields": items,
        "footer": {
          "text": "Some footer here"
        }
      }]
    })
  };

  var waitURL = POST_URL + "?wait=true";
  var response = UrlFetchApp.fetch(waitURL, options);
  var data = JSON.parse(response.getContentText());

  return data["channel_id"]; // Return the channel_id (which is the thread_id in this context)
}


function sendFollowupEmbed(items, thread_id, part) {
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
    },
    "payload": JSON.stringify({
      "content": "",
      "embeds": [{
        "title": "(" + part + ")",
        "color": 33023,
        "fields": items,
        "footer": {
          "text": ""
        }
      }]
    })
  };

  var followupURL = POST_URL + "?thread_id=" + thread_id;
  UrlFetchApp.fetch(followupURL, options);
}
