<?php

class BookManager{

    //db connection
    private $connection;

    public $book_table_name;

    //information
    public function __construct(){
        //db table name
        $this->book_table_name = "books";

        //start db connection
        $db = new BossDB();
        $this->connection = $db->connection;

        if(!$this->connection){
            die("Could not connect to the database.");
        }

        //if table doesn't exist then create it
        $result = $this->connection->query("SHOW TABLES LIKE '" . $this->book_table_name ."'");
        if ($result->num_rows == 0) {
            $this->create_book_database();
            //return a new BookManager, now with the db created
            return new self();
        }
    }

    //create the books database 
    private function create_book_database(){

        $sql_args = "
        book_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT(6) NOT NULL,
        isbn VARCHAR(15) NOT NULL,
        title tinytext NOT NULL,
        description text NOT NULL,
        page_count int NOT NULL,
        current_page int NOT NULL,
        due_date tinytext NOT NULL,
        start_date tinytext NOT NULL
        ";
        $sql = "CREATE TABLE " . $this->book_table_name . " (" . $sql_args . ")";

        $result = $this->connection->query($sql);
        if ($result === true) {
            return true;
        } 
        else{
            die("Connection failed: " . $this->connection->connect_error . " " . $sql);
            return false;
        }

        return true;
    }

    //retreate a specific book
    //requires an associative array with key as the index name and 
    public function get_book($book_id){
    }

    public function get_user_book_by_isbn($user_id, $isbn){
        $sql = "SELECT * FROM $this->book_table_name WHERE user_id='$user_id' AND isbn = '$isbn'";
        $result = $this->connection->query($sql);

        $book = mysqli_fetch_array($result, MYSQLI_ASSOC);

        if(!$book) return false;

        return $book;
    }

    public function get_books($user_id){
        $sql = "SELECT * FROM $this->book_table_name WHERE user_id = '$user_id'";
        $result = $this->connection->query($sql);

        $books = mysqli_fetch_all($result, MYSQLI_ASSOC);

        if(!$books) return false;

        return $books;
    }

    //$new_book = book object
    public function update_book($book_id, $new_book){
    }

    public function delete_book($book_id){
    }

    //$book is a book object
    public function add_book($book){
    }

    public function add_book_user($user_id, $isbn, $due_date){

        //check if the book exists
        if($this->get_user_book_by_isbn($user_id, $isbn)){
            return array('duplicate' => "this book already exists as one of your readings.");
        }

        $gbook_data = $this->gbooks_get_book($isbn);

        if(empty($gbook_data)){
            return false;
        }

        //start putting data into sections, refer to gbooks api
        // $book_id = '';
        // $user_id = $user_id;
        // $isbn = $isbn;
        $title = $gbook_data['volumeInfo']['title'];
        $description = $gbook_data['volumeInfo']['description'];
        $page_count = $gbook_data['volumeInfo']['pageCount'];
        //$current_page = '0';
        $due_date = $due_date;
        //set date
        $date_lib = new DateTime();
        $start_date = date('Y-m-d h:m:s', $date_lib->getTimestamp());

        $user_book = array(
            'book_id' => "",
            'user_id' => $user_id,
            'isbn' => $isbn,
            'title' => $title,
            'description' =>$description,
            'page_count' => $page_count,
            'current_page' => '0',
            'due_date' => $due_date,
            'start_date' => $start_date
        );

        $result = $this->insert_book_db($user_book);

        if(!$result){
            return false;
        }
        
        return true;
    }

    public function retrieve_user_books(){
    }

    //get info from google books, return as an associative array
    private function gbooks_get_book($isbn){

        $json = file_get_contents('https://www.googleapis.com/books/v1/volumes?q=isbn:' . $isbn);

        $gbooks_response = json_decode($json, true);

        if(empty($gbooks_response['items'])){
            echo "book not found at google books";
            return false;
        }
        $gbook = $gbooks_response['items'][0];
        return $gbook;
    }

    private function insert_book_db($book){

        $columns = implode(", ",array_keys($book));
        $escaped_values = array_map(array($this->connection, 'real_escape_string'), array_values($book));

        $sql = sprintf(
            'INSERT INTO ' . $this->book_table_name . ' (%s) VALUES ("%s")',
            $columns,
            implode('","',array_values($escaped_values))
        );

        $result = $this->connection->query($sql);
        if ($result === TRUE) {
            return true;
        }

        return false;
    }
}