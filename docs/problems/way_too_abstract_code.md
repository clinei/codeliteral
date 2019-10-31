# Way Too Abstract Code

When you start a new project, the code is usually simple and easy to debug. New people joining the project have little trouble understanding what the code does and how.

But as the project grows, the complexity of the code grows also. There are more special cases, longer functions, and more lines of code in general. So you do what any self-respecting developer would do, and abstract things away into neatly encapsulated code units, and extract the most repeated parts into smaller functions. We fixed it, right?

No. We've just hidden the complexity, not erased it completely. It still lurks in the cracks between our abstractions, waiting to pounce at your weakest moment. We've just created the illusion of a simple and beautiful world.

And eventually, when the system has grown really large, we start running into problems that span across abstractions, possibly caused by mismatches between those same abstractions. Sometimes, we can fix it without changing the abstraction, but not always. And when we change the abstraction, we have to change everything that uses the abstraction. And that's usually a lot of stuff. We might have to rewrite all of our code at this point.

What we have actually done is aggregated all the potential points of failure into a single one. That's not always a bad thing, but it does mean that when something breaks, we have to change more things. The cost of failure has increased.

And that's not all. The abstractions themselves are extra complexity. Navigating those abstractions can be more complicated than just never abstracting. Each abstraction changes the way we see the problem, and we have to keep track of all those perspectives, and smoothly switch between them as we are solving the problem. This is an extra step that we could forego if we didn't use so much abstraction.

That is not to say that abstractions are bad. They are useful, but only when used appropriately. Unfortunately, most people don't know how to create useful abstractions, and most people don't know when to use a specific abstraction and how. [This comic](https://xkcd.com/2021/) by XKCD illustrates it well. It also leads to [this situation](https://xkcd.com/927/). It really is a sad state of things.

So what is the actual problem? There is a lot to choose from, like not enough high-quality education, not enough time to study the abstractions, or even malicious intent. While fixing those would help, I don't think it's the best way to solve this problem.

### The Solution

I think this would best be solved by making better tools. Yes, I know that there are tools that help with refactoring, and analyzing systems and code, but I think we can do even better. The tools we currently have are limited to modifying the system when we already understand it, or limited in the way they help us understand it.

What we need is a way to de-abstract the system and the code as it runs. What I mean by that is we can record the whole system, look at it from a top-down view, and create new abstractions outside of what the code is doing, to more quickly move between abstractions, and notice all the unspoken assumptions lurking between the cracks.

This is explained in more detail in the article about [the Ladder of Abstraction](../interesting_introductions/ladder_of_abstraction.md).