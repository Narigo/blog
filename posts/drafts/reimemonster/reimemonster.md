# The Reimemonster library

A while ago, I started working on a small library called "reimemonster". As I like writing small personal poems for 
family and friends on birthday or congratulation cards, most of the time I do it in this fashion:

1. Think of a theme what I want to say (birthday, etc.).
2. Think of two words that rhyme well.
3. Make two lines out of it with the same amount of syllables.
4. If the count does not match, try to change words until the count of syllables match.
5. Make up the next lines and keep the same syllable count.
6. Repeat until the card is full / the poem is done.

The nice thing about this approach is that abiding to this small set of rules usually makes the poem sound okay. At 
least the feedback was more positive in relation to "Congratulations to your XXX, wish you all the best"-template texts.

## Motivation

Counting of syllables takes up a lot of time in the described process. When starting to work on the library, I wanted to
get something usable for me that helps me speeding this up. Another part I had in mind was "finding a word that rhymes".

I was sure that something already exists out there to help me with that. A web-service. Something easy to use. I 
couldn't really find it and I think now that I know why.

## Counting syllables

The naive implementation idea I had for this was to use a tool to put hyphens in words and just split on them. It works
quite well on most of the words, but there are some which result in an incorrect number. Setting a hyphen is not 
splitting on syllables really. The German word `oder` is a great example for this. You cannot split this word with a 
hyphen but reading it out loud reveals two syllables: `o - der`.

So for now I've realized that there are some words where I need to be cautious, but at least it gives me a correct 
result for most of the time - when I'm not running into some of these exceptions. For most of the words, this approach
worked a lot better than I expected. And there is a module for splitting words with hyphens. Looks like this is a real
issue for word processing and people wanted to have that.

I will probably have another take on this by trying to make up rules (for German) to get an even more reliable count of
syllables in the future.

## Finding rhymes

I thought this one was tougher than splitting words into syllables. For my purpose, I think I found something working 
quite well: Checking a dictionary list if a word matches the last few characters of the word I put in. I admit, there 
can be false positives with this approach, as the sound may not be completely correct. Having tested it for myself a bit
now, the results are not too bad and I get some creative input for finding the next line.
