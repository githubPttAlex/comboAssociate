<?php
/* 
 * comboAssociate - ajaxBasicExample1-combo3.php
 */
$receivedId = $_POST['id'];
switch ($receivedId) {
    case 1:
        $output = array(
            1 => 'Liga 2001-2002',
            2 => 'Liga 2002-2003'
        );
        break;
    
    
    case 2:
        $output = array(
            1 => 'Champions League 2004-2005'
        );
        break;
}
print_r(json_encode($output));exit;
