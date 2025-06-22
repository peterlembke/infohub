/**
 * infohub_compress
 * Compress data. You need less internet capacity and less storage space
 *
 * @package     Infohub
 * @subpackage  infohub_compress
 * @since       2019-07-02
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_compress() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-07-07',
            'since': '2019-07-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_compress',
            'note': 'Compress data. You need less internet capacity and less storage space',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'compress': 'normal',
            'decompress': 'normal',
            'get_available_options': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main compress function
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('compress');
    const compress = function($in = {}) {
        const $default = {
            'compression_method': 'gzip',
            'decompressed_data': '',
            'step': 'step_start',
            'data_back': {
                'decompressed_length': 0,
                'compressed_length': 0,
                'size_percent_of_original': 0.0,
            },
            'response': {
                'answer': 'false',
                'message': 'Could not compress the data',
                'compressed_data': '',
            },
        };
        $in = _Default($default, $in);

        let $functionName;

        if ($in.step === 'step_start') {
            $in.data_back.decompressed_length = $in.decompressed_data.length;

            $in.step = 'step_ask_child_plugin';

            $functionName = 'Compress' + _UcWords($in.compression_method);
            if (_MethodExists('internal_' + $functionName) === 'true') {
                $in.step = 'step_ask_function';
            }
        }

        if ($in.step === 'step_ask_child_plugin') {
            const $pluginName = 'infohub_compress_' + $in.compression_method;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'compress',
                },
                'data': {
                    'decompressed_data': $in.decompressed_data,
                },
                'data_back': {
                    'compression_method': $in.compression_method,
                    'decompressed_length': $in.data_back.decompressed_length,
                    'step': 'step_calculate_compressed_data_length',
                },
            });
        }

        if ($in.step === 'step_ask_function') {
            const $response = internal_Cmd({
                'func': $functionName,
                'decompressed_data': $in.decompressed_data,
            });

            $in.response.answer = $response.answer;
            $in.response.message = $response.message;
            $in.response.compressed_data = $response.compressed_data;
            $in.step = 'step_calculate_compressed_data_length';
        }

        if ($in.step === 'step_calculate_compressed_data_length') {
            const $decompressedLength = $in.data_back.decompressed_length;

            const $compressedLength = $in.response.compressed_data.length;
            $in.data_back.compressed_length = $compressedLength;

            $in.data_back.size_percent_of_original = $compressedLength /
                $decompressedLength * 100.0;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'compressed_data': $in.response.compressed_data,
            'compression_method': $in.compression_method,
            'decompressed_length': $in.data_back.decompressed_length,
            'compressed_length': $in.data_back.compressed_length,
            'size_percent_of_original': $in.data_back.size_percent_of_original,
        };
    };

    /**
     * Main checksum calculation
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('decompress');
    const decompress = function($in = {}) {
        const $default = {
            'compression_method': 'gzip',
            'compressed_data': '',
            'step': 'step_start',
            'data_back': {
                'decompressed_length': 0,
                'compressed_length': 0,
                'size_percent_of_original': 0.0,
            },
            'response': {
                'answer': 'false',
                'message': 'Could not compress the data',
                'decompressed_data': '',
            },
        };

        let $functionName;

        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $in.data_back.compressed_length = $in.compressed_data.length;

            $in.step = 'step_ask_child_plugin';

            $functionName = 'Decompress' + _UcWords($in.compression_method);
            if (_MethodExists('internal_' + $functionName) === 'true') {
                $in.step = 'step_ask_function';
            }
        }

        if ($in.step === 'step_ask_child_plugin') {
            const $pluginName = 'infohub_compress_' + $in.compression_method;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'decompress',
                },
                'data': {
                    'compressed_data': $in.compressed_data,
                },
                'data_back': {
                    'compression_method': $in.compression_method,
                    'compressed_length': $in.data_back.compressed_length,
                    'step': 'step_calculate_decompressed_data_length',
                },
            });
        }

        if ($in.step === 'step_ask_function') {
            const $response = internal_Cmd({
                'func': $functionName,
                'compressed_data': $in.compressed_data,
            });

            $in.response.answer = $response.answer;
            $in.response.message = $response.message;
            $in.response.decompressed_data = $response.decompressed_data;
            $in.step = 'step_calculate_decompressed_data_length';
        }

        if ($in.step === 'step_calculate_decompressed_data_length') {
            const $compressedLength = $in.data_back.compressed_length;

            const $decompressedLength = $in.response.decompressed_data.length;
            $in.data_back.decompressed_length = $decompressedLength;

            $in.data_back.size_percent_of_original = $compressedLength /
                $decompressedLength * 100.0;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'decompressed_data': $in.response.decompressed_data,
            'compression_method': $in.compression_method,
            'decompressed_length': $in.data_back.decompressed_length,
            'compressed_length': $in.data_back.compressed_length,
            'size_percent_of_original': $in.data_back.size_percent_of_original,
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in object
    // * An internal function give its answer as an object
    // *****************************************************************************

    /**
     * Get list with compression methods you can use
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('get_available_options');
    const get_available_options = function($in = {}) {
        const $options = [
            {'type': 'option', 'value': 'gzip', 'label': 'Gzip'},
            {'type': 'option', 'value': 'lz', 'label': 'LZ'},
        ];

        return {
            'answer': 'true',
            'message': 'List of valid compression methods.',
            'options': $options,
        };
    };

}

//# sourceURL=infohub_compress.js
