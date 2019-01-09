

function onload() {
  /* Console welcome message*/
  console.log('%cHey !%c', 'color:rgb(255,30,30);font-weight:bold;font-size:32px;font-family:Helvetica');
  console.log('%cInterested in this little tool? Check out the source code !%c', 'color:rgb(30,30,145);font-size:16px;font-family:monospace');
  console.log('%cAnd feel free to improve it ! %c', 'color:rgb(30,30,145);font-size:16px;font-family:monospace');
  console.log('%chttp://github.com/the-duck/neme %c', 'color:rgb(30,30,145);font-size:16px;font-family:monospace');
}

/*
  Main process : (1) get info from article, (2) get user inputs, (3) draw
*/
function generateImage(){
  getArticleInfo().then(function(articleInfo) {
    var options = getOptions(articleInfo);
    renderCanvas(options)
  })
}

function file_get_contents_curl($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

function getArticleInfo(){
  /*
    Get article's information from url
  */
  /*default data*/
  var articleInfo = {
    headline:"Write your custom headline there 👈",
    backroundImage:null,
    kicker:null,
    source:null,
    authorOneName:null,
    authorOneThumbnail:null,
    authorTwoName:null,
    authorTwoThumbnail:null,
    authorThreeName:null,
    authorThreeThumbnail:null,
  };
  /* get url from data */
  urlObj = document.getElementById('url');
  articleInfo.url = urlObj.value;
  articleInfo.source = getSourceFromUrl(articleInfo.url);

  var articleDataPromise = new Promise(function(resolve, reject) {
    if (articleInfo.url) {
      console.log('Retrieving info for : ', urlObj.value);
      var url = getWhateverOriginUrl(articleInfo.url);/* workaround CORS permission issue */

      var iframeElement = document.getElementById('iframe');
      iframeElement.src=articleInfo.url;
      iframeElement.onload=function() {
        console.log('loaded');
      }

      //url = articleInfo.url;
      $.ajax({
        url: url,
        dataType: 'json',
        timeout:3000,
        error: function(e) {
          console.warn('Could not retrieve the articles information');
          resolve(false);
        },
        success: function(data) {
          var el = document.createElement( 'html' );
          el.innerHTML = data.contents;

          /* find authors through <a rel="author">...</a> */
          var listOfLinks = el.getElementsByTagName("A");
          var authNum=0;
          for (var i = 0; i < listOfLinks.length; i++) {
            if (listOfLinks[i].rel=="author") {
              var htmlRegex = new RegExp("<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)</\1>");
              var firstElement = listOfLinks[i].innerHTML;
              if (listOfLinks[i].firstChild){
                var authorName = listOfLinks[i].firstChild.innerHTML;
              } else {
                var authorName = listOfLinks[i].innerHTML;
              }

              if (authNum===0) {
                articleInfo.authorOneName=authorName;
                authNum+=1
              }
              if (authNum===1 && articleInfo.authorOneName!=authorName) {
                articleInfo.authorTwoName=authorName;
                authNum+=1
              }
              if (authNum===2 && articleInfo.authorTwoName!=authorName) {
                articleInfo.authorThreeName=authorName;
                authNum+=1
              }

            }
          }
          /* find info from <meta ... /> */
          var list = el.getElementsByTagName("meta");
          for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute('property')==="og:title") {
              articleInfo.headline = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="og:description") {
              articleInfo.description = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="og:image") {
              articleInfo.backgroundImage = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:kicker") {
              articleInfo.kicker = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="topo:kicker") {
              articleInfo.kicker = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="author") {
              articleInfo.authorOneName = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:1:name") {
              articleInfo.authorOneName = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:1:image") {
              articleInfo.authorOneThumbnail = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:2:name") {
              articleInfo.authorTwoName = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:2:image") {
              articleInfo.authorTwoThumbnail = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:3:name") {
              articleInfo.authorThreeName = list[i].getAttribute('content');
            }
            if (list[i].getAttribute('property')==="article:author:3:image") {
              articleInfo.authorThreeThumbnail = list[i].getAttribute('content');
            }
          }
          resolve(articleInfo);
        }
      });
    } else { 
      console.log("Continuing without an article input");
      resolve(articleInfo);
    }
  })

  /*
    Get user input from the UI
  */
  /*articleDataPromise.then(function(value) {
    getOptions(value)
  });*/
  return articleDataPromise;
}

