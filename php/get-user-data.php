<?php

include_once('functions.php');

$book_manager = new BookManager();

$user_id = 1;

// if(empty($user_id)){
//      die("0");  
// }

$books = $book_manager->get_books($user_id);

$data['books'] = $books;

$preference_manager = new PreferenceManager($user_id);

$user_preferences = $preference_manager->get_user_preferences();

$data['preferences'] = $user_preferences;

$json = json_encode($data, JSON_PRETTY_PRINT); 

echo $json;

?>