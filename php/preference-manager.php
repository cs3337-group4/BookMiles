<?php

include_once('functions.php');

//start computation

//book manager
$preference_manager = new PreferenceManager(1);

//check and process post
if(!(empty($_POST['max_hours']) || empty($_POST['min_hours']))){
    $user_id = 1;
    $min_hours = $_POST['min_hours'];
    $max_hours = $_POST['max_hours'];

    $user_preferences = $preference_manager->get_user_preferences();
    $user_preferences['min_daily_hours'] = $min_hours;
    $user_preferences['max_daily_hours'] = $max_hours;

    $result = $preference_manager->update_user_preferences($user_preferences);

    if(!$result){
        echo "woops! failed to edit preferences!";
    }
}

//currently only 1 user
$user_preferences = $preference_manager->get_user_preferences(1);

//toISOString(); both dates need to be in this format

//render out preference manager
include("templates/preference-manager/preference-manager-viewer.php");

?>