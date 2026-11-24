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

const TYPE_SPECS = {
h1:{font:['bold'], size:180, letterspacing: -9}, //bold weight, -3 letterspacing
h2: {font:['bold'],size:90, letterspacing: -4}, //bold weight, -3 letterspacing
h3: {font:['bold','regular'],size:60, letterspacing: -3}, //bold or reg weight, -3 letterspacing
h4: {font:['bold','regular'],size:30, letterspacing: -1}, //bold or reg weight, -1 letterspacing
h4a: {font:['regular'],size:30, letterspacing: -1}, //bold or reg weight, -1 letterspacing
h5:{font:'bold',size:18, letterspacing: 0}, //bold weight
h6: {font:'regular',size:12, letterspacing: 0}
}

function resolveTypeSpecs(h){
  const heading = TYPE_SPECS[h];
  const fonts = Array.isArray(heading.font) ? heading.font : [heading.font];
  return {
    font: fonts[Math.floor(Math.random()*fonts.length)],
    size: heading.size ,
    letterspacing: heading.letterspacing
  }
}

let loadedFonts = {};



/* QUOTESTUFF
All text should always be aligned to the bottom of a grid cell and left aligned to the edge of a grid cell EXCEPT FOR atriclecopy and quoteAttrib which are aligned to the TOP of row 13.

Quotes are randomly positioned horizontally but always fit within the margin unless they are h1. Quotes words are randomly assigned sizes h1 or h2 based on the quoteh1Percent variable. h1 words can be from the following list and take up two rows and may bleed off the edge of the page. "price","eternal", "vigilance", and "indifference". They MAY be split across two rows and should be split as follows if they are: "pr/ice", "et/ernal","vigi/lance","indiff/erence". The remaining pixels should wrap to display at the start of the page on the next line (so +2 rows).

Rows are divided into 4 sections, the first 3 sections are 4 rows each and contain the following text segments ["the price of", "eternal vigilance is", indifference]. The last section of 2 rows contains quoteAttribution and articleHeader/articleCopy
*/

const QUOTE_INFO = {
quoteSect1:{rows:[0,1,2,3],text:[["the price of"],["the",'price','of'],['the price', 'of']],sizes:['h2','h3']},
quoteSect2:{rows:[4,5,6,7],text:[["eternal vigilance is"],['eternal','vigilance','is'],['eternal','vigilance is'],['eter','nal','vigilance is'],['eter','nal','vigilance','is'],['eternal','vigi','lance','is']], sizes:['h1','h2','h3']},
quoteSect3:{rows:[8,9,10,11],text:[["indifference"],['indiff','erence'],['in','difference']],sizes:['h1','h2','h3']}
};
let quoteAttrib={rows:[12,13],text:["—Marshall McLuhan"],sizes:['h4a']}; //always h4 and in bottom 2 rows
let articleHeader="Article 12"; //always h5 and directly above articleCopy in bottom two rows
let articleCopy="No one shall be subjected to arbitrary or unlawful interference with his privacy, family, home or correspondence, nor to unlawful attacks on his honour and reputation."; //always h6 3 cols wide and in bottom two rows


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

function layoutTrackedText(str, row, col, size, config, sectionRows) {
  push();
  textSize(config.size);
  textFont(loadedFonts[config.font]);
  let currentX = grid[sectionRows[row]][col].cellBL[0];
  const glyphs = [];
  const chars = Array.from(str);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const charWidth = textWidth(char);
    const nextX = currentX + charWidth + config.letterspacing;

    if (size !== 'h1' && currentX + charWidth > canvasWidth - margin / 2) {
      pop();
      return null;
    }

    glyphs.push({char, x: currentX, row});
    if (size === 'h1' && currentX + charWidth > canvasWidth) {
      row += 2;
      if (row >= sectionRows.length) {
        pop();
        return null;
      }
      glyphs.push({char, x: currentX - canvasWidth, row});
      currentX = nextX - canvasWidth;
    } else if (size === 'h1' && nextX >= canvasWidth && i < chars.length - 1) {
      row += 2;
      if (row >= sectionRows.length) {
        pop();
        return null;
      }
      currentX = nextX - canvasWidth;
    } else {
      currentX = nextX;
    }
  }
  pop();

  return {config, glyphs, lastRow: row};
}

function drawTrackedText(layout, sectionRows, topAligned = false) {
  push();
  textSize(layout.config.size);
  textFont(loadedFonts[layout.config.font]);
  if (topAligned) textAlign(LEFT, TOP);
  for (const glyph of layout.glyphs) {
    const cell = grid[sectionRows[glyph.row]][0];
    text(glyph.char, glyph.x, topAligned ? cell.cellTL[1] : cell.cellBL[1]);
  }
  pop();
}

