var soundFile;
var fft;

var description = 'loading';
var p;
var bars = 16;
var hats = new Array(bars)
var puckSize = 15
var horSpace = 25
var verSpace = 10

function preload() {
  // soundFile = loadSound('sin40.wav');
  // soundFile = loadSound('sin45.wav');
  // soundFile = loadSound('sweep.wav');
  // soundFile = loadSound('sweep1.wav');
  // soundFile = loadSound('chicken.mp3');
  // soundFile = loadSound('dub.mp3');
  soundFile = loadSound('14 band.mp3');
  soundFile.amp(.5);
}

function setup() {
  createCanvas(2400, 1100);
  fill(255, 255, 255);
  noStroke();
  textAlign(CENTER);
  fft = new p5.FFT(0.8);

  p = createP(description);
  var p2 = createP(
    'Description: Using getEnergy(low, high) to measure amplitude within a range of frequencies.'
  );
}

function draw() {
  background(0);
  updateDescription();
  fft.analyze(); // analyze before calling fft.getEnergy()


  for (var i = 0; i < bars; i++) {
    noStroke();
    // Each bar has a unique frequency range
    var loFreq = pow(1.5, i) * 30;
    var hiFreq = pow(1.5, i+1) * 30;
    var freqValue = fft.getEnergy(loFreq, hiFreq); //TO DO


    var puckHigh = drawBar(bars,i,freqValue)
    hats[i] = hatCalcs(puckHigh, hats[i])
    var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
    var y1 = height-(int(hats[i])+1)*(puckSize+verSpace)
    var x2 = (width-horSpace) / bars-horSpace
    var y2 = puckSize
    fill(255);
    rect(x1,y1,x2,y2);



    fill(255);
    text(
      loFreq.toFixed(0) + ' Hz - ' + hiFreq.toFixed(0) + ' Hz',
      (i + 1) * width / bars - width / bars / 2,
      30
    )
  }
}

function drawBar(bars,i,freqValue){
  var maxPucks = (height-verSpace)/(puckSize+verSpace)
  var pixleHeight = freqValue/255*(height-verSpace)
  var puckNum = Math.floor(pixleHeight/(puckSize+verSpace))

  for (var j=0; j<puckNum; j++){
    var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
    var y1 = height-(j+1)*(puckSize+verSpace)
    var x2 = (width-horSpace) / bars-horSpace
    var y2 = puckSize
    if (j>maxPucks*.92){
      fill(255,0,0);
    }
    else{
      fill((i * 30) % 100 + 50, 195, (i * 25 + 50) % 255);
    }

    rect(x1,y1,x2,y2);
  }
  return puckNum
}

function hatCalcs(puckNum, oldHat){
  if (oldHat > puckNum){
    return oldHat-.2
  }
  return puckNum

}

function keyPressed() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.loop();
  }
}

// Change description text if the song is loading, playing or paused
function updateDescription() {
  if (!soundFile.isPlaying()) {
    description = 'Paused...';
    p.html(description);
  } else if (soundFile.isPlaying()) {
    description = 'Playing!';
    p.html(description);
  } else {
    for (var i = 0; i < frameCount % 3; i++) {
      // add periods to loading to create a fun loading bar effect
      if (frameCount % 4 === 0) {
        description += '.';
      }
      if (frameCount % 25 === 0) {
        description = 'loading';
      }
    }
    p.html(description);
  }
}
