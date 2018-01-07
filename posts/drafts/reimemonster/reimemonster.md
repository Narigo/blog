# The Reimemonster library

A while ago, I started working on a small library called "[reimemonster](https://github.com/Narigo/reimemonster)". As I
like writing small personal poems for family and friends on birthday or congratulation cards, most of the time I do it
in this fashion:

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

## Counting syllables

I was sure that something already exists out there to help me with that. A web-service. Something easy to use. I 
couldn't really find it and by now I think I know why.

The first implementation idea was to use a tool to put hyphens in words and just split on them. It works quite well on 
most of the words, but there are some which result in an incorrect number. Setting a hyphen is not splitting on 
syllables really. The German word `oder` is a great example for this. You cannot split this word with a hyphen but 
reading it out loud reveals two syllables: `o • der`. Another example would be `Ameise` which should be splitted into 
`Amei- se` but actually has three syllables: `A • mei • se`.

In my tests I've used the [hyphen](https://github.com/ytiurin/hyphen) module to check how it works out. Most of the 
time, I got the correct result for the splits, but while testing, I found quite a few exceptions (like the ones above) 
that made using the module not too nice. It works okay most of the time, but it's not really what I was looking for.

You can still see old commits with `countSyllables` using this approach, but in the newer versions, I've switched to 
another approach. That new approach is quite simple: Count all occurrences of one or two vowels that you find in a word.
When I find exceptions, I've added them by splitting on these kind of exceptions before counting this. This actually 
yielded better results than expected, so I kept going further in this direction.

The biggest problem I had with this is that I couldn't "show" the syllables / where it splits.

## Finding rhymes

I thought this one was tougher than splitting words into syllables. For my purpose, I think I found something working 
quite well: Checking a dictionary list if a word matches the last few characters of the word I put in. I admit, there 
can be false positives with this approach, as the sound may not be completely correct. Having tested it for myself a bit
now, the results are not too bad and I get some creative input for finding the next line.

Manually changing the ending of a word in order to find words with the same sound but not exactly the same letters was
okay for me. Using this is still a creative process and there are sometimes really unexpected results, but they usually
lead to something that I would not have thought of.

If I would try to make this better, I would have a look into phonetic word lists. If only I could find such lists...!

## Demo

I've created a little demo page inside of the repository that can be run when doing a `npm run demo`. This will start up
a small HTTP server via Python. Most probably I will create a real page for it somewhere soon.

## Conclusion

There are a lot of exceptions regarding splitting words and also how to pronounce words such that finding rhymes yields
better results. Because of the exceptions I've always thought of ideas for machine learning. Maybe a neural net that 
tells me what words could work well on the last sentence. But doing so is probably a lot more work and you need a lot of
poems, etc.

Also a database to look up things is probably necessary anyways for someone. So I'd try to keep up working on this 
before getting too deep into that rabbit hole.
