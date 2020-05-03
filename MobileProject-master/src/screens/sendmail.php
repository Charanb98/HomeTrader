<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include('Mail.php'); //include pear mail extension
//initialize the variable
$name = null;
$content = null;
$email = null;
$sender = null;
$smtpinfo["host"] = _YOUR_STMP_SERVER;
$smtpinfo["port"] = _PORT_;
$smtpinfo["auth"] = true;
$smtpinfo["username"] = _USERNAME_;
$smtpinfo["password"] = _PASSWORD_;
if(!empty($_GET['name'])&&!empty($_GET['content'])&&!empty($_GET['email'])&&!empty($_GET['sender'])){
    $name = (String)$_GET['name'];
    $content = (String)$_GET['content'];
    $email = (String)$_GET['email'];
    $sender = (String)$_GET['sender'];
}else{
    http_response_code(403);
    exit(1);
}
    $content_wrap = wordwrap($content, 70, "\r\n");
    $headers['From']    = _SENDER_MAIL;
    $headers['To']      = $email;
    $headers['Subject'] = "HomeTrader-You have a new message from {$sender}!";
    $message = "Hello, {$name}:\n
Here is a message from the user {$sender}:


        {$content_wrap} 


You can contact the user by look up this user's personal information on HomeTrader app. Thanks!


Regards,
                
                
                
HomeTrader Team";
    $mail_object = Mail::factory("smtp", $smtpinfo); 
    $mail_object->send($email, $headers, $message);
    $mail_object = Mail::factory("smtp", $smtpinfo);
    $mail = $mail_object->send($email, $headers, $message);
    if (PEAR::isError($mail)) {
        echo("<p>" . $mail->getMessage() . "</p>");
        http_response_code(403);
    } else {
        echo("<p>Message successfully sent!</p>");
    http_response_code(200);
}

    
?>