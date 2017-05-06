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
    <title>BOSS Books Manager</title>
    
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
    <link rel="stylesheet" href="<?php echo $template_url . "book-manager/bmv.css"?>"></link>
    <script src="<?php echo $template_url . "book-manager/bmv.js"?>"></script>
</head>
<body>

<div class="topbar">
    <h3>Book Manager</h3>
</div>

<div class="topbar-holder"></div>

<?php 
//if we have books then render
if(!empty($user_books)){
    //render out books
    include("templates/book-manager/books-viewer.php");
}

?>

<div class="wrapper">
    <div class="row forms">
        <div class="col-lg-10">
            <h4 class="header-title m-t-0 m-b-30">Add new book</h4>
            <form class="form-horizontal" role="form" method="post">
                <div class="form-group">
                    <label class="col-md-2 control-label">ISBN</label>
                    <div class="col-md-10">
                        <input type="text" name="isbn" class="form-control" placeholder="Insert ISBN">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label" for="due_date">Due Date</label>
                    <div class="col-md-10">
                        <input type="text" name="due_date" id="due_date" class="form-control" placeholder="Insert Due Date">
                    </div>
                </div>
                <input type="submit" value="Add Book" class="col-md-2 btn btn-primary pull-right"></input>
            </form>
        </div><!-- end col -->
    </div>
</div>
    
</body>
</html>