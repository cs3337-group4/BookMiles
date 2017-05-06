<?php
//currently not needed
class Preference{

    //information
    public $user_sid; //
    public $minimum_daily_hours; //minimum to read per day
    public $max_daily_hours; //max hours the user is willing to do per day
    public $days_off; //days of the week the user is not willing to read
    
    public function __construct(){
        $db = new BossDB();
        $this->connection = $db->connection;

        if(!$connection){
            die("Could not connect to the database.");
        }
    }
}