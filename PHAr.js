<style type="text/css">
    table {

        width: 125px;

    }

    td {

        padding: 1px;
        border: 1px solid #666666;
        text-align: center;

    }
</style>
<?php

session_start();

function Start_Again() {
    $number = rand(1,100);
    $_SESSION['higherlower'] = $number;
    echo "Select a Number below.";
    Display_Form();
}

function Display_Form() {
    echo "<table>";
    for ($num=1;$num < 101;$num++) {
        if (!preg_match("/(.*?)0/", $num)) { echo "<td><a href=\"".$PHP_SELF."?number=".$num."\">".$num."</td>"; }
        else { echo "<td><a href=\"".$PHP_SELF."?number=".$num."\">".$num."</td></tr><tr>"; }
    }
    echo "</table>";
}

if (isset($_GET['number'])) {
    $User_Number = $_GET['number'];
    $Actual_Number = $_SESSION['higherlower'];

    if ($User_Number < $Actual_Number) { echo "Higher"; Display_Form(); }
    elseif ($User_Number > $Actual_Number) { echo "Lower"; Display_Form(); }
    elseif ($User_Number == $Actual_Number) { echo "Bingo, Correct Guess!<br>"; Start_Again(); }

}elseif (!isset($_POST['higherlower'])) { Start_Again(); }

?>