function getOptions(articleInfo) {
  /*default data*/
  var options = Object.assign(articleInfo, {
    width:640,
    height:640,
    showKicker:true,
    showAuthor:true,
    showWatermark:true,
    showLogo:false,
    authorSource:null,
  });
  /* options -> select */
  var formatType = document.getElementById('format').selectedOptions[0].getAttribute('value');
  options.format = formatType;
  options.width = globalOptions[options.format].imageWidth;
  options.height = globalOptions[options.format].imageHeight;
  /* booleans -> checkboxes */
  var showAuthor = document.getElementById('showAuthor');
  options.showAuthor = showAuthor.checked;
  var showKicker = document.getElementById('showKicker');
  options.showKicker = showKicker.checked;
  var showWatermark = document.getElementById('showWatermark');
  options.showWatermark = showWatermark.checked;

  /* text inputs -> input[type="text"] */
  var customHeadline = document.getElementById('customHeadline');
  if (customHeadline.value!=''){
    options.headline= customHeadline.value;
  } else {
    customHeadline.value=options.headline;
  }
  var customKicker = document.getElementById('customKicker');
  if (customKicker.value!=''){
    options.kicker= customKicker.value;
  }
  var customSource = document.getElementById('customSource');
  if (customSource.value!=''){
    options.source= customSource.value;
  } else {
    customSource.value=options.source;
  }
  var customAuthorName = document.getElementById('customAuthorName');
  if (customAuthorName.value!=''){
    options.authorName= customAuthorName.value;
  }
  var customHeadlineColor = document.getElementById('customHeadlineColor');
  if (customHeadlineColor.value!=''){
    options.headlineColor= customHeadlineColor.value;
  }
  var customHeadlineBackground = document.getElementById('customHeadlineBackground');
  if (customHeadlineBackground.value!=''){
    options.headlineBackgroundColor= customHeadlineBackground.value;
  }
  /* file inputs -> input[type="file"] */
  var customBackgroundImage = document.getElementById('customBackgroundImage');
  if (customBackgroundImage.value) {
    options.backgroundImage= URL.createObjectURL(customBackgroundImage.files[0]);
  }

  return options;

  /* set articleInfo in options */
  /*
    Draw the image on canvas
  */
  /*renderCanvas(articleInfo,options);*/
}

