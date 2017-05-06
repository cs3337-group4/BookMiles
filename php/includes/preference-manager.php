<?php

class PreferenceManager{
    
    private $connection;
    
    public $preference_table_name;
    //information

    private $user_id;

    public function __construct($user_id){
        //set user id
        $this->user_id = $user_id;

        //db table name
        $this->preference_table_name = "preferences";
        
        //start db connection
        $db = new BossDB();
        $this->connection = $db->connection;

        if(!$this->connection){
            die("Could not connect to the database.");
        }
        
        //if table doesn't exist then create it
        $result = $this->connection->query("SHOW TABLES LIKE '" . $this->preference_table_name ."'");
        if ($result->num_rows == 0) {
            $this->create_preference_database();
            //return a new preferenceManager, now with the db created
            return new self();
        }   

        //check if the user has preferences, if not add new
        if(!$this->get_user_preferences($user_id)){
            $results = $this->new_user_preferences($user_id);
            if(!$results){
                die("could not create new user preferences");
            }
        }
    }

    //create the preferences database 
    private function create_preference_database(){

        $sql_args = "
        preference_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT(6) NOT NULL,
        min_daily_hours DECIMAL(5, 2) NOT NULL,
        max_daily_hours DECIMAL(5, 2) NOT NULL,
        days_off text NOT NULL
        ";
        $sql = "CREATE TABLE " . $this->preference_table_name . " (" . $sql_args . ")";

        $result = $this->connection->query($sql);
        if ($result === true) {
            return true;
        } 
        else{
            die("Connection failed: " . $this->connection->connect_error . ". Query: " . $sql);
            return false;
        }

        return true;
    }

    //retreave a specific preference
    //requires an associative array with key as the index name and 
    public function get_preference($preference_id){
    }

    public function get_user_preferences(){
        $sql = "SELECT * FROM $this->preference_table_name WHERE user_id = '$this->user_id'";
        $result = $this->connection->query($sql);

        $preferences = mysqli_fetch_array($result, MYSQLI_ASSOC);

        if(!$preferences) return false;

        return $preferences;
    }

    //$user_preferences is an array 
    public function update_user_preferences($user_preferences){

        $sql = sprintf(
            'UPDATE ' . $this->preference_table_name . ' set min_daily_hours="%s", max_daily_hours="%s"  WHERE user_id="%s"',
            $user_preferences['min_daily_hours'],
            $user_preferences['max_daily_hours'],
            $this->user_id
        );

        $result = $this->connection->query($sql);
        if ($result === TRUE) {
            return true;
        }

        return false;
    }

    private function new_user_preferences(){

        $default_preferences = array(
            'preference_id' => '',
            'user_id' => $this->user_id,
            'min_daily_hours' => '1',
            'max_daily_hours' => '3', 
            'days_off' => ''
        );

        $columns = implode(", ",array_keys($default_preferences));
        $escaped_values = array_map(array($this->connection, 'real_escape_string'), array_values($default_preferences));

        $sql = sprintf(
            'INSERT INTO ' . $this->preference_table_name . ' (%s) VALUES ("%s")',
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