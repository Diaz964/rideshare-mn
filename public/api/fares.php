<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$FARES_FILE = dirname(__FILE__) . '/fares.json';
$ADMIN_AUTH = 'TWVuY2hvOTY0';

$DEFAULT_FARES = [
    ['id' => 'standard', 'name' => 'Standard', 'baseFare' => 2.5, 'perMile' => 1.75, 'perMinute' => 0.25, 'minimumFare' => 7.0],
    ['id' => 'comfort', 'name' => 'Comfort', 'baseFare' => 4.0, 'perMile' => 2.5, 'perMinute' => 0.35, 'minimumFare' => 10.0],
    ['id' => 'xl', 'name' => 'XL', 'baseFare' => 5.0, 'perMile' => 3.0, 'perMinute' => 0.45, 'minimumFare' => 14.0],
];

function readFares($file, $defaults) {
    if (file_exists($file)) {
        $contents = file_get_contents($file);
        $data = json_decode($contents, true);
        if (is_array($data) && count($data) > 0) {
            return $data;
        }
    }
    return $defaults;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['success' => true, 'fares' => readFares($FARES_FILE, $DEFAULT_FARES)]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['auth']) || $input['auth'] !== $ADMIN_AUTH) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit;
    }

    if (!isset($input['fares']) || !is_array($input['fares'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing fares']);
        exit;
    }

    $clean = [];
    foreach ($input['fares'] as $f) {
        if (!isset($f['id']) || !isset($f['name']) || $f['name'] === '') continue;
        $clean[] = [
            'id' => (string)$f['id'],
            'name' => (string)$f['name'],
            'baseFare' => (float)($f['baseFare'] ?? 0),
            'perMile' => (float)($f['perMile'] ?? 0),
            'perMinute' => (float)($f['perMinute'] ?? 0),
            'minimumFare' => (float)($f['minimumFare'] ?? 0),
        ];
    }

    if (count($clean) === 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No valid fares']);
        exit;
    }

    $written = file_put_contents($FARES_FILE, json_encode($clean, JSON_PRETTY_PRINT));
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not save fares']);
        exit;
    }

    echo json_encode(['success' => true, 'fares' => $clean]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