function planQuote(tokens, quoteInfo, tokenIndex = 0, printRow = 0) {
  if (tokenIndex === tokens.length) return [];

  const candidates = [];
  for (const size of quoteInfo.sizes) {
    const spec = TYPE_SPECS[size];
    const fonts = Array.isArray(spec.font) ? spec.font : [spec.font];
    for (const font of fonts) {
      const config = {font, size: spec.size, letterspacing: spec.letterspacing};
      for (let col = 0; col < cols; col++) {
        candidates.push({size, config, col});
      }
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const {size, config, col} of candidates) {
    const firstRow = printRow + (size === 'h1' ? 1 : 0);
    const remainingTokens = tokens.length - tokenIndex - 1;
    if (firstRow + remainingTokens >= quoteInfo.rows.length) continue;

    const layout = layoutTrackedText(
      tokens[tokenIndex], firstRow, col, size, config, quoteInfo.rows
    );
    if (!layout || layout.lastRow + remainingTokens >= quoteInfo.rows.length) continue;

    const rest = planQuote(tokens, quoteInfo, tokenIndex + 1, layout.lastRow + 1);
    if (rest) return [layout, ...rest];
  }
  return null;
}

function printQuote(quote){
  const quoteInfo = QUOTE_INFO[quote];
  const quoteVersion = quoteInfo.text[Math.floor(Math.random()*quoteInfo.text.length)];
  const layouts = planQuote(quoteVersion, quoteInfo);

  if (!layouts) {
    throw new Error(`Quote ${quote} cannot fit in its assigned rows`);
  }

  for (const layout of layouts) {
    drawTrackedText(layout, quoteInfo.rows);
  }
}

function printFooter(attribution, header, copy) {
  const attributionCol = Math.random() < 0.5 ? 0 : cols / 2;
  const articleCol = attributionCol === 0 ? cols / 2 : 0;
  const row = attribution.rows[0];
  const attributionText = attribution.text[Math.floor(Math.random() * attribution.text.length)];
  const attributionLayout = layoutTrackedText(
    attributionText, 0, attributionCol, 'h4a', resolveTypeSpecs('h4a'), attribution.rows
  );
  if (!attributionLayout) throw new Error('Quote attribution cannot fit in the footer');
  push();
  translate(0, -cellH * 0.15);
  drawTrackedText(attributionLayout, attribution.rows, true);
  pop();

  push();
  const articleStyle = resolveTypeSpecs('h5');
  textFont(loadedFonts[articleStyle.font]);
  textSize(articleStyle.size);
  textAlign(LEFT, TOP);
  const [x, y] = grid[row][articleCol].cellTL;
  text(header, x, y-(cellH*.1));

  const copyStyle = resolveTypeSpecs('h6');
  textFont(loadedFonts[copyStyle.font]);
  textSize(copyStyle.size);
  textLeading(copyStyle.size * 1.25);
  text(copy, x, y-(cellH*.1) + articleStyle.size * 1.25, 3 * cellW + 2 * gap);
  pop();
}

 // viewgrid test
 function viewGrid(){
  stroke('black');
  noFill();
  for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){

      rect(
        grid[i][j].cellTL[0],
        grid[i][j].cellTL[1],
        cellW,
        cellH
      )
    }
  }
}


function printRects(color){
  let totalCells = rows * cols;
  let minCov = .1;
  let maxCov = .8;
  let surfaceCovTarget = setSurfaceCovTarget();
  function setSurfaceCovTarget(){
    let currentTarget = 0;
    while(currentTarget<minCov | currentTarget > maxCov){
      currentTarget = Math.random()
    }
    console.log(`surfaceCovTarget: ${currentTarget}`);
  }
  let surfaceCov = calculateCovered(grid);
  console.log(`Total cells: ${totalCells}`);
  console.log(`surfaceCov`);
  console.log(surfaceCov);


  
}
function calculateCovered(targetGrid){
  let rows = targetGrid.length;
  let cols = targetGrid[0].length;
  let totalCells = rows*cols;
  let filledCells = 0;
  for(let i=0; i<rows;i++){
    for(let j=0; j<cols; j++){
      if(grid[i][j].filled){
        filledCells+=1;
      }
    }
  }

  return{cells: filledCells, percent: (filledCells/totalCells)}
}

function main() {
  grid=createGrid(rows,cols);
  fill('black');
  let quoteSects = ['quoteSect1','quoteSect2','quoteSect3'];
  for (let i=0; i<quoteSects.length; i++){
  
  printQuote(quoteSects[i]);
  printRects('pink');
  }

  printFooter(quoteAttrib, articleHeader, articleCopy);

  // //view grid to test
  viewGrid();

}
