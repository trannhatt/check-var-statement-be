class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.transactions = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Thêm từ vào cây Trie
  insert(word, transaction) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.transactions.push(transaction);
  }

  // Tìm kiếm trong cây Trie
  search(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return []; // Không tìm thấy từ khóa
      }
      node = node.children[char];
    }
    return this._collectTransactions(node);
  }

  // Thu thập các giao dịch từ cây Trie
  _collectTransactions(node) {
    let result = [];
    if (node.isEndOfWord) {
      result.push(...node.transactions);
    }
    for (let child in node.children) {
      result.push(...this._collectTransactions(node.children[child]));
    }
    return result;
  }
}

module.exports = Trie;
