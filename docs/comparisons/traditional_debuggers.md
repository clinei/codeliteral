# Comparison with Traditional Debuggers

While traditional debuggers are useful, because you can stop the program and analyze the state at that particular time and how it affects the logic, there are certain downsides.

One of them is that you can only see the state at one time. Problems are usually a series of unfortunate events, not just one obvious logic error. You need to see the progression of the state through time to be able to notice the pattern of bad behavior. You also need a quick way to move through that progression and notice important events, and maybe bookmark them to be able to revisit them. More on that later.

The way you look at the program state is also sub-optimal. You have to avert your eyes from the code, and look in a separate window that uses a completely different visual logic, which makes it easy to lose track of what the code is actually doing. Sure, most development tools let you hover over the variable to see its value in a tooltip, but that also uses a different visual language, and disrupts your mental context. Wouldn't it be easier to just replace the variable name with its value?

[Work in Progress]