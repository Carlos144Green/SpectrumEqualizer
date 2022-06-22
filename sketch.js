var soundFile;
var fft;

var bars = 16;
var hats = new Array(bars)
hats.wait = new Array(bars)
var puckSize = 20
var horSpace = 25
var verSpace = 10
const binRanges = [];

function preload() {
  // soundFile = loadSound('sound2.mp3');   // was ight
  // soundFile = loadSound('sound3.mp3');   // undertail vibes
  soundFile = loadSound('sound4.mp3');      //mario vibes
}

function setup() {
  var myCanvas = createCanvas(2400, 600);
  myCanvas.parent('sketch-holder');

  noStroke();
  
  fft = new p5.FFT(0.4);
  amp = new p5.Amplitude();
  soundFile.amp(.3);

  for (var b=0; b<bars; b++){
    var loFreq = pow(1.3, b) * 30;
    var hiFreq = pow(1.3, b+1) * 30;
    binRanges.push({x: Math.round(loFreq), y: Math.round(hiFreq)})
  }
  console.log("the bin ranges are: ", binRanges)
  soundFile.pause()
  noLoop()
}

function draw() {
  var binResults = []

  background(0);
  fft.analyze(); 

  for (var i = 0; i<bars; i++){
    binResults.push(Math.round(fft.getEnergy(binRanges[i].x, binRanges[i].y)));
  }
  binResults = sortWithIndeces(binResults)

  for (var i = 0; i<bars; i++) {
    var ii = binResults.sortIndices[i]
    drawBar(bars,ii,binResults[i])
  }
}

function sortWithIndeces(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] > right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    var dec = 1
    dec = 1-j/(bars+2)

    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0]*dec;
  }
  return toSort;
}

function drawBar(bars,i,freqValue){
  var maxPucks = (height-verSpace)/(puckSize+verSpace)
  var pixleHeight = freqValue/255*(height-verSpace)
  var puckNum = Math.floor(pixleHeight/(puckSize+verSpace))
  var r = 0
  var g = 0
  var b = 0
  var on_off = 0 

  for (var j=0; j<maxPucks; j++){
    var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
    var y1 = height-(j+1)*(puckSize+verSpace)
    var x2 = (width-horSpace) / bars-horSpace
    var y2 = puckSize

    if (j<12){
      r = 0
      g = 255
    }
    else if (j<15){
      r = 255
      g = 255
    }
    else{
      r = 255
      g = 0
    }
    if (j<puckNum){
      drawingContext.shadowBlur = 10
      drawingContext.shadowColor = color(r,g,b) 
      on_off = 255
    }else{
      drawingContext.shadowBlur = 0
      on_off = 25
    }
    fill(r,g,b,on_off);

    rect(x1,y1,x2,y2);
  }

  hats = hatCalcs(puckNum, hats, i)
  var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
  var y1 = height-(int(hats[i])+1)*(puckSize+verSpace)
  var x2 = (width-horSpace) / bars-horSpace
  var y2 = puckSize
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(255);
  fill(255);

  rect(x1,y1,x2,y2);
  rect(x1,y1,x2,y2);
}

function hatCalcs(puckNum, oldHat, i){
  if (oldHat[i] > puckNum){
    if (oldHat.wait[i] == 0){
      oldHat[i] = oldHat[i]-.2
      return oldHat
    }
    else{
      oldHat.wait[i] -= 1
      return oldHat
    }
  }
  oldHat.wait[i] = 12
  oldHat[i] = puckNum
  return oldHat
}

function mouseClicked(){
  if (soundFile.isPlaying()){
    soundFile.pause()
    noLoop()
  } else {
    soundFile.play()
    loop()
  }
}