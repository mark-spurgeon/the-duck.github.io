


/* SMIG v.2 - canvas drawing functions */


function prepareText(ctx,text, opts) {
  /*check options*/
  options = {
    width:opts.width||10,
    lineHeight:opts.lineHeight||64,
    lineMargin:opts.lineMargin||0,
    fontSize:opts.fontSize||48,
    fontFamily:opts.fontFamily||'Helvetica',
    fontWeight:opts.fontWeight||'bold',
    textShadow:opts.textShadow||true,
    textMargin:opts.textMargin||null,
    fillBackground: opts.fillBackground || '#ffffff',
    fillForeground: opts.fillForeground || '#000000',
    roundedCorners:opts.roundedCorners || 0
  }
  /* if no text */
  if (! text) {
    text = "no text..."
  }

  /* setup font */
  ctx.font = options.fontWeight+" " +  options.fontSize + "px " + options.fontFamily;

  var templine = '';
  var tempy = 0;
  var words = text.split(' ');
  var lines = [];

  for (var n = 0; n < words.length; n++) {
    var testLine  = templine + words[n] + ' ';
    var metrics   = ctx.measureText( testLine );
    var testWidth = metrics.width;

    if (testWidth > options.width && n > 0) {
      tempy += options.lineHeight;
      lines.push({
        text:templine,
        y:tempy-options.lineHeight,
        width:ctx.measureText(templine+' ').width
      });
      templine = words[n] + ' ';
    } else {
      templine = testLine;
    }
    if (n+1==words.length) {
      lines.push({
        text:templine,
        y:tempy,
        width:ctx.measureText(templine+' ').width
      });
    }
  }

  for (var i = 0; i < lines.length; i++) {
    lines[i].y = lines[i].y+(i*options.lineMargin)
  }

  height = lines.length*options.lineHeight+options.lineMargin*(lines.length-1);

  return {
    lines:lines,
    width:options.width,
    height:height,
    options:options
  }

}



function renderText(ctx, info, options) {
  for (var attrname in info.options) { options[attrname] = info.options[attrname]; }
  for (var i = 0; i < info.lines.length; i++) {
    ctx.beginPath();
    var line = info.lines[i];
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle=options.fillBackground;
    if (options.roundedCorners) {
      renderRoundRect(ctx, options.x, options.y+line.y,line.width,options.lineHeight, options.roundedCorners);
    } else {
      ctx.rect(options.x,options.y+line.y,line.width,options.lineHeight);
    }
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = options.fontWeight+" " +  options.fontSize + "px " + options.fontFamily;

    var leftPadding = options.fontSize/4;
    if (options.textMargin) {
      leftPadding = options.textMargin;
    }
    /*if (options.fontSize<33) {
      leftPadding=4
    }*/
    if (options.textShadow) {
        ctx.shadowColor = "rgba(0,0,0,0.2)"; /* TODO : add this option */
        ctx.shadowOffsetX = -leftPadding/4;
        ctx.shadowOffsetY = leftPadding/4;
        ctx.shadowBlur = 0;
    }
    ctx.fillStyle=options.fillForeground;
    //var verticalPadding = (options.lineHeight-options.fontSize)/2;
    ctx.fillText(line.text, options.x+leftPadding, options.y+line.y+options.lineHeight/2);
    ctx.shadowColor = "transparent";
    ctx.textBaseline = 'top';
    ctx.closePath();
  }
}


function renderBackgroundImage(ctx, image, opts) {
  var options = {
    width:opts.width||120,
    height:opts.height||120,
    imageWidth:image.width||120,
    imageHeight:image.height||120
  }
  var imHeight = 0;
  var imWidth = 0;
  var ratio = options.imageWidth/options.imageHeight;
  if (options.imageWidth<options.width && options.imageHeight>options.height) {
    var imWidth = options.width;
    var imHeight = options.width/ratio;
    ctx.drawImage(image, (imWidth-options.width) / -2 , 0, imWidth, imHeight );
  } else if (options.imageHeight<options.height && options.imageWidth>options.width) {
    var imHeight = options.height
    var imWidth = options.height*ratio;;
    ctx.drawImage(image, (imWidth-options.width) / -2 , 0, imWidth, imHeight );
  } else if (options.imageHeight<options.height && options.imageWidth<options.width) {
    /* calculate if height or width is better*/
    var he = options.height-options.imageHeight;
    var wi = options.width-options.imageWidth;
    if (he>wi) {
      var imHeight = options.height
      var imWidth = options.height*ratio;;
    } else {
      var imWidth = options.width;
      var imHeight = options.width/ratio;
    }
    ctx.drawImage(image, (imWidth-options.width) / -2 , 0, imWidth, imHeight );
  } else {
    var imWidth=options.imageWidth;
    var imHeight=options.imageHeight;
    if (options.imageWidth<options.imageHeight) {
      imWidth=options.width;
      imHeight=options.width/ratio;
    } else if (options.imageWidth>options.imageHeight){
      imWidth=options.height*ratio;
      imHeight=options.height;

    }
    ctx.drawImage(image, (imWidth-options.width) / -2, (imHeight-options.height) / -2, imWidth, imHeight );
  }
}


function renderRoundRect(ctx, x, y, width, height, radius) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

// taken from an anonymous user at https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas

function renderCoverImage(ctx, img, options) {
    x = options.x||0;
    y = options.y||0;
    w = options.width || ctx.canvas.width || 100;
    h = options.height || ctx.canvas.height || 100;

    // default offset is center
    offsetX = typeof options.offsetX === "number" ? options.offsetX : 0.5;
    offsetY = typeof options.offsetY === "number" ? options.offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

function renderCircleImage(ctx, image, opts) {
  var options = {
    x:opts.x||0,
    y:opts.y||0,
    size:opts.size||120,
  }
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2+2, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2+6, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(image, options.x,options.y, options.size,options.size)
  // Undo the clipping
}
