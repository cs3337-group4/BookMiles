<?php
//currently not needed
class Book{

    //db connection
    private $connection;

    //information
    public $book_id;
    public $user_id;
    public $isbn;
    public $title;
    public $description;
    public $page_count;
    public $current_page;
    public $due_date;
    public $start_date;
    
    public function __construct($book_id){
        $db = new BossDB();
        $this->connection = $db->connection;

        if(!$connection){
            die("Could not connect to the database.");
        }
    }

}