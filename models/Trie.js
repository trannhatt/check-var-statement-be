// /config/trie.js

// Cấu trúc của một Node trong Trie
class TrieNode {
    constructor() {
      this.children = {};  // Lưu trữ các node con
      this.isEndOfWord = false;  // Đánh dấu kết thúc của từ
    }
  }
  
  // Cấu trúc Trie
  class Trie {
    constructor() {
      this.root = new TrieNode();  // Khởi tạo Trie với root là một TrieNode
    }
  
    // Thêm từ vào Trie
    addWord(word) {
      let currentNode = this.root;
  
      for (let char of word) {
        if (!currentNode.children[char]) {
          currentNode.children[char] = new TrieNode();
        }
        currentNode = currentNode.children[char];
      }
  
      currentNode.isEndOfWord = true;
    }
  
    // Tìm kiếm một từ trong Trie
    search(word) {
      let currentNode = this.root;
  
      for (let char of word) {
        if (!currentNode.children[char]) {
          return null;  // Nếu không tìm thấy từ, trả về null
        }
        currentNode = currentNode.children[char];
      }
  
      return currentNode.isEndOfWord ? word : null;  // Nếu là từ kết thúc, trả về từ đó
    }
  
    // Tìm kiếm tất cả các từ bắt đầu bằng prefix
    startsWith(prefix) {
      let currentNode = this.root;
  
      for (let char of prefix) {
        if (!currentNode.children[char]) {
          return [];  // Nếu không có bất kỳ từ nào bắt đầu bằng prefix
        }
        currentNode = currentNode.children[char];
      }
  
      return this._findAllWords(currentNode, prefix);  // Trả về tất cả các từ từ node này
    }
  
    // Tìm tất cả các từ con từ một node
    _findAllWords(node, prefix) {
      let words = [];
  
      if (node.isEndOfWord) {
        words.push(prefix);
      }
  
      for (let char in node.children) {
        words = words.concat(this._findAllWords(node.children[char], prefix + char));
      }
  
      return words;
    }
  }
  
  module.exports = Trie;
  