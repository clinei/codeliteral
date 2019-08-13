# CodeLiteral

It's a game that turns the execution of your program into a procedurally generated world where the bugs are the quest items. The vast open world is a syntax tree of the whole history of the program. You can explore that tree using simple keyboard controls, like WASD to move between lines of code, or other buttons for more useful things. And the syntax tree stores the values of variables as delicious informative apples. So you debug by walking around in an informative apple orchard, looking for any rotten apples, and when you find one, you can teleport straight to the original bad apple that ruined your apple pie.

#### Learn

Move up and down the control flow. See the data all at once and understand what's really going on. Instantly recognize where you are. Never get lost.

#### Debug

When a value is wrong, and you wanna know why, you just ask it by pressing a button. And if that's not enough, you can ask why a group of values were wrong at specific times. And if that's still not enough, you can ask why a complex integration of a huge bunch of values was slightly different from what you expected, which ultimately made your program crash. Visualize the problem with audio and video.

#### Document

Mark the points of interest and the intended program flow. Make your documentation interactive. Reuse debug visualizations and explain the most arcane concepts. Save it all to a file.

#### Automate

Use the fully scriptable user interface to make custom tools and automate the most frequent tasks, like testing if the bug is fixed or still there.


## What makes this so good?

#### Simplicity

Everything is easy. Most questions are answered by looking around or pressing a button.

#### Power

Everything is scriptable. You can gather any data you want, and show it any way you want. You can write macros and automate the interface.

#### Sharing

Debugging, documenting, and testing all use the same data gathering and visualization workflows. That means you can reuse most of the code you write. You can also use the code from your actual program. And you can save it to a file and send it to your colleagues or save it for audits or private nostalgia. Or maybe wait 20 years and sell it to a museum.


## What can I do that I couldn't do before?

#### Save and resume debug sessions

Different people can do different stages of debugging: one records the problem, one finds the causes, one makes visualizations, one fixes the problem. Or it can all be done by one person, just at different times. The point is that you don't lose all your progress when you don't solve the problem in one go, or when you give it to someone else.

#### Rapidly debug complex problems

You have probably heard about the following situation: you're debugging a program, you spend 10 minutes getting the bug to trigger, and then you press the wrong button, so you have to restart the whole process and spend the next 10 minutes setting up the state again. In this debugger, that can't happen. You start recording, you trigger the bug once, and then you inspect the recording for as long as required. You can see all the data for the entire program. Sometimes you can solve the problem just by looking at the data. If that's not enough, you can jump between reads and writes. If that's still not enough, you can write a script and gather more data than you can hold in your head, and display it in a way that makes it easier to think about the problem. You can also mark certain points as interesting and move quickly between them. This workflow keeps you moving around and not thinking too hard for too long, so you remain awake and focused on the problem at hand. It's like a game, it keeps up your motivation so you don't have to.

#### Inline testing

Instead of testing return values, you check the actual value of an expression as the code ran. Testability is no longer a problem. The whole execution is one syntax tree, easy to process.

#### Data analysis of execution

You don't have to add any code to get specific statistics about your code. All the familiar debug tools can be used to answer the hardest questions you may have about your program.
