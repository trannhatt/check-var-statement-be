class TrieNode {
  constructor() {
    this.children = {};
    this.transactions = [];
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.documentCount = 0;
    this.wordDocumentFrequency = {};
  }

  // Chuẩn hóa và insert cụm từ
  insert(detail, transaction) {
    // Tăng số lượng document
    this.documentCount++;

    // Chuẩn hóa: loại bỏ khoảng trắng thừa, chuyển chữ thường
    const normalizedDetail = detail.toLowerCase().trim().replace(/\s+/g, " ");

    // Theo dõi từng từ xuất hiện
    const uniqueWords = new Set(normalizedDetail.split(" "));
    uniqueWords.forEach((word) => {
      this.wordDocumentFrequency[word] =
        (this.wordDocumentFrequency[word] || 0) + 1;
    });

    // Tìm các cụm từ liền kề
    const words = normalizedDetail.split(" ");

    // Thêm các cụm từ liền kề
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const phrase = words.slice(i, j).join(" ");
        this._insertPhrase(phrase, transaction);
      }
    }
  }
  // Insert một cụm từ cụ thể
  _insertPhrase(phrase, transaction) {
    let node = this.root;

    // Duyệt từng từ của cụm từ
    const words = phrase.split(" ");

    for (let word of words) {
      let currentNode = node;
      for (let char of word) {
        if (!currentNode.children[char]) {
          currentNode.children[char] = new TrieNode();
        }
        currentNode = currentNode.children[char];
      }

      // Đánh dấu kết thúc từ
      currentNode.isEndOfWord = true;

      // Thêm transaction nếu chưa tồn tại
      if (
        !currentNode.transactions.some(
          (t) => JSON.stringify(t) === JSON.stringify(transaction)
        )
      ) {
        currentNode.transactions.push(transaction);
      }
    }
  }

  search(searchPhrase) {
    // Chuẩn hóa từ khóa
    const normalizedSearch = searchPhrase
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const words = normalizedSearch.split(" ");

    // Tìm kiếm transactions chứa toàn bộ từ khóa
    const matchedTransactions = [];

    const calculateRelevanceScore = (transaction) => {
      const transactionDetail = transaction.detail.toLowerCase();

      // Kiểm tra xem tất cả các từ có xuất hiện theo thứ tự không
      let lastIndex = -1;
      const wordScores = words.map((word) => {
        const wordIndex = transactionDetail.indexOf(word, lastIndex + 1);

        if (wordIndex > lastIndex) {
          lastIndex = wordIndex;
          // Tính điểm dựa trên khoảng cách và tần suất
          const termFrequency = (
            transactionDetail.match(new RegExp(word, "g")) || []
          ).length;
          const idf = Math.log(
            this.documentCount / (this.wordDocumentFrequency[word] || 1)
          );

          return {
            found: true,
            score: termFrequency * idf,
            index: wordIndex,
          };
        }

        return { found: false };
      });

      // Kiểm tra xem có tìm thấy tất cả các từ không
      const allWordsFound = wordScores.every((w) => w.found);

      // Nếu tìm thấy, tính tổng điểm
      if (allWordsFound) {
        const totalScore = wordScores.reduce((sum, w) => sum + w.score, 0);

        // Bonus điểm nếu các từ gần nhau
        const distanceScore =
          words.length > 1
            ? 1 /
              (wordScores[wordScores.length - 1].index -
                wordScores[0].index +
                1)
            : 1;

        return totalScore * distanceScore;
      }

      return -1;
    };

    // Tìm kiếm trên toàn bộ transactions
    const scoredTransactions = this.getAllTransactions()
      .map((transaction) => ({
        transaction,
        score: calculateRelevanceScore(transaction),
      }))
      .filter((item) => item.score > 0);

    // Sắp xếp theo điểm giảm dần
    return scoredTransactions
      .sort((a, b) => b.score - a.score)
      .map((item) => item.transaction);
  }
  getAllTransactions() {
    const allTransactions = new Set();

    const traverse = (node) => {
      if (node.isEndOfWord) {
        node.transactions.forEach((transaction) => {
          allTransactions.add(transaction);
        });
      }

      for (let char in node.children) {
        traverse(node.children[char]);
      }
    };

    traverse(this.root);
    return Array.from(allTransactions);
  }
  _searchWord(word) {
    const matchedTransactions = [];

    const searchSubstring = (node, currentIndex, targetWord) => {
      // Nếu đã tìm được toàn bộ từ
      if (currentIndex === targetWord.length) {
        if (node.isEndOfWord) {
          matchedTransactions.push(...node.transactions);
        }
        return;
      }

      // Duyệt qua từng ký tự của nút hiện tại
      for (let char in node.children) {
        if (char === targetWord[currentIndex]) {
          // Tiếp tục tìm kiếm với nút con
          searchSubstring(node.children[char], currentIndex + 1, targetWord);
        }
      }
    };

    // Bắt đầu tìm kiếm từ mỗi nút gốc
    const traverse = (node, depth) => {
      // Nếu tìm thấy từ trong chuỗi
      searchSubstring(node, 0, word);

      // Tiếp tục duyệt các nút con
      for (let char in node.children) {
        traverse(node.children[char], depth + 1);
      }
    };

    // Bắt đầu tìm kiếm từ nút gốc
    traverse(this.root, 0);

    return matchedTransactions;
  }

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
  getAllData() {
    const uniqueTransactions = new Set();

    const traverse = (node) => {
      if (node.isEndOfWord) {
        node.transactions.forEach((transaction) => {
          // Tạo key duy nhất để loại bỏ trùng lặp
          const key = `${transaction.trans_no}_${transaction.date_time}`;
          uniqueTransactions.add(key);
        });
      }

      for (let char in node.children) {
        traverse(node.children[char]);
      }
    };

    // Start traversal from root
    traverse(this.root);

    // Convert Set back to array of transaction objects
    const transactions = [];
    const visitedKeys = new Set();

    this.getAllTransactions().forEach((transaction) => {
      const key = `${transaction.trans_no}_${transaction.date_time}`;
      if (!visitedKeys.has(key)) {
        transactions.push(transaction);
        visitedKeys.add(key);
      }
    });

    // Sắp xếp theo trans_no
    return transactions.sort(
      (a, b) => parseInt(a.trans_no) - parseInt(b.trans_no)
    );
  }
}

module.exports = Trie;
