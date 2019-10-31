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

## Aesthetics of Play

I like to feel interesting emotions.

I like to believe interesting stories.

I like to see stories unfold.

I like to overcome challenges.

I like to have friends.

I like to discover new things.

I like to create new, interesting, and beautiful things.

I like to do things distract me from everyday life.