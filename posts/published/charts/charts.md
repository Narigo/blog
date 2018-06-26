# Crawling charts and make them searchable by date

Due to this [tweet](https://twitter.com/larsr_h/status/1002516381672370178), I wanted to find out what the song is
that defines my life. I quickly found out that you can easily search that song, but I couldn't really find a simple database
containing all the German charts.

This is how [this charts database](https://narigo.github.io/charts/) came into existence. If you want to see how it is
built, I recommend checking out [its source code on GitHub](https://github.com/Narigo/charts) while reading the rest of
this post.

## Where the data comes from

Wikipedia does a great job archiving a lot of history. It's great finding out information and data, but it's not very
convenient if you really want a database of similar facts. Answering the question "When was which song in the charts?"
only works by switching pages to find other data.

Here is a page containing all
[number one hits of Germany in 1988](<https://de.wikipedia.org/wiki/Liste_der_Nummer-eins-Hits_in_Deutschland_(1988)>).
Switching to any other year since 1953 by changing the URL, you can see that it has all the information needed to
generate a real database.

As you can find out from the crawler source, it uses Wikipedia and reads all the data into a JSON file. The raw data
sometimes seems to be a bit different with some inconsistent data regarding durations and where dates are put. This is
why there are two scripts in the repository: `crawler.js` and `duration.js`. The crawler fetches the data from Wikipedia
and the `duration.js` script fixes dates and more to compile all results from the crawler into a usable database.

## Crawling the data

The crawling is done by using [puppeteer](https://github.com/GoogleChrome/puppeteer). It is a headless version of the
Chrome browser which is very easy to automate through a script. The
[crawler.js](https://github.com/Narigo/charts/blob/master/crawler.js) script shows how to use it: First, we launch a
browser "window" (`puppeteer.launch()`), then we open a new tab (`browser.newPage()`) and let this tab navigate to the
desired URL (`page.goto(...)`). The option `waitUntil: "networkIdle2"` makes the promise resolve only when all initial
network requests are done and the page looks like it is fully loaded. Through `page.evaluate()`, we can interact with
the currently opened page. On it, we use vanilla JavaScript to read data from the page and return it. The result is
returned to the caller of `page.evaluate()`.

Cleaning up, we always close the browser when finishing a URL and we write down the results into a simple JSON file.

### Caveats

While many pages look the same, there are some that change the structure of the tables we crawl. Have a look at the
[year 1989](<https://de.wikipedia.org/wiki/Liste_der_Nummer-eins-Hits_in_Deutschland_(1989)>) for example: The table
containing the wanted information start to look different. If all pages were the same, we could always open the URL,
crawl the page and read the data from the first table.

There are other tables which look the same in style but are not at the same spot on the page. Or another table was put
before the one we want to read. There are a lot of possibilities, so we need to use fallbacks. In the code, it is done
by going through arrays of possibilities and testing if information can be scraped by using these selectors. If it is
impossible to find singles or albums, it complains and we can see the error in the output.

## Make the data searchable by duration

The second script, called [duration.js](https://github.com/Narigo/charts/blob/master/duration.js) takes the result of
the crawler and puts the dates into a sortable format (`YYYY-MM-DD`). By doing so, we can check if a date falls into the
duration of a song. It is simple to generate a search index by year this way, so a computer can quickly search through
all of the entries in a year. Adding months as a second index would not really add value: Some songs were in the charts
longer than one month, which would make the script a lot more complicated. Also, the entries in a year cannot exceed the
number of weeks (yet) and even if it were "by day", it will still be quickly enough for a computer to go through all the
entries.

The returned `result.json` is currently under 300kb (mid 2018). The
[demonstration page](https://narigo.github.io/charts/) contains the whole database without making an additional call.
