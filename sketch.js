/* 
GENERAL
This page generates a poster image based on cookie text input. The cookie header is converted and mapped to the variables based on the DATAMAP below. Randomness can be used, but should be set with a seed based on a variable input so that the output for the same cookieheader input is ALWAYS the same. CountCycle variables set the maximum for the cycle before the input is divided and floored by the cycle number (so that the input range does not need to be known). Unique domains should be printed using the gray color in the background all the way down the page and should be clipped off the edges on both sides.


font: src: url('https://raw.githubusercontent.com/RandomMaerks/Overused-Grotesk/master/fonts/variable/OverusedGrotesk-VF.woff2')


DATAMAP
Color ⟶ stringUniCycle
Shape surface area ⟶ cookieCountCycle
Shape positioning ⟶ domainUniCycle
Text positioning ⟶ secureCountCycle
Text sizes ⟶ secureUniCycle
*/

/*
CONTROLS
GUI input sliders/textbox inputs should be added to the page allowing these to be experimented with in real time and refresh the canvas.
*/
let cookieCountCyle = 100;
let domainUniCycle=100;
let secureCountCycle=100;
let secureUniCycle=100;
let quoteh1Percent=.1;

let uniSum= null;
let grey50 = '#D9D9D9';
let accentColor = 'orange';
//accent color should be determined by dividing stringUniCycle by 360 (color wheel) and then flooring the result. Resulting color should be used at full saturation and brightness.

let canvasWidth = 764;
let canvasHeight = 1080;
let rows = 14;
let cols = 8;
let margin=60;
let gap = 8;
let grid = [];
let cellW = null;
let cellH = null;

let h1= {font:'bold', size:180, letterspacing: -9} //bold weight, -3 letterspacing

let h2 = {font:'bold',size:90, letterspacing: -4}; //bold weight, -3 letterspacing
let h3= {font:((arr) => {return arr[Math.floor(Math.random()*arr.length)]
})(['bold','regular']),size:60, letterspacing: -3}; //bold or reg weight, -3 letterspacing
let h4={font:((arr) => {return arr[Math.floor(Math.random()*arr.length)]
})(['bold','regular']),size:30, letterspacing: -1}; //bold or reg weight, -1 letterspacing
let h5={font:'bold',size:18, letterspacing: 0}; //bold weight
let h6={font:'regular',size:12, letterspacing: 0}; //bold weight
let loadedFonts = {};

let sizeMap = {
  'h1':h1,
  'h2':h2,
  'h3':h3,
  'h4':h4,
  'h5':h5,
  'h6':h6
};

function convertSize(size){
  return sizeMap[size];
}

/* QUOTESTUFF
All text should always be aligned to the bottom of a grid cell and left aligned to the edge of a grid cell EXCEPT FOR atriclecopy and quoteAttrib which are aligned to the TOP of row 13.

Quotes are randomly positioned horizontally but always fit within the margin unless they are h1. Quotes words are randomly assigned sizes h1 or h2 based on the quoteh1Percent variable. h1 words can be from the following list and take up two rows and may bleed off the edge of the page. "price","eternal", "vigilance", and "indifference". They MAY be split across two rows and should be split as follows if they are: "pr/ice", "et/ernal","vigi/lance","indiff/erence". The remaining pixels should wrap to display at the start of the page on the next line (so +2 rows).

Rows are divided into 4 sections, the first 3 sections are 4 rows each and contain the following text segments ["the price of", "eternal vigilance is", indifference]. The last section of 2 rows contains quoteAttribution and articleHeader/articleCopy
*/

let quoteSect1={rows:[0,1,2,3],text:[["the price of"],["the",'price','of'],['the price', 'of']],sizes:['h2','h3']};
let quoteSect2={rows:[4,5,6,7],text:[["eternal vigilance is"],['eternal','vigilance','is'],['eternal','vigilance is'],['eter','nal','vigilance is','eter','nal','vigilance','is'],['eternal','vigi','lance','is']], sizes:['h1','h2','h3']};
let quoteSect3={rows:[8,9,10,11],text:[["indifference"],['indiff','erence'],['in','difference'],['in','diff','erence']],sizes:['h1','h2','h3']};
let quoteAttrib={rows:[12,13],text:["—Marshall McLuhan"],sizes:['h4']}; //always h4 and in bottom 2 rows
let articleHeader="Article 12"; //always h5 and directly above articleCopy in bottom two rows
let articleCopy="No one shall be subjected to arbitrary or unlawful interference with his privacy, family, home or correspondence, nor to unlawful attacks on his honour and reputation."; //always h5 3 cols wide and in bottom two rows

