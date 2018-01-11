const fs = require('fs')

let trie = {}
let tempWords = {};

function read(path) {
  return new Promise((resolve,reject)=>{
    fs.readFile(path,'utf8',function (err,data) {
      if(err){
        reject(err)
      } else {
        resolve(data);
      }
    })
  })
};

async function getData(){
  try{
    return await Promise.all([ read('./text.txt') ]);
  }catch (e){
    console.log(e);
  }
}

const start = async function(){
  let str = await getData();
  str = str.toString();
  str = str.replace(/[^\u4e00-\u9fa5]/g,'@');
  str = str.replace(/@+/g,' ')
  split(str);
}

start();

function split(str){
  str = str.split(' ');
  for(let words of [ ...str ]) {
    if([...words].length <= 1){
      continue;
    }
    if([...words].length === 2){
      wordsToTire(words);
    }else{
      for(let j = 0; j < [ ...words ].length - 2; j++){
        wordsToTire(words.substr(j,4));
      }
    }
  }
  trieToWords();
  wordsToArrAndRank()
}

function wordsToTire(str){
  let words = [ ...str ];
  let stopWords = ["和","与","你","我","两","这","把","那","个","他","您","它","们","是","的","一","了","在"]
  if(stopWords.includes(words[0])){
    return false;
  }
  let temp = trie;
  for(let elem of [ ...words ]){
    temp = saveToTire(temp, elem); 
  }  
}

function saveToTire(obj, chart){
  obj[chart] = obj[chart] || {len:0}
  obj[chart].len += 1;
  return obj[chart];
}

function trieToWords(){
  let words=[];
  conmbin(trie);
}

function wordsToArrAndRank(){
  let wordsArr=[];
  let keys = [];
  for(let i in tempWords){
    keys.push(i);
  }
  keys = '|' + keys.join('|') + '|';
  for(let i in tempWords){
    if(!RegExp('[^|]+'+ i + '\\|').test(keys) && !RegExp('\\|+'+ i + '[^|]+').test(keys)){
      wordsArr.push([i, tempWords[i]])
    }
  }
  wordsArr.sort(function(a,b){
    return a[1] - b[1]
  })
  console.log('The Key list is', wordsArr)
}

function conmbin(obj, str = ''){
  let retObj = [];
  let haveSone =false;
  let pow = obj.len;
  for(i in obj){
    if(obj[i].len <= 20){
      continue;
    }
    if(i !== 'len'){
      conmbin(obj[i], str + i);
    }
  }

  if(!haveSone && [...str].length >= 2){
    tempWords[str] = tempWords[str] || 0
    tempWords[str] = Math.max(tempWords[str], pow)
  }
}