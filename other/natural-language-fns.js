import natural from 'natural';
import readline from "readline";
import { extract, words, numbers, emojis, tags, usernames, email } from 'words-n-numbers'
import * as strtok3 from 'strtok3';
import * as Token from 'token-types';


const rrr = async(str) => {
    let buffer = Buffer.from(str);
    const tokenizer = await strtok3.fromBuffer(buffer);
    const result = await tokenizer.readToken(new Token.StringType(4, 'utf8'));
    return result;
};
const g = async(str) => {
    let y = await rrr(str);
    console.log(y);
};
const tokenizer = (str) => {
  const tokenizer = new natural.WordTokenizer();

  console.log(tokenizer.tokenize(str));
  return tokenizer.tokenize(str);
};
  
const stem = str => {
console.log(natural.PorterStemmer.stem(str)); // stem a single word
};