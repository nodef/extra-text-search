// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms

//#region TYPES
/**
 * The associated scores for a token in the index.
 * @note The key "*" is the score across all documents.
 */
type TokenScores = Map<string, number>;


/**
 * Handle processing of each token in the specified content.
 * @param token token to process
 * @param score score of the token
 */
type ProcessTokenFunction = (token: string, score: number) => void;
//#endregion




//#region CONSTANTS
/** Separator for words in the content. */
const WORD_SEPARATOR = /[^A-Za-z0-9]+/;
//#endregion






//#region FUNCTIONS
/**
 * Process each token in the content and apply a callback function.
 * @param content content to process
 * @param callback function to call for each token, with associated score
 */
function forEachContentToken(content: string, callback: ProcessTokenFunction): void {
  const words = content.split(WORD_SEPARATOR).map(word => word.toLowerCase()).filter(word => word.length > 0);
  const score = Math.sqrt(1 / words.length);  // Normalize scores based on the number of words
  // Process each word, and its 3-gram versions.
  for (const word of words) {
    callback(word, score);
    // Process 3-grams of the word
    const score3 = (score / (word.length - 2)) * (3 / word.length);
    for (let i=0; i < word.length - 2; i++) {
      const token = word.slice(i, i + 3);
      callback(token, score3);
    }
  }
  // Process each word pair.
  const scorep = 4 * score;
  for (let i=0; i < words.length - 1; i++) {
    const token = words[i] + " " + words[i + 1];
    callback(token, scorep);
  }
}
//#endregion




//#region CLASSES
/**
 * ReferenceIndex is a simple index for storing document references and their associated tokens.
 * It allows adding documents, removing them, and matching content against the indexed tokens.
 * Matching returns a map of document references with their associated scores.
 */
export class ReferenceIndex {
  private index: Map<string, TokenScores>;


  /**
   * Create a new ReferenceIndex.
   * The index is a map where the key is the word and the value is an object containing
   * the count of occurrences and a map of document references with their scores.
   */
  constructor() {
    this.index = new Map<string, TokenScores>();
  }


  /**
   * Retrieve the index details for a token, or adds it if it doesn't exist.
   * @param token token to retrieve or add
   * @returns index details for the token
   */
  private getTokenOrAdd(token: string): TokenScores {
    if (this.index.has(token)) return this.index.get(token)!;
    const details: TokenScores = new Map<string, number>([["*", 0]]);
    this.index.set(token, details);
    return details;
  }


  /**
   * Add a token to the index with the given reference and score.
   * @param ref document reference
   * @param token token to add
   * @param score score of the token
   */
  private addToken(ref: string, token: string, score: number): void {
    const details = this.getTokenOrAdd(token);
    details.set("*", (details.get("*") || 0) + score);
    details.set(ref, (details.get(ref) || 0) + score);
  }


  /**
   * Add a document reference with its content to the index.
   * @param ref document reference
   * @param content content of the document
   * @param boost boost score for the tokens in the document
   */
  add(ref: string, content: string, boost: number=1): void {
    forEachContentToken(content, (token, score) => {
      this.addToken(ref, token, score * boost);
    });
  }


  /**
   * Remove a document reference from the index.
   * @param ref document reference to remove
   */
  remove(ref: string): void {
    for (const [token, details] of this.index) {
      if (!details.has(ref)) continue;
      const scored = details.get(ref)!;
      const scoret = details.get("*")! - scored;
      details.set("*", scoret);
      details.delete(ref);
      if (scoret === 0) this.index.delete(token);
    }
  }


  /**
   * Find all document references that match the given content.
   * @param content content to match against the index
   * @returns document references with their associated scores
   */
  match(content: string): Map<string, number> {
    const scores = new Map<string, number>();
    forEachContentToken(content, (token, _score) => {
      if (!this.index.has(token)) return; // Skip tokens not in the index
      const details = this.index.get(token)!;
      for (const [ref, scored] of details.entries()) // (scored * score) / details.get("*")!
        if (ref!=="*") scores.set(ref, (scores.get(ref) || 0) + scored);
    });
    return scores;
  }
}




// TODO RecordIndex
//#endregion
