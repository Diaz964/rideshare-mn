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

$SQUARE_ACCESS_TOKEN = getenv('SQUARE_ACCESS_TOKEN');
if (!$SQUARE_ACCESS_TOKEN) {
    $envFile = dirname(dirname(__FILE__)) . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '#') === 0) continue;
            if (strpos($line, 'SQUARE_ACCESS_TOKEN=') === 0) {
                $SQUARE_ACCESS_TOKEN = substr($line, strlen('SQUARE_ACCESS_TOKEN='));
                break;
            }
        }
    }
}

if (!$SQUARE_ACCESS_TOKEN) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Payment configuration error']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['sourceId']) || !isset($input['amount'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing payment details']);
    exit;
}

$SQUARE_API_URL = 'https://connect.squareup.com/v2/payments';

$payload = json_encode([
    'source_id' => $input['sourceId'],
    'idempotency_key' => bin2hex(random_bytes(16)),
    'amount_money' => [
        'amount' => (int)$input['amount'],
        'currency' => 'USD',
    ],
    'note' => 'XELAJU ride: ' . ($input['rideType'] ?? '') . ' from ' . ($input['pickup'] ?? '') . ' to ' . ($input['destination'] ?? ''),
]);

$ch = curl_init($SQUARE_API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Square-Version: 2024-01-18',
        'Authorization: Bearer ' . $SQUARE_ACCESS_TOKEN,
        'Content-Type: application/json',
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300 && isset($data['payment'])) {
    echo json_encode([
        'success' => true,
        'paymentId' => $data['payment']['id'],
        'status' => $data['payment']['status'],
    ]);
} else {
    $errorDetail = $data['errors'][0]['detail'] ?? 'Payment processing failed';
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $errorDetail]);
}
