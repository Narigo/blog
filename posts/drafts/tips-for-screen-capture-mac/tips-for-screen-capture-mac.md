# Tips for capturing and annotating your screen on MacOS

When I started to use a Mac, I wasn't aware of some really nice features that I wasn't used to in the Windows or Linux
world. Especially capturing (parts) of the screen to show a bug or a workflow wasn't something that could be done with
preinstalled applications.

I wish I knew some of these things earlier, so I'm documenting and sharing them here.

## Taking screenshots

Taking a screenshot is quite simple by using keyboard shortcuts. `Command + Shift + 3` will capture the whole screen
and save the captured image on your desktop. `Command + Shift + 4` changes your cursor and lets you drag a rectangle on
the part of the screen you want to capture. Use `Control + Command + Shift + <3 or 4>` to save the result of your
screen grab into the clipboard.

If the keyboard shortcuts won't work for you, you can also use the "Preview" application and use the "Take Screenshot
..." item in the "File" menu.

## Record the screen

The QuickTimePlayer has powerful features for recording the screen. Open the app, select "New Screen Recording" (or
press `Control + Command + N`). You can drag a rectangle to record only a part of your screen or press the big button
in the middle of your screen to record the complete screen.

## Annotate pictures (or screenshots)

The Preview application lets you annotate images and screenshots. To find this possibility, select the "Show Markup
Toolbar" option. With these, you can draw bordered rectangles to highlight something, write text on the image or add
lines and arrows. I think it's a bit strange that it creates the thing you select as a new layer without you "dragging"
it on the screen, but you can move your selected option on a new layer without problems.

## Taking a screen recording with a video capture of your webcam

When doing a movie recording with QuickTimePlayer and the starting the Screen Recording, the movie may get hidden below
other windows. To keep the camera window on top of every other window, open the "View" menu and select the "Float on
Top" option. If you turn on the internal microphone recording on the Screen Recording, you can record a video of you
and the screen at the same time.

## Bonus: MOV to animated GIF

Embedding videos in commentaries or similar can be quite a hassle. It's usually much easier to embed animated GIFs
instead. [Online MOV to GIF services](https://www.onlineconverter.com/mov-to-gif) worked well for me, but if you are
working on large files with a slow connection, you might want to check out this
[open source video to GIF converter](https://github.com/mortenjust/droptogif).

When using the online converter, the GIF animation came out pretty "slow" for me. Using `ffmpeg` helped me to make it
faster by executing this command:

```
ffmpeg -i input.gif -filter:v "setpts=0.125*PTS" -r 60 output.gif
```

This removes some frames instead of making the "show next image" faster but the result worked for me. Having a higher
value for the framerate (120 instead of 60) did not help.
