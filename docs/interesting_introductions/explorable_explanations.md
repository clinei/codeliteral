# Explorable Explanations

You might have already heard about [explorable explanations](https://explorabl.es/), the idea of explaining ideas by showing how they work in an interactive toy example. Indeed, being able to interact with the example, and see how tweaking the parameters changes the results, does make understanding the concept easier. This is especially true for complex ideas with multiple levels of interaction between different emergent behaviors, like in [this example](https://ncase.me/trust/). I highly recommend checking it out if you haven't already.

What's nice about explorable explanations is that they let you start slow, learning things step by step, and practice what you've learned right as you're learning it. You have enough time to explore any ideas or questions you might have, making sure that you're ready for the next level of knowledge. It also makes learning more interesting and engaging.

What makes explorable explanations so useful is that they are interactive and visceral. You have something concrete that you can visually regenerate in your mind. You can quickly create assumptions about how the idea works, and test them out to see if you were right. This adds an element of reward and surprise. It feels more like a game than reading boring articles.

This is why some people like to use visual programming methods like node editors and state machine graphs. It's just more intuitive, and easy to visually regenerate in your mind.

What if we leveraged this to better understand software systems? After all, they too contain complex ideas, detailed interactions, and emergent behavior. And the better we understand such systems, the better we can make them, and the easier it is.

We see this used a lot in the games industry, in the form of interactive game engines, where the user can easily view and change the state of the system as it's running, and custom tools that let you see how a specific system works in a bird's eye view. The Unreal Game Engine has a visual programming language called Blueprint, which highlights nodes as they get executed, and lets you pan around and zoom out freely, until you only see the general structure of the nodes, and can see a lot more higher-level patterns. The Scratch programming language, which is used for teaching programming to kids, is also based on highly visual and interactive ideas.

Some game tools even use complex data science methods to make sure that the emergent behavior doesn't change unexpectedly as you modify the game logic. Some tools even record an entire system and let you replay and rewind it, to more deeply understand the interactions and their causes and effects.

What would this look like for non-game systems? Well, we could record their activity, and create a visualization that shows us things that would be hard to see by just looking at the code. We can then replay and rewind that visualization and notice subtle but important behavior. We could also make it interactive, and let the user change the way the visualization works and what it shows. We could also create more visualizations that show the behavior of the system from a different perspective.

Tools like this already exist for mature, specialized systems. What we lack is an easy way to create visualizations for our own programs. There are good tutorials and libraries for visualization, but they aren't always flexible and interactive enough, and most of them have no easy way to go back to the code and understand why it created the high-level patterns. They are good for understanding what happens, but not always _why_ it happens, and what you can do to change it.

We need something that connects the code and the abstract visualization. We need something that is not a separate system, but deeply integrated and extendable. And it shouldn't make us do tedious tasks like manually generating the dataset and importing it every time we record a new program. Sure, the experts can create custom tools pretty easily, but it's a very steep learning curve, and the software industry would benefit a lot if even the beginners could use them to understand what the heck their systems are doing. No more wild guesses.

To read more about using visualizations effectively, read [this article](../interesting_introductions/ladder_of_abstraction.md).

To read more about why software tools should be more like games and how to do it, read [this one](../development/design.md).