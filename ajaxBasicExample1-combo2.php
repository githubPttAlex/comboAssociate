<?php
/* 
 * ajaxBasicExample1-combo2.php
 */
/*$j=0;
for($i=0;$i<100000000000000;$i++){
    $j++;
}*/
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