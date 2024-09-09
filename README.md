# An automated daily-updating crossword puzzle
This started out as a fun project to test the OpenAI API, as well as condition my own
back-end development skills. And honestly for the most part it went off without a hitch.
It was a good thought experiment in array traversal and fitting. The idea was simple -
have the OpenAI API generate a new set of crossword, words, everyday. The logic was tested and
put in place to make sure the words would be fit and parsed. Which is good, but only if the API
gives a valid crossword to start with. Which no matter the prompt, the API cannot seem to comprehend
what it means to have a valid crossword. That is, having a grid of words constructed of valid words up and down while
intersecting. If you can find a solution to this issue - please let me know! Feel free to play with it.

The working parts so far are:
- Word parsing and fitting from prompt in specific format
- Scheduling (When the crossword is generated)
- OpenAI prompt generation and calling

Needed to work:
- Express
- MongoDB
- Open AI