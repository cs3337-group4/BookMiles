<?php

include_once('functions.php');

//start computation

//book manager
$book_manager = new BookManager();

//check and process post
if(!(empty($_POST['isbn']) || empty($_POST['due_date']))){
    $user_id = 1;
    $isbn = $_POST['isbn'];
    $due_date = $_POST['due_date'];

    $book_manager->add_book_user($user_id, $isbn, $due_date);
}

//currently only 1 user
$user_books = $book_manager->get_books(1);

//toISOString(); both dates need to be in this format

//render out book manager
include("templates/book-manager/book-manager-viewer.php");

?>