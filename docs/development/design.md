# Design

The main design goal is to make the tool feel more like a game, not just a fancy Excel. The situation and the goal should be clear at all times. The controls should be intuitive, and navigating must be easy, predictable, and reversable. You should never feel like you're stuck, about to break the tool, or lose your progress.

To this end, we use the knowledge of usability and game design, to create a user experience that maximises productivity and enjoyment.

## Hierarchy of Needs

Like the hierarchy of needs used in psychology (Maslow Pyramid of Needs), there is also a hierarchy of video game player needs, closely tied to the one used in psychology.

The first need is Physical Experience. The player needs to feel immersed in a world where they can manipulate objects, overcome challenges, and get rewards. They need to feel that the world is real, using all their senses, and intuit things with physical metaphors. They need to have clear signals of what is happening, and which choices lead to which outcomes.

To satisfy this need, the main view is a syntax tree that you can move around in with small steps, always being able to return to the previous state. The world is a group of code elements that are connected to each other like stepping stones in a pond.

The second need is Identity. The player needs to understand who they are and how they can interact with the world.

To satisfy this need, the main user interface is a group of simple interactions, like moving around and changing whether you see variable names or values. There are also a lot of special abilities, like jumping to where a variable was last changed, where it was used, and marking it as potentially important, so you can come back to it later. You're like a little orange wizard that can teleport around and feel special. And all of these skills are under your fingertips, literally. They are triggered by one button press, and similar actions are right next to each other on the keyboard.

The third need is Esteem. The player needs to feel like they're making progress.

To satisfy this need, the user can [bookmark](../components/syntax_tree.md#bookmarks) code locations that they discover and are related to the task, and they can quickly move between them, like unlocking fast travel after you discover a location for the first time in a game like Skyrim. 

The fourth need is Belonging. The player needs to feel like they are a part of the world, with friends and enemies.

To satisfy this need, we have the bookmarks and built-in macros and standard library functions that the user has used in the past. They are like companions that the user can call onto the battlefield to do special attacks, and the user considers them friends with whom they belong. The bugs and missing knowledge are the enemies.

The fifth need is Self-Improvement. The player needs to feel like their activities in the game help them do things in the real world.

To satisfy this need, we only need to realize that the user is already solving real-world problems when they use the tool. They are already fixing bugs and making the software better. We have just gamified it.

The sixth need is Creativity. The player needs to feel like they're making something new, like art.

To satisfy this need, the user can create [custom tools and visualizations](../components/scripts.md) that make their job easier. This is an act of pure creation, and they feel a sense of ownership and originality. They can even create [games](../customer_support/game.md) and [music](../components/audio_scripts.md) with the tool.

[Work in Progress]

Grant Sanderson, also known as 3Blue1Brown on YouTube
says that learning has to be based on intuitive metaphors and existing knowledge of physical processes, like sound, movement, and collision. New situations are easier to understand if we can compare them to past situations.
https://www.youtube.com/watch?v=s_L-fp8gDzY

## Aesthetics of Play

When playing games, there are are usually a few main reasons why people wanna keep playing the game. In this section, I show how the debugger tries to hook into each basic reason that keeps people motivated and focused on the task at hand. 

The main reason why someone would use the debugger is to figure out what the program did wrong and why. The main way to do that is to move around in the recorded program execution, which is displayed as code, and inspect different parts of the cause and effect chain. To do that, the user either moves through time using WASD or ZX, or through the uses and changes of some data using HJ and YU. The user can also use RT to move between different runs of the same code, like the cycles of a for loop, many calls of the same function, or other times when a rare conditional branch was taken. There main mode of operation is to look around, decide where to move, and then rapidly press buttons to move toward the target, and making course corrections as needed. 

Humans like to feel interesting emotions. They like to be swept up in the moment, and make quick decisions based on subconscious information. Moving around in the code elements of recorded execution can, at times, be fast-paced enough to feel like an arcade game. Pressing a button to move in a certain direction while watching for the expected result happens in a tight, repeated loop. This creates a feeling of change and progress not unlike movement in a physical space. In addition, pressing F to see the value of a variable at a certain point in time and seeing it be exactly what you expected gives the user an instant feeling of superiority and expertise for correctly predicting the behavior of the system.

Humans like to see interesting stories unfold, and to be a driving force in them. Figuring out why a program crashed or returned incorrect output is very much like a detective story. There is a death, or an attempted poisoning of a high-status individual, and you are the Sherlock Holmes, Hercule Poirot (or Miss Marple) who must study the crime scene, find clues, and use your power of reasoning to find the forces of evil that did the dirty deed. This also satisfies the human desire to discover new things and overcome challenges.

Humans like to create new, interesting, and beautiful things. This desire is satisfied by letting the users create useful code snippets, or entire visualization systems, to help other people figure out what happened in their program, and why, in a more effective and intuitive way. Users can also create detailed walkthroughs for complex systems that explain every case that the system handles, and every design constraint and assumption that was used while creating the solution. Seeing other people use tools that you created, and thanking you for it, also creates a sense of community and friendship, which is another fundamental human desire.