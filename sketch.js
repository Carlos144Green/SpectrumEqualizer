var soundFile;
var fft;

var description = 'loading';
var p;
var bars = 16;
var hats = new Array(bars)
hats.wait = new Array(bars)
var puckSize = 15
var horSpace = 25
var verSpace = 10
var particles = []

const binRanges = [];
function preload() {
  // soundFile = loadSound('sound2.mp3');   // was ight
//   soundFile = loadSound('sound3.mp3');   // undertail vibes
  soundFile = loadSound('14 band.mp3');      //mario vibes

  soundFile.amp(.3);
}

function setup() {
  createCanvas(2400, 600);
  fill(255, 255, 255);
  noStroke();
  textAlign(CENTER);
  fft = new p5.FFT(0.4);
  amp = new p5.Amplitude();

  p = createP(description);
  var p2 = createP(
    'Description: Using getEnergy(low, high) to measure amplitude within a range of frequencies.'
  );

  for (var b=0; b<bars; b++){
    var loFreq = pow(1.3, b) * 30;
    var hiFreq = pow(1.3, b+1) * 30;
    binRanges.push({x: Math.round(loFreq), y: Math.round(hiFreq)})
  }
  console.log("the bin ranges are: ", binRanges)
  soundFile.pause()
  noLoop()
}

class Particle{
  constructor(){
    this.pos =  [random(width),height-verSpace-1]
    // this.pos = p5.Vector.random2D().mult(250)
    this.vel = 0
    this.acc = random(0.001,.005)

    this.w = random(3,6)
    }
  update(val){


    this.vel += this.acc
    this.pos[1] -= this.vel

    if (val>.15){
      this.vel += this.vel

    }

  }
  show() {
    noStroke()
    fill(255)
    drawingContext.shadowBlur = 0

    ellipse(this.pos[0], this.pos[1], this.w)
  }
  remove(){
    if (this.posx<-width/2|| this.pos.x>width/2||this.pos.y<-height||this.pos.y>height/2){
      return true
    }
    return false
  }
}


function draw() {
  var binResults = []

  background(0);
  updateDescription();
  fft.analyze(); // analyze before calling fft.getEnergy()

  for (var i = 0; i<bars; i++){
    binResults.push(Math.round(fft.getEnergy(binRanges[i].x, binRanges[i].y)));
  }
  binResults = sortWithIndeces(binResults)


  var p = new Particle()
  particles.push(p)

  for(var pNum=  particles.length -1; pNum>=0; pNum--){
    if (particles[pNum].remove() == true){
      particles.splice(pNum, 1)
    }
    else{
      particles[pNum].update(amp.getLevel())
      particles[pNum].show()
    }

    // if (amp.getLevel()>.12){
    //   particles[pNum].push()
    //
    // }
  }



  for (var i = 0; i<bars; i++) {
    var ii = binResults.sortIndices[i]
    drawBar(bars,ii,binResults[i])
  }

  // var backgroundBeat = fft
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




  for (var j=0; j<puckNum; j++){
    var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
    var y1 = height-(j+1)*(puckSize+verSpace)
    var x2 = (width-horSpace) / bars-horSpace
    var y2 = puckSize

    fill(j*255/maxPucks,255-j*255/maxPucks,i*20,175);
    drawingContext.shadowBlur = 10
    drawingContext.shadowColor = color(j*255/maxPucks,255-j*255/maxPucks,i*40)

    rect(x1,y1,x2,y2);
  }


  hats = hatCalcs(puckNum, hats, i)
  // console.log(hats)
  var x1 = (i + 1) * (width-horSpace) / bars - (width-horSpace) / bars +horSpace
  var y1 = height-(int(hats[i])+1)*(puckSize+verSpace)
  var x2 = (width-horSpace) / bars-horSpace
  var y2 = puckSize
  fill(255);

  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(255);
  rect(x1,y1,x2,y2);
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
