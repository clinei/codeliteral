This is a design document for a new kind of debugger.

Debugging is mainly stepping through a program and checking that the data is changed in the right way. Programming languages are symbol systems that are used to represent those changes. Since some representations are easier to understand than others, it would make sense to change the way a piece of code looks like to make it more readable to the programmer based on their current debugging needs.

A more useful code debugger would ask the programmer what their debugging needs are, and transform the code to show only the relevant code and data all in once place.

An example of how to implement that follows. It is shown as snapshots of debugging steps, and a lot of them, to make it easier to understand each aspect. I'll try to be gentle, I promise.

Every entered call has a box with three dots above it, like 

```cpp
// this thing
[...]
int main() {

    int local_variable = 3;
    
    //      currently executing code
          v--------------------------v
    print(some_function(local_variable));

    return 0;
}

int some_function(int number) {

    return number + number / 2;
}
```

When a call is stepped into, instead of jumping to the function definition, we paste the function body in place of the call and replace every use of a function parameter with the argument in the call, like 

```cpp
[...]
int main() {

    int local_variable = 3;
    
    // because we entered a call, 
    // a new call box is created
    [...]
    
    // returns are converted to variables and assigns
    int some_function_return;
    
    // the parameter `number` is replaced with the argument
                                            v----------------v
    some_function_return = local_variable + local_variable / 2;

    print(some_function_return);

    return 0;
}
```

You might notice that there's a bug in this program, but it's not obvious to the untrained eye. To debug it, we click the new call box and then on `values_shown`.

```cpp
[...]
int main() {

    int local_variable = 3;
    
    // values_shown = true
    [...]
    
    // `local_variable` is replaced with its value,
    // and because the result is a solvable expression,
    // we compute the result and display it

    // because we've reached a return,
    // we combine the declaration and assign

                               v
    int some_function_return = 4;

    print(some_function_return);

    return 0;
}
```

Clicking a call box shows a dropdown menu where settings like `values_shown`, `returns_shown`, and `past_shown` can be clicked to toggle them on and off. The settings change what the code looks like, to make the problem more obvious. Depending on your needs, which may change rapidly, you'll want to use different settings.

Let's hide the returns.

```cpp
[...]
int main() {
    
    // returns_shown = false
    [...]

          v
    print(4);

    return 0;
}
```

Let's set the `math_solve` setting for main to `false` so we can see the expression that gave us the incorrect value `4`. Now we can step through individual math expressions.

```cpp
// math_solve = false
[...]
int main() {

    int local_variable = 3;

    [...]

              v---v
    print(3 + 3 / 2);

    return 0;
}
```

Step next.

```cpp
[...]
int main() {

    int local_variable = 3;

    [...]

          v---v
    print(3 + 1);

    return 0;
}
```

Well there's our problem. Integer division returned a whole number `1` even though the mathematically correct result is `1.5`. To fix it, we cast the `number` parameter to `float` before the division.

```cpp
[...]
int main() {

    int local_variable = 3;

    print(some_function(local_variable));

    return 0;
}

float some_function(int number) {

    //              yay bug fixed
                    v-----------v
    return number + (float)number / 2;
}
```

Let's try an example that's a bit more interesting, one with recursion. No bugfixing this time, we'll just step through the program using this method to see what it looks like. We start debugging and stop at the first line in main.

