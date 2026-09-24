<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CodashopController extends Controller
{
    /**
     * Initialize payment with Codashop API
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function initPayment(Request $request): JsonResponse
    {
        try {
            // Get raw JSON input to support both standard keys and numeric keys
            $dataInput = $request->json()->all();
            
            // Try to extract userID and zoneID from input
            // Support both standard keys (userId/zoneId) and numeric keys (if needed)
            $userID = $dataInput['userId'] ?? $dataInput['userID'] ?? $dataInput['165865941'] ?? null;
            $zoneID = $dataInput['zoneId'] ?? $dataInput['zoneID'] ?? $dataInput['3232'] ?? null;
            
            // Validate that we have the required data
            if (!$userID || !$zoneID) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing required parameters: userId and zoneId are required'
                ], 400);
            }

            // Prepare post data for Codashop API
            $postdata = [
                'voucherPricePoint.id'              => 27670,
                'voucherPricePoint.price'           => 242535.0,
                'voucherPricePoint.variablePrice'   => 0,
                'n'                                 => '1/1/2024-2046',
                'email'                             => '',
                'userVariablePrice'                 => 0,
                'order.data.profile'                => 'eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ==',
                'user.userId'                       => $userID,
                'user.zoneId'                       => $zoneID,
                'msisdn'                            => '',
                'voucherTypeName'                   => 'MOBILE_LEGENDS',
                'shopLang'                          => 'id_ID',
                'voucherTypeId'                     => '5',
                'gvtId'                             => '19',
                'lvtId'                             => '51',
                'pcId'                              => '91',
                'checkoutId'                        => '',
                'affiliateTrackingId'               => '',
                'impactClickId'                     => '',
                'anonymousId'                       => ''
            ];

            // Initialize curl session
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://order-sg.codashop.com/initPayment.action',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($postdata),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Origin: https://www.codashop.com',
                    'Referer: https://www.codashop.com/',
                    'User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Mobile Safari/537.36'
                ],
                CURLOPT_TIMEOUT => 30,
                CURLOPT_CONNECTTIMEOUT => 10,
            ]);

            // Execute curl request
            $response = curl_exec($ch);
            
            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
                
                Log::error('Codashop API CURL Error', [
                    'error' => $error,
                    'userId' => $userID,
                    'zoneId' => $zoneID
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'CURL Error: ' . $error
                ], 500);
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Parse the response to extract username
            $responseData = json_decode($response, true);
            $username = null;
            
            if ($responseData) {
                // Try to get username from confirmationFields first
                if (isset($responseData['confirmationFields']['username'])) {
                    $username = $responseData['confirmationFields']['username'];
                }
                // If not found, try to decode from result field (URL-encoded JSON)
                elseif (isset($responseData['result'])) {
                    $decodedResult = urldecode($responseData['result']);
                    $resultData = json_decode($decodedResult, true);
                    if ($resultData && isset($resultData['username'])) {
                        $username = $resultData['username'];
                    }
                }
            }

            // Log the response for debugging with username
            Log::info('Codashop API Response', [
                'httpCode' => $httpCode,
                'userId' => $userID,
                'zoneId' => $zoneID,
                'username' => $username,
                'response' => $response
            ]);

            // Prepare response with userId, zoneId, and username
            $finalResponse = $responseData ?: json_decode($response, true) ?: [];
            
            // Ensure userId, zoneId, and username are always at the top level of the response
            // Create a new array with these fields first, then merge with the original response
            $responseWithUserInfo = [
                'userId' => $userID,
                'zoneId' => $zoneID,
                'username' => $username,
            ];
            
            // Merge with the original Codashop response (userInfo fields will take precedence if they exist)
            $finalResponse = array_merge($finalResponse, $responseWithUserInfo);
            
            // Reorder to put userId, zoneId, and username at the beginning
            $orderedResponse = array_merge($responseWithUserInfo, $finalResponse);
            // Remove duplicates while preserving order
            $finalResponse = array_merge($responseWithUserInfo, array_diff_key($orderedResponse, $responseWithUserInfo));

            // Return response from Codashop API with userId, zoneId, and username
            return response()->json($finalResponse, $httpCode ?: 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Codashop API Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}

