# Simple pomodoro timer for Mac OSX as bash alias

TL;DR: Add this to your `~/.bash_profile` file.

```bash
POMODORO_TIME=25
POMODORO_BREAK=5
alias pomodoro="while true; do osascript -e 'display notification \"Pomodoro time\" with title \"POMODORO\" sound name \"default\"' && echo -n 'Pomodoro time - bis ' && date -v+$((${POMODORO_TIME}))M '+%H:%M:%S' && sleep $((${POMODORO_TIME}*60)) && osascript -e 'display notification \"Break time\" with title \"POMODORO\" sound name \"default\"' && echo -n 'Break time - bis ' && date -v+$((${POMODORO_BREAK}))M '+%H:%M:%S' && sleep $((${POMODORO_BREAK}*60)); done"
```

## Pomodoro timer

The pomodoro technique is usually a set of 25 minutes doing productive work and a 5 minute break afterwards. You repeat
these two actions until the task you want to focus on is done. I like to use a pomodoro timer when I have time to focus
on a single task. Getting a new coffee or stretching during the break helps me to get fresh ideas if I hit an unexpected
or not yet anticipated issue. 

There are a lot of resources and tools floating around that want to install and do a lot for you, even if all you want 
is a notification when you should start working again or when you should take a short break. Hence, (and for fun) I've
decided to build my own little bash script, that I can run in a terminal.

Sure, it's not as fancy as other apps, but at least it's just using simple shell commands and the sleep timer. It does 
nothing most of the time and just informs me when it's time to move on to the break or get on the work again.

## Code and explanation

The first try was the following:

```bash
while true; do echo -n 'Pomodoro time' && sleep $((25*60)) && echo -n 'Break time' && sleep $((5*60)); done
```

While this works through echo, I would need to have the terminal window always in my view, so as soon as it toggles the
time, I'd need to check the current time and calculate when the next stop is due. The next step is to do this 
calculation for me, using the date command:

```bash
while true; do echo -n 'Pomodoro time - until ' && date -v+25M '+%H:%M:%S' && sleep $((25*60)) && echo -n 'Break time - until ' && date -v+5M '+%H:%M:%S' && sleep $((5*60)); done
```

Great - I can now see the times, but still, it does not flash or notify me as I don't have a bell ringing. On a Mac, you
can use the `osascript` command to display a native notification. So the third revision came to be:

```bash
while true; do osascript -e 'display notification "Pomodoro time until '`date -v+25M '+%H:%M:%S'`'" with title "POMODORO" sound name "default"' && echo -n 'Pomodoro time - until ' && date -v+25M '+%H:%M:%S' && sleep $((25*60)) && osascript -e 'display notification "Break time" with title "POMODORO" sound name "default"' && echo -n 'Break time - until ' && date -v+5M '+%H:%M:%S' && sleep $((5*60)); done
```

The last version shows a nice notification, rings a bell that I can hear while listening to concentration music and I 
get to see the time when the next break or productive work session should begin at a glance.

In my creative chaos of various open terminal windows and tabs, this already helped me quite a bit to get my focus on a
specific task. Even this article was written while using this script.
 