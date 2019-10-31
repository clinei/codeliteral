# Ladder of Abstraction

First, please read [this interactive essay](http://worrydream.com/LadderOfAbstraction/) by Bret Victor about how looking at things in a different way can make understanding systems a lot easier. Even if you have read it before, please refresh your memory, as I will be using the same concepts and metaphors.

Let's say that we write a program that simulates a car, just like the one in the essay. We then record one run of the program. We then write a script that extracts the positions of the car from the recorded program execution. We then display those positions as a trajectory by calling a line rendering function inside the script. We have just abstracted over time, just like in the essay.

We can also show the car on top of the trajectory, just like in the essay. The syntax tree view has a cursor that points to a certain point in time, so we can pick the car position that is closest to the cursor, and overlay the car image at that position on top of the trajectory. We can now see two levels of abstraction at the same time, just like in the essay.

Abstracting over the algorithm not as easy as abstracting over time, because our script would have to stop the program at the start of the simulation, and then call the step function for every frame, and every parameter combination. This requires external instrumentation, which is unreliable and possibly dangerous, as it directly manipulates the code as it executes. While technically possible, it's much easier to just edit our program to run the simulation with different parameter combinations, and then just extract those in our script.

This is where this tool differs from the essay. Instead of exploring the possible parameter space, we explore the actual activity of a system. This difference is minor, because like running a simulation with many different parameter combinations, production systems generate a lot of data as well, from all ranges in the parameter space.

This is like profiling, but for logic errors. You have a system where lots of events happened, and some sequence of events caused a crash or undesirable behavior. The events are processed in an interleaved order, for many different processes. The events sometimes create new events, and interact with eachother in complex ways.

You can write a script that gathers up all the causal relationships, and creates tree structures that show which events caused which other events. You can also show which events interacted with eachother and how. You can then make it interactive, by adding hooks to the visual elements, so that when you click on an event, you can get deeper insight about the specific event.

You can also use the overlapping trajectories, small multiples, and coordinate transformation techniques as shown in the essay. You can also reuse the macros and visualizations that we created for other problems. You can also create  recordings of different versions of the system, and analyze differences in their behavior, all in one place. In theory, we could also use fuzzing and genetic algorithms to generate new versions of the system, and analyze them thoroughly.

### Game time

This is how it would work in practice. Let's say that you're working on a game where you can explore dungeons and kill monsters. In one dungeon, for some reason, the monsters start spamming their Smash Attack, which has an Area of Effect that also damages their allies. You have no idea why it's happening, so you record the bug, and start making visualizations.

First, you make a top-down view of the fighting scene. There are like, a hundred different monsters with intricate textures and animations, and you really want to simplify that if you wanna understand complex emergent behavior. The fight is 10 minutes long, and the monsters do the weird thing only about 10 times during that time, making real-time debugging difficult.

So you write a script that gathers up all the positions of all the monsters across the whole battle. You then display those positions as little circles, and inside those circles you color-code the different states of the monsters, whether they are attacking, or affected by something that causes their behavior to change, maybe the War Cry skill of your player, which causes the monsters to run away from the player in fear.

Let's say that the monster's circle is green when it's just moving around, red when it's doing a regular attack,  blue when it's doing a special attack, and yellow when it's running away scared. Green is moving, red is attack, blue is special, yellow is scared. You scroll across the timeline and find the places where the monsters start spamming their Smash Attack.

Looking at the only 10 instances of the bug, you notice that the monsters usually behave normally, green circles moving around, sometimes turning red, and then back to green again. They occasionally do their special Smash Attack, and usually they turn green again. But sometimes, they don't. They just use their special attack, then become red and attack the air a few times, and then do their special attack again. You notice that they also do it in groups, and only when they become scared from the War Cry skill, but not always.

Perhaps you have abstracted away some important information. Luckily, you have written a macro that finds the weird blue-red-red-blue behavior, and jumps to the closest instance. This will move your cursor in the syntax tree view into the actual code from which the abstraction was generated from, letting you step down the ladder with one foot on the ground, and one on the ladder.

You look around in the actual code, and find out that all the enemies that display the behavior have a bleeding effect from the player's razor-sharp blade, which accidentally has the same amount of damage as the enemies' regeneration rate, which was amplified by the enemy healers. This led to a floating point error in the actual decision algorithm, which caused the weird behavior.

You found this information by traveling backwards from the decision to do a Smash Attack, finding the floating point error, and jumping to where the regeneration value was last changed. You could only have done this by freely moving up and down the ladder of abstraction, and using both high- and low-level views in concert. You would definitely not have noticed this when you were playing the game and focused on winning the battle and not dying.

### Conclusion

This can be used for systems where most of the behavior is emergent and arises from subtle interactions between disparate events. It's not enough to see the patterns in one view, we need to notice the connection between the high- and low-level patterns. We must not get stuck in one way of seeing the system, be it the single-street view of a debugger, or the top-down view of a visualization. It's best to use many different visualizations that are linked together, and sometimes drop down into the raw code view. Otherwise we will never discover the dark secrets and mistaken assumptions that lurk in the cracks between abstractions.

We also need lots of examples to compare and find the easiest instance to debug. The free movement on the ladder of abstraction will also help us find similarities, and create special levels that accentuate those similarities, which will reduce the complexity even further.

Also, making all these visualizations and stepping up and down the abstractions helps us gain a deeper and wider understanding of the system. Most importantly, it trains our intuition. I'm sure you know at least one story of how some program did something completely unexpected, because no one had noticed a strong emergent property, because they were just looking at the code or the direct output. Having a deep and wide understanding of the system is essential not just for fixing bugs, but also for coming up with ideas to improve the system.

Moving between the ground level aka the code view is something that traditional debuggers and visualization tools can never do, because they either abstract everything, or nothing. We need an integrated debugging and visualization solution that can abstract across time and parameter space, using real data, and not just pieces of it, but the whole shebang.