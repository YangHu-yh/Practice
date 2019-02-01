** Notes on things I learned and things I paid attention to. **

- Need to  pay attention to the different class
- Bracket here is a newly defined type
  - Stack could totally use other type such as `Stack<Strings>` or `Stack<Int>`
  - Created `class Bracket` mainly to store the position of the element that was added to the stack, so that there is no wasted effort to determine the position by looping it again.

- Need to differentiate places to use the function over the created stack or the Bracket element.
- Be careful about the following cases:
  - when there is no further character in the string to read while the stack is not empty either before or after adding the current element.
  - the next case is ')', ']', '}' but the stack is empty.
    - print the final result by boolean if the "falseposition" is the same as we created it with initial value -10, since sometimes we could not determine if the stack is Empty because the brackets are balanced, or if it was empty because the first bracket is backward.
