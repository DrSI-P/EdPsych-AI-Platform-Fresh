/**
 * This script fixes US spelling to UK spelling in the codebase
 * to ensure consistency with UK educational standards.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json'];
const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

// US to UK spelling mappings
const spellingMap = {
  // Common US to UK spelling differences
  'analyse': 'analyse',
  'analysed': 'analysed',
  'analysing': 'analysing',
  'behaviour': 'behaviour',
  'behavioural': 'behavioural',
  'centre': 'centre',
  'centred': 'centred',
  'colour': 'colour',
  'coloured': 'coloured',
  'customise': 'customise',
  'customised': 'customised',
  'customising': 'customising',
  'dialogue': 'dialogue',
  'enrolment': 'enrolment',
  'favour': 'favour',
  'favourite': 'favourite',
  'fibre': 'fibre',
  'fulfil': 'fulfil',
  'fulfilment': 'fulfilment',
  'grey': 'grey',
  'honour': 'honour',
  'labelled': 'labelled',
  'labelling': 'labelling',
  'licence': 'licence', // noun form
  'modelling': 'modelling',
  'modelled': 'modelled',
  'optimise': 'optimise',
  'optimised': 'optimised',
  'optimising': 'optimising',
  'organisation': 'organisation',
  'organise': 'organise',
  'organised': 'organised',
  'organising': 'organising',
  'practise': 'practise', // verb form
  'programme': 'programme', // except for computer programs
  'realise': 'realise',
  'realised': 'realised',
  'realising': 'realising',
  'recognise': 'recognise',
  'recognised': 'recognised',
  'recognising': 'recognising',
  'specialise': 'specialise',
  'specialised': 'specialised',
  'specialising': 'specialising',
  'standardise': 'standardise',
  'standardised': 'standardised',
  'standardising': 'standardising',
  'theatre': 'theatre',
  'travelled': 'travelled',
  'travelling': 'travelling',
  'traveller': 'traveller',
  'visualisation': 'visualisation',
  'visualise': 'visualise',
  'visualised': 'visualised',
  'visualising': 'visualising'
};

// Exceptions - words that should not be changed
const exceptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node',
  'color:', // CSS property
  'background-colour',
  'border-color',
  'programmatic',
  'programming',
  'programmer',
  'program(', // function calls
  'program.', // object properties
  'program:', // object keys
  'program=', // assignments
  'program ', // variable names
  'license(', // function calls for licensing
  'license.', // license object properties
  'license:', // license object keys
  'license=', // license assignments
  'license ', // license variable names
  'LICENSE'  // license file
];

// Find all files with the specified extensions
function findFiles(dir, extensions) {
  let results = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (stat.isFile() && extensions.includes(path.extname(filePath))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Check if a word is in an exception context
function isException(content, match, index) {
  for (const exception of exceptions) {
    // Check if the match is part of an exception
    if (exception.includes(match) && 
        content.substring(index - 10, index + match.length + 10).includes(exception)) {
      return true;
    }
  }
  return false;
}

// Process a file to fix US to UK spelling
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace US spellings with UK spellings
  for (const [us, uk] of Object.entries(spellingMap)) {
    // Create a regex that matches the word with word boundaries
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    
    // Find all matches
    let match;
    while ((match = regex.exec(content)) !== null) {
      // Check if this is an exception
      if (!isException(content, match[0], match.index)) {
        // Replace the match with the UK spelling, preserving case
        const replacement = match[0][0] === match[0][0].toUpperCase() 
          ? uk[0].toUpperCase() + uk.slice(1) 
          : uk;
        
        content = content.substring(0, match.index) + 
                 replacement + 
                 content.substring(match.index + match[0].length);
        
        updated = true;
        
        // Reset regex to continue from the new position
        regex.lastIndex = match.index + replacement.length;
      }
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Starting UK spelling fix...');
  
  // Find all relevant files
  const files = findFiles(rootDir, fileExtensions);
  console.log(`Found ${files.length} files to check.`);
  
  // Process each file
  let updatedCount = 0;
  for (const file of files) {
    const updated = processFile(file);
    if (updated) {
      updatedCount++;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`- Checked ${files.length} files`);
  console.log(`- Updated ${updatedCount} files`);
  
  if (updatedCount > 0) {
    console.log(`\nUK spelling fix completed successfully. Please run the TypeScript compiler to verify the changes.`);
  } else {
    console.log(`\nNo files needed updating.`);
  }
}

// Run the script
main();