/*SHAPES
Data defines the total surface area the shapes can cover between a min and a max cycled by the variable described above. Shapes can overlap each other and are randomly set to be gray or the accentColor. The positioning of shapes ALWAYS begins at the EDGE of the canvas and shape edges always align to cell edges (except for at the border of the canvas where they should always bleed off the page across the margin).

*/

/*
//GET DATA
//take json cookie input, extract relevant info, and output as a text string for printing

function parseCookies(json){
	//uniqueDomains = extract unique domains, push to array
	//
	
}
*/


function preload() {
  let fontFiles = [
    'OverusedGrotesk-Black.otf',
    'OverusedGrotesk-Bold.otf',
    'OverusedGrotesk-Book.otf',
    'OverusedGrotesk-ExtraBold.otf',
    'OverusedGrotesk-ExtraLight.otf',
    'OverusedGrotesk-Light.otf',
    'OverusedGrotesk-Medium.otf',
    'OverusedGrotesk-Regular.otf',
    'OverusedGrotesk-SemiBold.otf'
  ];
  for (let file of fontFiles) {
    let name = file.replace('OverusedGrotesk-', '').replace('.otf', '').toLowerCase();
    loadedFonts[name] = loadFont(`fonts/${file}`);
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textFont('Overused Grotesk');

}

function draw() {
  background(220);
  main();
  noLoop()
}


function createGrid (r,c){
  let grid=[];

  let gridWidth = canvasWidth-margin;
  let gridHeight = canvasHeight-margin;
  cellW = (gridWidth-((cols-1)*gap))/cols;
  cellH = (gridHeight-((rows-1)*gap))/rows;

  for(let i = 0; i<r; ++i){
    let currentRow = [];
    for (let j = 0; j<c; ++j){
      currentRow[j]={
        filled: false,
        text: null,
        cellTL: [((margin/2)+(j*cellW)+(j*gap)),((margin/2)+(i*cellH)+(i*gap))],
        cellBL: [((margin/2)+(j*cellW)+(j*gap)),((margin/2)+(i*cellH)+(i*gap))+cellH],
        cellTR: [((margin/2)+(j*cellW)+(j*gap))+cellW,((margin/2)+(i*cellH)+(i*gap))],
        cellBR: [((margin/2)+(j*cellW)+(j*gap))+cellW,((margin/2)+(i*cellH)+(i*gap))+cellH]

      }
    }
    grid.push(currentRow);
  }
  console.log(grid);
  return grid;
}

function drawTrackedText(str, row, col, config) {
  push();
  textSize(config.size);
  textFont(loadedFonts[config.font]);
  let currentX = grid[row][col].cellBL[0];
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    text(char, currentX, grid[row][col].cellBL[1]);
    currentX += textWidth(char) + config.letterspacing;
  }
  console.log(textWidth(str));
  pop();


}

function printQuote(quote){
  //select # rows to print over
  let rowSpan = Math.floor(Math.random()*3);
  //depending on quote, run drawTrackedText on for randomly selected quote tokens and appropriate random cells

  // get quote version
  let quoteVersion = quote.text[Math.floor(Math.random()*quote.text.length)];
  console.log(`'quoteVersion: ${quoteVersion}'`)

  let printRow =0;
  
  for(let i=0;i<quoteVersion.length;i++){
    push()
    let size = quote.sizes[Math.floor(Math.random()*quote.sizes.length)];

    size=convertSize(size);

    textSize(size.size);
    let textW = textWidth(quoteVersion[i]);

    function chooseCol() {return Math.floor(Math.random()*cols)};

    let startCol = chooseCol();

    while (textW> ((cols-startCol)*cellW+(cols-startCol-1)*gap)){
      startCol = chooseCol();
    }

    console.log(`quoteVersion:${quoteVersion} i:${i}`)
    console.log(`quote.rows[printRow]:${quote.rows[printRow]}`);

    drawTrackedText(quoteVersion[i],quote.rows[printRow], startCol, size);

    if (size===h1){
      printRow+=2;
    } else{printRow+=1}
    pop()
  }


}


function main() {
  grid=createGrid(rows,cols);
  fill('black');
  printQuote(quoteSect1);

  
  /* Grid cells test
  fill('black');
  for(let i = 0; i<rows; ++i){
    for(let j=0; j<cols; ++j){

    getCellPos()
      rect(
        ((margin/2)+(j*cellW)+(j*gap)),
        ((margin/2)+(i*cellH)+(i*gap)),
        cellW,
        cellH
      )
    }
  }
  */
}
