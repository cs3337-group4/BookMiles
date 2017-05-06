<?php

class BossDB{

    public $connection;

    public function __construct(){
        $this->connection = mysqli_connect('localhost', 'root', '', "boss");
    }

    public function create_boss_database(){
        $servername = "localhost";
        $username = "root";
        $password = "";

        // Create connection
        $conn = new mysqli($servername, $username, $password);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 

        // Create database
        $sql = "CREATE DATABASE boss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        if ($conn->query($sql) === TRUE) {
            $conn->close();
            return true;
        }
        else {
            echo "Error creating database: " . $conn->error;
            return false;
        }

        $conn->close();
        return;
    }

}