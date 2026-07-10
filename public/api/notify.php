<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing data']);
    exit;
}

$pickup = $input['pickup'] ?? 'N/A';
$destination = $input['destination'] ?? 'N/A';
$rideType = $input['rideType'] ?? 'N/A';
$price = $input['price'] ?? '0.00';
$riderName = $input['riderName'] ?? 'N/A';
$riderPhone = $input['riderPhone'] ?? '';
$paymentId = $input['paymentId'] ?? 'N/A';

// Load env vars for Twilio credentials
$envFile = dirname(dirname(__FILE__)) . '/.env';
$envVars = [];
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $envVars[trim($parts[0])] = trim($parts[1]);
        }
    }
}

$results = ['email' => false, 'sms_rider' => false, 'sms_admin' => false];

// --- EMAIL NOTIFICATION TO ADMIN ---
$adminEmail = 'hugomencho@yahoo.com';
$subject = "XELAJU - New Ride Booking from $riderName";
$emailBody = "
NEW RIDE BOOKING - XELAJU
========================

Rider: $riderName
Phone: $riderPhone
Ride Type: " . ucfirst($rideType) . "
Fare: \$$price

Pickup: $pickup
Destination: $destination

Payment ID: $paymentId
Time: " . date('Y-m-d H:i:s T') . "

---
XELAJU Ride Service
";

$headers = "From: noreply@transportesxelaju.com\r\n";
$headers .= "Reply-To: noreply@transportesxelaju.com\r\n";
$headers .= "X-Mailer: XELAJU/1.0\r\n";

$results['email'] = mail($adminEmail, $subject, $emailBody, $headers);

// --- SMS NOTIFICATIONS VIA SIGNALWIRE (Twilio-compatible LAML API) ---
$swProject = $envVars['SIGNALWIRE_PROJECT_ID'] ?? getenv('SIGNALWIRE_PROJECT_ID');
$swToken = $envVars['SIGNALWIRE_API_TOKEN'] ?? getenv('SIGNALWIRE_API_TOKEN');
$swSpace = $envVars['SIGNALWIRE_SPACE_URL'] ?? getenv('SIGNALWIRE_SPACE_URL');
$swFrom = $envVars['SIGNALWIRE_PHONE_NUMBER'] ?? getenv('SIGNALWIRE_PHONE_NUMBER');

if ($swProject && $swToken && $swSpace && $swFrom) {
    // Format phone number to E.164 (add +1 for US 10-digit numbers)
    function formatPhone($phone) {
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digits) === 10) {
            return '+1' . $digits;
        } elseif (strlen($digits) === 11 && $digits[0] === '1') {
            return '+' . $digits;
        }
        return '+' . $digits;
    }

    function sendSms($project, $token, $space, $from, $to, $body) {
        $url = "https://$space/api/laml/2010-04-01/Accounts/$project/Messages.json";
        $data = http_build_query([
            'From' => $from,
            'To' => $to,
            'Body' => $body,
        ]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_USERPWD => "$project:$token",
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode >= 200 && $httpCode < 300;
    }

    // SMS to rider
    if ($riderPhone) {
        $riderMsg = "XELAJU: Your " . ucfirst($rideType) . " ride is confirmed! Fare: \$$price. Pickup: $pickup. We'll be there soon!";
        $results['sms_rider'] = sendSms($swProject, $swToken, $swSpace, $swFrom, formatPhone($riderPhone), $riderMsg);
    }

    // SMS to admin/dispatcher
    $adminPhone = '+16125582880';
    $adminMsg = "XELAJU NEW RIDE: $riderName ($riderPhone) - " . ucfirst($rideType) . " \$$price. From: $pickup To: $destination";
    $results['sms_admin'] = sendSms($swProject, $swToken, $swSpace, $swFrom, $adminPhone, $adminMsg);
} else {
    $results['sms_note'] = 'SignalWire not configured';
}

echo json_encode(['success' => true, 'notifications' => $results]);
