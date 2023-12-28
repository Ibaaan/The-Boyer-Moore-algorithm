function createBadMatchTable(pattern) {
    const table = {};
    const patternLength = pattern.length;
    
    for (let i = 0; i < patternLength - 1; i++) {
        table[pattern[i]] = patternLength - i - 1;
    }
    
    table['*'] = patternLength;
    
    return table;
}

function createGoodSuffixTable(pattern) {
    const patternLength = pattern.length;
    const table = new Array(patternLength).fill(0);
    const z = createZArray(pattern + pattern).slice(0, patternLength);
    
    for (let p = 1, c = 0; p < patternLength; p++) {
        if (p + z[p] === patternLength) {
            for (; c <= p; c++) {
                if (table[c] === 0) {
                    table[c] = p;
                }
            }
        }
    }
    
    return table;
}

function createZArray(str) {
    const n = str.length;
    const z = new Array(n).fill(0);
    
    for (let i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) {
            z[i] = Math.min(r - i + 1, z[i - l]);
        }
        
        while (i + z[i] < n && str[z[i]] === str[i + z[i]]) {
            z[i]++;
        }
        
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    
    return z;
}

function boyerMoore(text, pattern) {
    const badMatchTable = createBadMatchTable(pattern);
    const goodSuffixTable = createGoodSuffixTable(pattern);
    const patternLength = pattern.length;
    const textLength = text.length;
    let offsets = [];
    let i = 0;
    
    while (i <= textLength - patternLength) {
        let j = patternLength - 1;
        
        while (j >= 0 && pattern[j] === text[i + j]) {
            j--;
        }
        
        if (j < 0) {
            offsets.push(i);
            i += goodSuffixTable[0]; 
        } else {
            const charShift = badMatchTable[text[i + j]] || badMatchTable['*'];
            let badShift = Math.max(1, charShift - (patternLength - 1 - j));
            let goodShift = j + 1 < patternLength ? goodSuffixTable[j + 1] : 1;
            i += Math.max(badShift, goodShift);
        }
    }
    
    return offsets;
}

let fs = require('fs');
let str = fs.readFileSync("input.txt").toString().split(" ");
const text = str[0];
const pattern = str[1];
const matchOffsets = boyerMoore(text, pattern);

if(indexes.length)
    fs.writeFileSync("output.txt", matchOffsets.join(' '));
else
    fs.writeFileSync("output.txt", "-1");