# Games in the Debugger

Because the debugger is scriptable, it's possible to make interactive games in it, especially those that deal with process design, like Zachtronics games such as Opus Magnum. These games would help the users learn to use the tool, and to have fun while doing it. Companies that use the tool can even create custom games to teach new developers about specific in-house systems. This would greatly help them get up to speed, making onboarding a lot easier and requiring less work from senior developers.

## Opus Magnum clone

The core game is simple. You start with a main function that starts with the declaration of inputs and ends with the declaration of outputs. You are only allowed to use certain functions whose source is included and can't be changed. You can use any extra visualization scripts and macros that you want.

You start the game by running a script that writes the start code and compiles and executes it, creating a recording of the process that you can scroll through, rewind, and zoom into. There is a visualization script that shows the state of the process at that point in time. When you scroll inside the recording, that visualization changes.

## Physics Simulation

The program simulates 600 frames of 10 balls bouncing against each other and the borders of the screen. 

Level 1: find the ball that kicked the ball highlighted in red, using the prev change button
Level 2: do the same thing, except find the chain reaction of balls
Level 3: find every ball that bumped into the highlighted ball, using a macro
Level 4: make a graph script that shows all the locations, radiuses, and movement vectors of every ball for the current frame