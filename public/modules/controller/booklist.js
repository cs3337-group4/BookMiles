// class BookList takes care of storing books internally in module Controller
function BookList() {
  this.id = 0;
  this.books = [];
}

BookList.prototype.addBook = function(book) {
  if (book.isbn) {
    book.id = this.id;
    this.books.push(book);
    this.id++;
    return true;
  }
  return false;
}

BookList.prototype.parseBook = function(book) {
  var pbook = {
    title: book.title,
    isbn: book.industryIdentifiers[0].identifier,
    author: book.authors[0],
    publisher: book.publisher,
    date: book.publishedDate,
    pages: book.pageCount,
    days: book.days
  }
  //console.log(event);
  return pbook;
}

BookList.prototype.getBook = function(id) {
  for (var i in this.books) {
    if (this.books[i].id == id)
      return this.books[e];
  }
  return null;
}

BookList.prototype.deleteBook = function(id) {
  for (var i in this.books) {
    var book = this.books[i];
    if (book.id == id)
      this.pop(book);
  }
}
