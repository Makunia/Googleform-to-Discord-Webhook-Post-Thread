Please enter your own Webhook in the row 3

if needed change row 18/19 or add more

if needed change row 22  as example: 

  var thread_name = `Request: ${titleQuestion1} as ${titleQuestion2}`;

  Would create in Discord a Threadtitle

        Request: Example1 as Example2


# Google Forms to Discord Forum Thread/Post via Webhook

# Basic Setup

1) Create a [Google Form](https://docs.google.com/forms/u/0/) for use with this script
2) Make the form however you'd like.

3) Go to the Script editor.

![script editor](https://pillow.s-ul.eu/iLfUuy9l.png)

4) Paste the contents of `script.gs`.

5) Open Discord and make a channel where you'd like the responses to be sent.
6) Create a webhook and copy the URL. Replace `WEBHOOKURL` at the top of the script with the URL you copied.

![Create a new Webhook.](https://pillow.s-ul.eu/9G6CaZ7P)
![Copy Webhook URL.](https://pillow.s-ul.eu/fcfrn7vt)

7) Add a trigger by selecting Current project's triggers in the Edit menu, and creating a new trigger using the settings given below.

![trigger settings](https://user-images.githubusercontent.com/44692189/58762106-1236f880-856e-11e9-9a97-e275ffea9d65.jpg)

8) Submit a test response to make sure it works.

