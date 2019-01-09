News Meme generator
----

This is a simple meme generator for articles published from [topolitque.ch](http://www.topolitique.ch) destined for sharing them on various social media platforms. It is inspired from Vox's [meme project](https://github.com/voxmedia/meme), however this tool doesn't generate an image from a link, and lacks some options specific to news articles. Also, the code from vox's repo is outdated.

> Unfortunately, due to restrictions with CORS, only a few news sources work, such as bbc news and the guardian (no image, but the rest works). I'd be happy to get some help on how to overcome these (obviously, only with client-side javascript). Still, you can see it in action here : [http://topolitique.ch/neme/](http://topolitique.ch/neme/)

![neme image](https://github.com/the-duck/neme/raw/master/screenshot.png)

## Websites that work with News Meme Generator
* [topolitique.ch](http://www.topolitique.ch)
* [theguardian.com](https://theguardian.com)
* [bbc.com](https://bbc.com)
* [courrierinternational.com](https://courrierinternational.com)
* [20minutes.fr](https://20minutes.fr)


## Wallpaper

![examples](https://github.com/the-duck/neme/raw/master/wallpaper.png)


## The code

It is implemented solely on html5 and js, thus saving the cost of running a server side image-editing system as all the computing is done on the client side, while keeping the advantages of the web : easy usage by anyone, and continuous updates on the code.

It also doesn't require any building, as it is HTML and JS to its most basic, meaning that it is easily hackable. Feel free to steal functions that might be useful if you need to draw things like text and rounded images on canvas in the `js/functions.js` file.

##  TODO - Version 2 (planned 30/01/2019):
* Change text drawing functions (prepare text, then draw, to know the size it takes) √
* Enable support for options (functions should also take into account the options) √
* Draw one image rather than all, thus skimming duplicate code √
* Implement Twitter and Facebook images (right now only insta stories and feed) ~√
* Make it more general (less focused on *TOPO*), compatible with most articles ~√ (in theory compatible, though mostly not the case, du to CORS permission issues)
* Fix issue when no image is found -> freezes the process, essentially due to the asynchronous nature of JS and the impossibility of finding a good solution to not write hundreds of lines of code that do the same thing. √ (fixed with Promises)
* Find out about multiple authors standard with `meta` tags, or other, and about author's profile image. ~√ (implemented '<a rel="author">')
* Add more options, perhaps a system where all options can be copy/pasted in one go.
  - custom background image √
  - source text colour
  - author text colour
  - custom watermark/overlay image √

## TODO : future
* Look into animation
* something to look at : https://schema.org/NewsArticle
