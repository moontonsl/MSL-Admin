<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class CodashopService
{
    /**
     * Get username from Codashop API
     * 
     * @param string $userId
     * @param string $zoneId
     * @return array|null Returns array with 'username' and 'success' keys, or null on error
     */
    public function getUsername(string $userId, string $zoneId): ?array
    {
        try {
            // Prepare post data for Codashop API
            $postdata = [
                'voucherPricePoint.id'              => 27670,
                'voucherPricePoint.price'           => 242535.0,
                'voucherPricePoint.variablePrice'   => 0,
                'n'                                 => '1/1/2024-2046',
                'email'                             => '',
                'userVariablePrice'                 => 0,
                'order.data.profile'                => 'eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ==',
                'user.userId'                       => $userId,
                'user.zoneId'                       => $zoneId,
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
                    'userId' => $userId,
                    'zoneId' => $zoneId
                ]);
                
                return null;
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                Log::warning('Codashop API returned non-200 status', [
                    'httpCode' => $httpCode,
                    'userId' => $userId,
                    'zoneId' => $zoneId,
                    'response' => $response
                ]);
                return null;
            }

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

            if (!$username) {
                Log::warning('Username not found in Codashop response', [
                    'userId' => $userId,
                    'zoneId' => $zoneId,
                    'response' => $response
                ]);
                return null;
            }

            return [
                'username' => $username,
                'success' => true,
                'response' => $responseData
            ];
            
        } catch (\Exception $e) {
            Log::error('Codashop Service Exception', [
                'error' => $e->getMessage(),
                'userId' => $userId,
                'zoneId' => $zoneId,
                'trace' => $e->getTraceAsString()
            ]);
            
            return null;
        }
    }
}

