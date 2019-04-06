var globalOptions = {
  "instagram-feed" : {
    imageWidth:1280,
    imageHeight:1280,
    kickerFontSize:32,
    headlineFontSize:72,
    headlineLineMargin:8,
    headlineRoundedCorders:4,
    authorsFontSize:36,
    bottomMargin:256,
    leftMargin:48,
    rightMargin:48,
    authorImageSize:116,
    authorsLeftMargin:12
  },
  "instagram-story" : {
    imageWidth:1080,
    imageHeight:1920,
    kickerFontSize:28,
    headlineFontSize:64,
    headlineLineMargin:12,
    headlineRoundedCorders:8,
    authorsFontSize:28,
    bottomMargin:456,
    leftMargin:150,
    rightMargin:150,
    authorImageSize:96,
    authorsLeftMargin:12
  },
  "twitter-feed" : {
    imageWidth:1080,
    imageHeight:512,
    kickerFontSize:24,
    headlineFontSize:48,
    headlineLineMargin:6,
    headlineRoundedCorders:4,
    authorsFontSize:24,
    bottomMargin:128,
    leftMargin:24,
    rightMargin:400,
    authorImageSize:96,
    authorsLeftMargin:12
  },
  "facebook-feed" : {
    imageWidth:1200,
    imageHeight:630,
    kickerFontSize:28,
    headlineFontSize:60,
    headlineLineMargin:6,
    headlineRoundedCorders:4,
    authorsFontSize:24,
    bottomMargin:128,
    leftMargin:48,
    rightMargin:400,
    authorImageSize:96,
    authorsLeftMargin:12
  },
  "youtube-thumbnail" : {
    imageWidth:1280,
    imageHeight:720,
    kickerFontSize:36,
    headlineFontSize:80,
    headlineLineMargin:6,
    headlineRoundedCorders:8,
    authorsFontSize:24,
    bottomMargin:116,
    leftMargin:48,
    rightMargin:100,
    authorImageSize:96,
    authorsLeftMargin:12
  }
};

var sourceOptions = {
  default: {
    background:"rgb(80,80,80)",
    foreground:"white",
    text:"Unkown source"
  },
  "topolitique.ch": {
    background:"#C30E00",
    foreground:"#ffffff",
    text:"Topolitique"
  },
  "theguardian.com": { /*this source works, at least...*/
    background:"#4054B2", /* TODO : find proper colour*/
    foreground:"#ffffff",
    text:"The Guardian"
  },
  "bbc.com": {
    background:"#C30E00",
    foreground:"#ffffff",
    text:"BBC"
  },
  "rts.ch" : {
    background:"red",
    foreground:"#ffffff",
    text:"RTS News"
  },
  "courrierinternational.com" : {
    background:"#FFEB00",
    foreground:"#000000",
    text:"Courrier International"
  }
}



/* functions to avoid missing properties */
function getSourceOptions(source)  {
  try {
    var s_options = sourceOptions.default;
    for (var attrname in sourceOptions[source]) { s_options[attrname] = sourceOptions[source][attrname]; }
    if (source && !sourceOptions[source].text) {
      s_options.text = source
    }
  } catch (e) {
    /* not sure it ever gets to there */
    var s_options = sourceOptions.default;
    if (source) {
      s_options.text = source
    }
  }
  return s_options;
}
function customSourceOptions(opts) {
  var s_options = sourceOptions.default;
  for (var attrname in opts) { s_options[attrname] = opts[attrname]; }
  return s_options
}
