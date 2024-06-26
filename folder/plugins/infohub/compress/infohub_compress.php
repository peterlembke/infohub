<?php
/**
 * Compression
 *
 * Compress data. You need less internet capacity and less storage space
 *
 * @package     Infohub
 * @subpackage  infohub_compress
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Compression
 *
 * Compress data. You need less internet capacity and less storage space
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-03-03
 * @since       2018-03-03
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_compress extends infohub_base
{
    /**
     * Version information for this plugin
     * @return string[]
     * @since   2019-07-02
     * @author  Peter Lembke
     * @version 2019-07-06
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-07-06',
            'since' => '2019-07-02',
            'version' => '1.0.0',
            'class_name' => 'infohub_compress',
            'checksum' => '{{checksum}}',
            'note' => 'Compress data. You need less internet capacity and less storage space',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @since   2019-07-02
     * @author  Peter Lembke
     * @version 2019-07-06
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'compress' => 'normal',
            'decompress' => 'normal',
            'get_available_options' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main compress function
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-07-06
     * @since   2019-07-02
     */
    protected function compress(array $in = []): array
    {
        $default = [
            'compression_method' => 'gzip',
            'decompressed_data' => '',
            'step' => 'step_start',
            'data_back' => [
                'decompressed_length' => 0,
                'compressed_length' => 0,
                'size_percent_of_original' => 0.0
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'Could not compress the data',
                'compressed_data' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $functionName = '';

        if ($in['step'] === 'step_start') {
            $in['data_back']['decompressed_length'] = strlen($in['decompressed_data']);

            $in['step'] = 'step_ask_child_plugin';

            $functionName = 'Compress' . ucwords($in['compression_method']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                $in['step'] = 'step_ask_function';
            }
        }

        if ($in['step'] === 'step_ask_child_plugin') {
            $pluginName = 'infohub_compress_' . $in['compression_method'];
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $pluginName,
                        'function' => 'compress'
                    ],
                    'data' => [
                        'decompressed_data' => $in['decompressed_data']
                    ],
                    'data_back' => [
                        'compression_method' => $in['compression_method'],
                        'decompressed_length' => $in['data_back']['decompressed_length'],
                        'step' => 'step_calculate_compressed_data_length'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_ask_function') {

            $response = $this->internal_Cmd([
                'func' => $functionName,
                'decompressed_data' => $in['decompressed_data']
            ]);

            $in['response']['answer'] = $response['answer'];
            $in['response']['message'] = $response['message'];
            $in['response']['compressed_data'] = $response['compressed_data'];
            $in['step'] = 'step_calculate_compressed_data_length';
        }

        if ($in['step'] === 'step_calculate_compressed_data_length') {
            $decompressedLength = $in['data_back']['decompressed_length'];

            $compressedLength = strlen($in['response']['compressed_data']);
            $in['data_back']['compressed_length'] = $compressedLength;

            $in['data_back']['size_percent_of_original'] = $compressedLength / $decompressedLength * 100.0;
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'compressed_data' => $in['response']['compressed_data'],
            'compression_method' => $in['compression_method'],
            'decompressed_length' => $in['data_back']['decompressed_length'],
            'compressed_length' => $in['data_back']['compressed_length'],
            'size_percent_of_original' => $in['data_back']['size_percent_of_original']
        ];
    }

    /**
     * Main decompress function
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-07-06
     * @since   2019-07-02
     */
    protected function decompress(array $in = []): array
    {
        $default = [
            'compression_method' => 'gzip',
            'compressed_data' => '',
            'step' => 'step_start',
            'data_back' => [
                'decompressed_length' => 0,
                'compressed_length' => 0,
                'size_percent_of_original' => 0.0
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'Could not decompress the data',
                'decompressed_data' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $functionName = '';

        if ($in['step'] === 'step_start') {
            $in['data_back']['compressed_length'] = strlen($in['compressed_data']);

            $in['step'] = 'step_ask_child_plugin';

            $functionName = 'Decompress' . ucwords($in['compression_method']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                $in['step'] = 'step_ask_function';
            }
        }

        if ($in['step'] === 'step_ask_child_plugin') {
            $pluginName = 'infohub_compress_' . $in['compression_method'];
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $pluginName,
                        'function' => 'decompress'
                    ],
                    'data' => [
                        'compressed_data' => $in['compressed_data']
                    ],
                    'data_back' => [
                        'compression_method' => $in['compression_method'],
                        'compressed_length' => $in['data_back']['compressed_length'],
                        'step' => 'step_calculate_compressed_data_length'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_ask_function') {
            $response = $this->internal_Cmd(
                [
                    'func' => $functionName,
                    'compressed_data' => $in['compressed_data']
                ]
            );

            $in['response']['answer'] = $response['answer'];
            $in['response']['message'] = $response['message'];
            $in['response']['decompressed_data'] = $response['decompressed_data'];
            $in['step'] = 'step_calculate_decompressed_data_length';
        }

        if ($in['step'] === 'step_calculate_decompressed_data_length') {
            $compressedLength = $in['data_back']['compressed_length'];

            $decompressedLength = strlen($in['response']['decompressed_data']);
            $in['data_back']['decompressed_length'] = $decompressedLength;

            $in['data_back']['size_percent_of_original'] = $compressedLength / $decompressedLength * 100.0;
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'decompressed_data' => $in['response']['decompressed_data'],
            'compression_method' => $in['compression_method'],
            'decompressed_length' => $in['data_back']['decompressed_length'],
            'compressed_length' => $in['data_back']['compressed_length'],
            'size_percent_of_original' => $in['data_back']['size_percent_of_original']
        ];
    }

    /**
     * Get list with compression methods you can use
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-07-02
     * @since   2019-07-02
     */
    protected function get_available_options(array $in = []): array
    {
        $options = [
            ['type' => 'option', 'value' => 'gzip', 'label' => 'Gzip']
        ];

        return [
            'answer' => 'true',
            'message' => 'List of valid compression methods.',
            'options' => $options
        ];
    }

    /**
     * Compress data into gzip format
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-07-02
     * @since   2019-07-02
     */
    protected function internal_CompressGzip(array $in = []): array
    {
        $default = ['decompressed_data' => ''];
        $in = $this->_Default($default, $in);

        $compressedString = gzencode($in['decompressed_data']);
        if ($compressedString === false) {
            return [
                'answer' => 'false',
                'message' => 'Failed compressing data',
                'compressed_data' => ''
            ];
        }

        $in['compressed_data'] = base64_encode($compressedString);

        return [
            'answer' => 'true',
            'message' => 'Here are the compressed data',
            'compressed_data' => $in['compressed_data']
        ];
    }

    /**
     * decompress gzip data
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-07-02
     * @since   2019-07-02
     */
    protected function internal_DecompressGzip(array $in = []): array
    {
        $default = [
            'compressed_data' => '' // gzip compressed data encoded with base64.
        ];
        $in = $this->_Default($default, $in);

        // https://stackoverflow.com/questions/621976/which-compression-method-to-use-in-php
        $binaryData = base64_decode($in['compressed_data']);
        $decodedData = gzdecode($binaryData);
        $in['decompressed_data'] = $decodedData;

        return [
            'answer' => 'true',
            'message' => 'Here are the decompressed data I got from the gzip data',
            'decompressed_data' => $in['decompressed_data']
        ];
    }

}
