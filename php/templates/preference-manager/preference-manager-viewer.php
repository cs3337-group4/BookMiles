<?php
    //fix for live site
    $template_url = "http://" . $_SERVER['SERVER_NAME'] . "/boss/templates/";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>BOSS Preference Manager</title>
    
    <!--stylesheets-->
    <link rel="stylesheet" href="<?php echo $template_url . "plugins/bootstrap/css/bootstrap.css"?>"></link>
    <link rel="stylesheet" href="<?php echo $template_url . "plugins/bootstrap/css/bootstrap-theme.css"?>"></link>
    <script src="<?php echo $template_url . "plugins/datepicker/css/bootstrap-datepicker.css"?>"></script>

    <!--scripts-->
    <script src="<?php echo $template_url . "plugins/jquery/jquery-3.2.1.min.js"?>"></script>
    <script src="<?php echo $template_url . "plugins/bootstrap/js/bootstrap.js"?>"></script>
    <script src="<?php echo $template_url . "plugins/sweetalert/sweetalert.min.js"?>"></script>
    <script src="<?php echo $template_url . "plugins/xeditable/js/bootstrap-editable.js"?>"></script>
    <script src="<?php echo $template_url . "plugins/datepicker/js/bootstrap-datepicker.js"?>"></script>

    <!--css and js for this page-->
    <link rel="stylesheet" href="<?php echo $template_url . "preference-manager/pmv.css"?>"></link>
    <script src="<?php echo $template_url . "preference-manager/pmv.js"?>"></script>
</head>
<body>

<div class="topbar">
    <h3>Preference Manager</h3>
</div>

<div class="topbar-holder"></div>

<?php 
//if we have preferences then render
//preferences comes from controller
$min_hours = $user_preferences['min_daily_hours'];
$max_hours = $user_preferences['max_daily_hours'];

?>

<div class="wrapper">
    <div class="row forms">
        <div class="col-lg-10">
            <h4 class="header-title m-t-0 m-b-30">Preferences</h4>
            <form class="form-horizontal" role="form" method="post">
                <div class="form-group">
                    <label class="col-md-2 control-label">Minimum Daily Hours</label>
                    <div class="col-md-10">
                        <input type="text" name="min_hours" class="form-control" placeholder="Insert Hours" value="<?php echo $min_hours?>">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label" for="max_hours">Maximum daily hours</label>
                    <div class="col-md-10">
                        <input type="text" name="max_hours" id="max_hours" class="form-control" placeholder="Insert Hours" value="<?php echo $max_hours?>">
                    </div>
                </div>
                <input type="submit" value="Save Preferences" class="col-md-2 btn btn-primary pull-right"></input>
            </form>
        </div><!-- end col -->
    </div>
</div>
    
</body>
</html>