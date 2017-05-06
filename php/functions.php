<?php

//db connection
include("mysql/db.php");

//render out the page
//include("templates/main-viewer/main-viewer.php");

//create the out

$db = new BossDB();

//check if connection exists
if(!$db->connection){
    $result = $db->create_boss_database();

    if($result){
        echo "database creation success!";
        header("Refresh:0");
    }
    else{
        die("database creation failed! please contact support.");
    }
}

//include core
include_once("includes/book-class.php");
include_once("includes/book-manager.php");
include_once("includes/preference-class.php");
include_once("includes/preference-manager.php");