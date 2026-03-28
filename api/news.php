<?php
/**
 * PROXY GNews API
 * Ce fichier contourne le problème CORS en faisant l'appel côté serveur
 * Utilisation : /api/news.php?q=macroeconomic&lang=en&max=5
 */

// Active CORS pour ce endpoint
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Clé API GNews - À remplacer par votre vraie clé
$GNEWS_API_KEY = '5b523e05a500c7e4f37a9b4860b93a8e'; //

// Récupérer les paramètres
$query = isset($_GET['q']) ? sanitize($_GET['q']) : '';
$lang = isset($_GET['lang']) ? sanitize($_GET['lang']) : 'en';
$max = isset($_GET['max']) ? intval($_GET['max']) : 5;

// Validation
if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing query parameter']);
    exit;
}

// Limiter max à 10
if ($max > 10) {
    $max = 10;
}

// Construire l'URL GNews
$url = 'https://gnews.io/api/v4/search';
$params = [
    'q' => $query,
    'lang' => $lang,
    'max' => $max,
    'apikey' => $GNEWS_API_KEY
];

$full_url = $url . '?' . http_build_query($params);

// Faire l'appel à GNews
$response = @file_get_contents($full_url);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch from GNews API']);
    exit;
}

// Retourner la réponse
echo $response;

/**
 * Sanitize input
 */
function sanitize($input) {
    return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
}
?>
