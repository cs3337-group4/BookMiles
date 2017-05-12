function getBookInfo(isbn, callback) {
  $.ajax({
    dataType: "json",
    url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn,
    async: false
  }).done(function(data) {
    callback(data.items[0]);
  });
}

function BookManager(storage) {
  this.list = storage.getItem("BookList");
  storage.setItem("BookList", list);
}