```c
// the call box settings for main
// don't worry about them for now,
// they'll be explained along the way
// past_shown = true
// future_shown = true
// values_shown = false
// returns_shown = true
// math_solve = true
// idents_not_used_shown = false
[...]
int main() {

    v---------v
    int foo = 9;
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;
    foo /= bar;
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Step next.

```cpp
[...]
int main() {

    int foo = 9;

    v---------v
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;
    foo /= bar;
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Set a breakpoint on `foo /= bar`.

```cpp
[...]
int main() {

    int foo = 9;

    v---------v
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;
o   foo /= bar;
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Continue until breakpoint.

```cpp
[...]
int main() {

    int foo = 9;
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;

    v--------v
o   foo /= bar;
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Just like your grandpa's debugging so far. Let's click the call box for main and then `past_shown`.

```cpp
// past_shown = false
[...]
int main() {
    
    // the declarations of the local variables change to show their current state
    int foo = 8;
    int bar = 4;
    
    // the statements until the currently executing one become hidden

    v--------v
o   foo /= bar;
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Step next.

```cpp
[...]
int main() {
    
    // this is your new watch list
    int foo = 2;
    int bar = 4;
    
    // last statement hidden to keep you focused on the present

    v------v
    bar /= 2;
    foo *= bar;

    return factorial(foo);
}
```

Step next.

```cpp
[...]
int main() {

    int foo = 2;
    int bar = 2;

    v--------v
    foo *= bar;

    return factorial(foo);
}
```

Step next.

```cpp
[...]
int main() {

    int foo = 4;
    
    // `bar` was hidden because it won't be used in the future
    // and because `past_shown` is false and `idents_not_used_shown` is false

           v------------v
    return factorial(foo);
}
```

Let's click on `values_shown`.

```cpp
// values_shown = true
[...]
int main() {
    
    // because `foo` is not visibly used in the future,
    // and `past_shown` is false,
    // and `idents_not_used_shown` is false,
    // the declaration of `foo` disappears

           v----------v
    return factorial(4);
}
```

The called function.

```cpp
int factorial(int number) {
    
    if (number > 1) {

        return factorial(number) * number;
    }
    else {

        return 1;
    }
}
```

Step into the first call.

```cpp
[...]
int main() {

    
    // a call box appears above a variable where the return value will be stored
    // the settings are copied from the parent call box, in this case, the one for main

    // past_shown = false
    // future_shown = true
    // values_shown = true
    // returns_shown = true
    // idents_not_used_shown = false
    [...]
    int factorial_return;
    
    // because we replaced the parameter `number` with the variable `foo`,
    // we have one less layer of indirection
    // and because `values_shown` is true, we see the actual number, too

        v---v
    if (4 > 1) {

        factorial_return = factorial(4 - 1) * 4;
    }
    else {

        factorial_return = 1;
    }

    return factorial_return;
}
```

Turn `past_shown` back on again.

```cpp
[...]
int main() {
    
    // past_shown = true
    [...]
    int factorial_return;
    
    // because we're at the start of the function, there is no past to reveal

        v---v
    if (4 > 1) {

        factorial_return = factorial(4 - 1) * 4;
    }
    else {

        factorial_return = 1;
    }

    return factorial_return;
}
```

Hide past again and step next.

```cpp
[...]
int main() {
    
    // because `past_shown` is false,
    // we hide the if block, and
    // because we've reached a return and are about to exit the function, 
    // we combine the declaration with the assign
    [...]
                           v----------v
    int factorial_return = factorial(3) * 4;

    return factorial_return;
}
```

Hide future code for the first call.

```cpp
[...]
int main() {
    
    // future_shown = false
    [...]
    
    // nothing happens, because the call is about to return and has no future
    
                           v----------v
    int factorial_return = factorial(3) * 4;

    return factorial_return;
}
```

Step into the second call.

```cpp
[...]
int main() {

    [...]
    
    // because we've entered recursion, we need to know which return variable is which
    int factorial_return_1;

    [...]
    int factorial_return_2;
    
        v---v
    if (3 > 1) {}
    
    // because the `future_shown` copied from the first call is false,
    // the body of the if is not shown,
    // and the else is not shown

    // the first call's return assign is moved here, because we haven't actually finished returning
    factorial_return_1 = factorial_return_2 * 4;
    
    // because `future_shown` is still true for main, this still gets shown
    return factorial_return_1;
}
```

Step next.

```cpp
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]             v----------v
    int factorial_return_2 = factorial(2) * 3;

    factorial_return_1 = factorial_return_2 * 4;

    return factorial_return_1;
}
```

Step into the third call.

```cpp
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]
    int factorial_return_2;

    [...]
    int factorial_return_3;

        v---v
    if (2 > 1) {}

    factorial_return_2 = factorial_return_3 * 3;

    factorial_return_1 = factorial_return_2 * 4;
}
```

Step into the if.

```cpp
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]
    int factorial_return_2;

    [...]             v----------v
    int factorial_return_3 = factorial(1) * 2;
    
    // notice how the else doesn't bother us at all, and that
    // we don't have to waste brainpower on mapping symbols to values anymore?
    // we can focus only on what's important

    factorial_return_2 = factorial_return_3 * 3;

    factorial_return_1 = factorial_return_2 * 4;
}
```

Step into the fourth call.

```cpp
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]
    int factorial_return_2;

    [...]
    int factorial_return_3;

    [...]
    int factorial_return_4;

        v---v
    if (1 > 1) {}

    factorial_return_3 = factorial_return_4 * 2;

    factorial_return_2 = factorial_return_3 * 3;

    factorial_return_1 = factorial_return_2 * 4;

    return factorial_return_1;
}
```

The call stack is getting big. Time to trim it by hiding the returns on the second call recursively (yes, we can do that). Let's hide the future of main, as well. And let's turn the solving of math expressions off, too.

```cpp
// future_shown = false
[...]
int main() {
    
    // math_solve = false
    // recursively
    [...]
    int factorial_return_1;
    
    // returns_shown = false
    // recursively
    [...]
    [...]
    
    // the fourth one is still shown because we're in the middle of that function
    [...]
    int factorial_return_4;

        v---v
    if (1 > 1) {}
    
    // because `math_solve` is false,
    // the final return collapses into something nice, as well
    factorial_return_1 = factorial_return_4 * 2 * 3 * 4;
}
```

Step next.

```cpp
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]
    [...]

    [...]

    v------------------------v
    int factorial_return_4 = 1;
    
    // phew, finally an actual return value
    // recursion is tiresome, but this should make it less so

    factorial_return_1 = factorial_return_4 * 2 * 3 * 4;
}
```

I wonder what it looks like on the way up. Let's show all the returns.

```cpp
// returns_shown = true
// recursively
[...]
int main() {

    [...]
    int factorial_return_1;

    [...]
    int factorial_return_2;

    [...]
    int factorial_return_3;

    [...]

    v------------------------v
    int factorial_return_4 = 1;

    factorial_return_3 = factorial_return_4 * 2;

    factorial_return_2 = factorial_return_3 * 3;

    factorial_return_1 = factorial_return_2 * 4;
}
```

How did we get here, anyway?

```cpp
[...]
int main() {
    
    // past_shown = true
    // recursively
    [...]
    int factorial_return_1;

    if (4 > 1) {

        [...]
        int factorial_return_2;

        if (3 > 1) {

            [...]
            int factorial_return_3;

            if (2 > 1) {

                [...]
                int factorial_return_4;

                if (1 > 1) {}
                else {
                    
                    // now we see all the branching

                    v--------------------v
                    factorial_return_4 = 1;
                }

                factorial_return_3 = factorial_return_4 * 2;
            }

            factorial_return_2 = factorial_return_3 * 3;
        }

        factorial_return_1 = factorial_return_2 * 4;
    }
}
```

It's gotten a bit noisy with all those returns, let's hide them.

```cpp
[...]
int main() {
    
    // returns_shown = false
    // recursively
    [...]
    if (4 > 1) {

        [...]
        if (3 > 1) {

            [...]
            if (2 > 1) {

                [...]
                if (1 > 1) {}
                else {
                    
                    // because all the returns are hidden,
                    // and the next statement is from main
                    // the return is moved here

                           v
                    return 1 * 2 * 3 * 4;
                }
            }
        }
    }
}
```

Now let's see the identifiers instead of their values, to see what everything depends on.

```cpp
[...]
int main() {
    
    // because this variable is referenced in the future, we show its declaration and its current value
    int foo = 4;
    
    // values_shown = false
    // recursively
    [...]
    if (foo > 1) {

        [...]
        if ((foo - 1) > 1) {

            [...]

            if ((foo - 2) > 1) {

                [...]
                if ((foo - 3) > 1) {}
                else {
                           v
                    return 1 * (foo - 2) * (foo - 1) * foo;
                }
            }
        }
    }
}
```

Let's show the past and future of main.

```cpp
// past_shown = true
// future_shown = true
[...]
int main() {

    int foo = 9;
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;
    foo /= bar;
    bar /= 2;
    foo *= bar;

    [...]
    if (foo > 1) {

        [...]
        if ((foo - 1) > 1) {

            [...]
            if ((foo - 2) > 1) {

                [...]
                if ((foo - 3) > 1) {}
                else {
                    
                    // now we see everything we need,
                    // to understand how we got here
                    // and what we'll be doing next,
                    // all in one page

                           v
                    return 1 * (foo - 2) * (foo - 1) * foo;
                }
            }
        }
    }
}
```

Cool. Now that we understand what's going on, we can hide the past again, and show the values.

```cpp
// past_shown = false
// recursively
[...]
int main() {
    
    // values_shown = true
    // recursively
    [...]
    [...]
    [...]
    [...]

           v
    return 1 * 2 * 3 * 4;
}
```

Step next.

```cpp
[...]
int main() {

    [...]
    [...]
    [...]

           v---v
    return 1 * 2 * 3 * 4;
}
```

Step next.

```cpp
[...]
int main() {

    [...]
    [...]

           v---v
    return 2 * 3 * 4;
}
```

Step next.

```cpp
[...]
int main() {

    [...]

           v---v
    return 6 * 4;
}
```

Step next.

```cpp
[...]
int main() {

    v-------v
    return 24;
}
```

Show past code.

```cpp
// past_shown = true
[...]
int main() {

    int foo = 9;
    int bar = 2;

    foo = foo - 1;
    bar = bar + 2;
    foo /= bar;
    bar /= 2;
    foo *= bar;

    // we've come a long way, and we've seen many potential refactorings along the way

    v-------v
    return 24;
}
```

You should now have an idea of what a debugger like this would be useful for.

An actual implementation should have keyboard shortcuts to quickly change the settings for the current scope, and for moving the cursor to an upper or lower call box and selecting it as the target of the shortcuts. For really deep calls, we should be able to set a function other than main as top-level, so the indents don't get too big. We also need to be able to pin certain variables in place, so they don't disappear when we hide the past.