function renderCanvas(options) {
  /* Empty element where canvas should be */
  var block = document.getElementById('canvas-block');
  block.innerHTML="";
  /* Create canvas */
  var can1 = document.createElement('canvas');
  can1.id = "neme-image";
  can1.width = options.width;
  can1.height = options.height;
  var ctx1 = can1.getContext("2d");
  block.appendChild(can1);

  /* Draw a black background */
  ctx1.beginPath();
  ctx1.fillStyle="#000000";/* TODO : add as an option?*/
  ctx1.rect(0,0,options.width,options.height);
  ctx1.fill();
  ctx1.closePath()
  /* Find (or not) and draw background image */
  var backgroundImagePromise = new Promise(function(resolve, reject){
    var img = new Image();
    var timestamp = new Date().getTime(); /* hack around CORS permission issue */
    img.onload = function(event) {
      renderBackgroundImage(ctx1, this, {width:options.width, height:options.height});
      resolve(true);
    }
    img.onerror = function(event) {
      console.warn('The image we found is not suitable (probably a CORS issue)');
      resolve(false); /* continue the process */
    };
    if (options.backgroundImage) {
      img.src = options.backgroundImage;
    } else {
      console.warn('Couldnt find an image');
      img.src = "http://www.itsmarko.com/neme/style/bg.png" + '?' + timestamp;
    }
  });

  backgroundImagePromise.then(function(value){
    /* Draw watermark/overlay */
    /* TODO : find cleaner way of including overlay image + add custom overlay image option*/
    var overlayPromise = new Promise(function(resolve, reject){
      var overlay = new Image();
      var timestamp = new Date().getTime();
      if (options.format==="instagram-feed") {
        overlay.src = "http://www.itsmarko.com/neme/style/watermark_Square.png"+ "?"+timestamp;
      } else if (options.format==="instagram-story") {
        overlay.src = "http://www.itsmarko.com/neme/style/watermark_Screen.png"+ "?"+timestamp;
      } else if (options.format==="twitter-feed") {
        overlay.src = "http://www.itsmarko.com/neme/style/watermark_Twitter.png"+ "?"+timestamp;
      } else {
        overlay.src = "http://www.itsmarko.com/neme/style/watermark_Screen.png"+ "?"+timestamp;
      }
      overlay.onload = function(e) {
        if (options.showWatermark) {
          ctx1.drawImage(overlay, 0,0);
        }
        resolve(true);
      }
      overlay.onerror = function(e) {
        console.warn('Could not load watermark/overlay image');
        resolve(false);
      }
    })
    overlayPromise.then(function(wat){
      /* Draw Headline */
      /* custom options */
      if (options.headlineColor) {
        var headlineColor = options.headlineColor
      } else {
        var headlineColor = "#ffffff"
      }
      if (options.headlineBackgroundColor) {
        var headlineBackground = options.headlineBackgroundColor
      } else {
        var headlineBackground = "transparent"
      }
      var headlineOptions = {
        fontSize:globalOptions[options.format].headlineFontSize,
        lineHeight:Math.round(globalOptions[options.format].headlineFontSize*1.2),
        width:options.width-globalOptions[options.format].leftMargin-globalOptions[options.format].rightMargin,
        fontFamily:"IBM Plex Sans",
        fillForeground:headlineColor,
        fillBackground:headlineBackground,
        lineMargin:globalOptions[options.format].headlineLineMargin,
        roundedCorners:globalOptions[options.format].headlineRoundedCorders
      }
      var headlineDrawable = prepareText(ctx1, options.headline, headlineOptions);
      renderText(ctx1, headlineDrawable, {x:globalOptions[options.format].leftMargin, y:options.height-headlineDrawable.height-globalOptions[options.format].bottomMargin});

      /* Draw Kicker */
      if (options.showKicker) {
        if (options.kicker) {
          var kickerDrawable = prepareText(ctx1, options.kicker, {fontSize:globalOptions[options.format].kickerFontSize,lineHeight:Math.round(globalOptions[options.format].kickerFontSize*1.5),width:options.width-globalOptions[options.format].rightMargin,fontFamily:"IBM Plex Sans",fillForeground:"#1e1e1e",fillBackground:"#ffffff", roundedCorners:4});
          renderText(ctx1, kickerDrawable, {x:globalOptions[options.format].leftMargin+globalOptions[options.format].headlineFontSize/8, y:options.height-headlineDrawable.height-kickerDrawable.height-globalOptions[options.format].bottomMargin-10});
        }
      }


      /* Draw Author's faces (only for topolitique.ch articles); create author text (any article) */
      var authorsText = "";
      var authorsNum = 0;
      if (options.authorName) {
        /* custom options */
        authorsText = options.authorName;
      } else {
        /*this system is not great*/
        if (options.authorOneName) {
          var authorsText=authorsText+options.authorOneName;
          if (options.showAuthor && options.authorOneThumbnail) {
            authorsNum=1;
            var au = new Image();
            var timestamp = new Date().getTime();
            au.src = options.authorOneThumbnail+ "?"+timestamp;
            au.onload = function(e){
              renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin,y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
            }
          }
        }
        if (options.authorTwoName) {
          var authorsText=authorsText+", "+options.authorTwoName;
          if (options.showAuthor && options.authorTwoThumbnail) {
            authorsNum=2;
            var au2 = new Image();
            var timestamp = new Date().getTime();
            au2.src = options.authorTwoThumbnail+ "?"+timestamp;
            au2.onload = function(e){
              renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin+(globalOptions[options.format].authorImageSize+14),y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
            }
          }
        }
        if (options.authorThreeName) {
          var authorsText=authorsText+", "+options.authorThreeName;
          if (options.showAuthor && options.authorThreeThumbnail) {
            authorsNum=3;
            var au2 = new Image();
            var timestamp = new Date().getTime();
            au2.src = options.authorThreeThumbnail+ "?"+timestamp;
            au2.onload = function(e){
              renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin+2*(globalOptions[options.format].authorImageSize+14),y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
            }
          }
        }
      }

      /* set author's text margin, whether there are author's images or not. */
      if (options.showAuthor) {
        var leftPos = globalOptions[options.format].leftMargin+(globalOptions[options.format].authorImageSize+14)*(authorsNum)+14;
      } else {
        var leftPos=globalOptions[options.format].leftMargin+globalOptions[options.format].headlineFontSize/4;
      }
      if (authorsNum==0) {
        var leftPos=globalOptions[options.format].leftMargin+globalOptions[options.format].headlineFontSize/4;
      }
      /* Draw author text */
      if (authorsText) {
        var textWidth = options.width/3*2;
        var authorTextOptions = {
          fontSize:globalOptions[options.format].authorsFontSize,
          lineHeight:Math.round(globalOptions[options.format].authorsFontSize*1.5),
          width:textWidth,
          fontFamily:"IBM Plex Sans",
          fontWeight:'normal',
          textShadow:false,
          fillForeground:'#ffffff',
          fillBackground:"rgba(30,30,30,0.1)",
          roundedCorners:4,
          textMargin:3
        }
        /* TODO : set options to style author text?*/
        var authorTextDrawable = prepareText(ctx1, authorsText, authorTextOptions);
        renderText(ctx1, authorTextDrawable, {x:leftPos, y:options.height-globalOptions[options.format].bottomMargin+10});
        var sourceTopMargin = authorTextDrawable.height;
      } else {
        var sourceTopMargin = 0;
      }

      if (options.source) {
        var soOptions = getSourceOptions(options.source);
        /* TODO : set options to style source?*/
        var sourceDrawable = prepareText(ctx1, soOptions.text, {fontSize:20, lineHeight:30, width:300, fontFamily:"IBM Plex Sans", fillBackground:soOptions.background,fillForeground:soOptions.foreground, roundedCorners:3});
        renderText(ctx1, sourceDrawable, {x:leftPos, y:options.height-globalOptions[options.format].bottomMargin+15+sourceTopMargin});
      }
    }) /* after overlay is drawn */ ;
  }) /* after background is drawn */
}


function getSourceFromUrl(url) {
  return url.replace('http://','').replace('https://','').replace('www.','').split('/')[0];
}
function getWhateverOriginUrl(url){
  return 'http://whateverorigin.org/get?url='+encodeURIComponent(url)+'&callback=?';
}
