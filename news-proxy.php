<?php
/**
 * NEWS PROXY - Simple PHP backend pour NewsAPI
 * Contourne les restrictions CORS du plan gratuit
 * 
 * Utilisation : /news-proxy.php?q=bitcoin&pageSize=5
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration
$NEWS_API_KEY = 'a634a2a63f754b5986797d342c0e3e39'; // ⚠️ Remplacer par votre clé NewsAPI
$QUERY = isset($_GET['q']) ? sanitize($_GET['q']) : '';
$PAGE_SIZE = isset($_GET['pageSize']) ? intval($_GET['pageSize']) : 5;

// Valider
if (empty($QUERY)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing query parameter']);
    exit;
}

// Limiter pageSize
if ($PAGE_SIZE > 10) $PAGE_SIZE = 10;
if ($PAGE_SIZE < 1) $PAGE_SIZE = 5;

// Construire l'URL NewsAPI
$url = 'https://newsapi.org/v2/everything';
$params = [
    'q' => $QUERY,
    'sortBy' => 'publishedAt',
    'language' => 'en',
    'pageSize' => $PAGE_SIZE,
    'apiKey' => $NEWS_API_KEY
];

$full_url = $url . '?' . http_build_query($params);

// Faire l'appel (avec timeout)
$context = stream_context_create([
    'http' => [
        'timeout' => 10,
        'ignore_errors' => true
    ]
]);

$response = @file_get_contents($full_url, false, $context);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch from NewsAPI']);
    exit;
}

// Retourner la réponse
http_response_code(200);
echo $response;
exit;

/**
 * Sanitize input
 */
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>
