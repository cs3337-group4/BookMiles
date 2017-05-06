<h4 class="header-title m-t-0 m-b-30">User Book List</h4>
<div>
<?php
foreach($user_books as $book){
    ?>

    <div class="row" style="text-align: center; width: 100%;">
        <div class="col-md-12 pull-left" style="height:10px;"></div>
            <div class="col-md-3"></div>
            <div class="col-md-6" style="text-align: center;">
                <div class="book-container col-md-12"> 
                    <span class="title-font">Title: </span><span class="info-font"><?php echo $book['title'] ?></span>
                    <br><span class="title-font">ISBN: </span><span class="info-font"><?php echo $book['isbn'] ?></span>
                    <br><span class="title-font">Description: </span><span class="info-font"><?php echo $book['description'] ?></span>
                    <br><span class="title-font">Page Count: </span><span class="info-font"><?php echo $book['page_count'] ?></span>
                    <br><span class="title-font">Current Page: </span><span class="info-font"><?php echo $book['current_page'] ?></span>
                    <br><span class="title-font">Due Date: </span><span class="info-font"><?php echo $book['due_date'] ?></span>
                    <br><span class="title-font">Started on: </span><span class="info-font"><?php echo $book['start_date'] ?></span>
                </div>
            </div>
            <div class="col-md-3"></div>
    </div>
    <br>

    <?php
}
?>

</div>