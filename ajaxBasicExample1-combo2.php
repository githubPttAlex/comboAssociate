<?php
/* 
 * ajaxBasicExample1-combo2.php
 */

$receivedId = $_POST['id'];
switch ($receivedId) {
    case 1:
        $output = array(
            1 => 'Leonel Messi'
        );
        break;
    
    
    case 2:
        $output = array(
            1 => 'Cristiano Ronaldo'
        );
        break;
}
print_r(json_encode($output));exit;