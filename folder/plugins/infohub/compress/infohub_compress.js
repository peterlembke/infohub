/*	infohub_compress

 Copyright (C) 2019 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 infohub_compress is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 infohub_compress is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with infohub_compress.	If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_compress() {

    "use strict";

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'compress': 'normal',
            'uncompress': 'normal',
            'get_available_options': 'normal'
        };
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
    $functions.push("compress");
    const compress = function($in)
    {
        const $default = {
            'compression_method': 'gzip',
            'uncompressed_data': '',
            'step': 'step_start',
            'data_back': {
                'uncompressed_length': 0,
                'compressed_length': 0,
                'size_percent_of_original': 0.0
            },
            'response': {
                'answer': 'false',
                'message': 'Could not compress the data',
                'compressed_data': ''
            }
        };
        $in = _Default($default, $in);

        let $functionName;

        if ($in.step === 'step_start')
        {
            $in.data_back.uncompressed_length = $in.uncompressed_data.length;

            $in.step = 'step_ask_child_plugin';

            $functionName = 'Compress' + _UcWords($in.compression_method);
            if (_MethodExists('internal_' + $functionName) === true) {
                $in.step = 'step_ask_function';
            }
        }

        if ($in.step === 'step_ask_child_plugin')
        {
            const $pluginName = 'infohub_compress_' + $in.compression_method;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'compress'
                },
                'data': {
                    'uncompressed_data': $in.uncompressed_data
                },
                'data_back': {
                    'compression_method': $in.compression_method,
                    'uncompressed_length': $in.data_back.uncompressed_length,
                    'step': 'step_calculate_compressed_data_length'
                },
            });
        }

        if ($in.step === 'step_ask_function')
        {
            const $response = internal_Cmd({
                'func': $functionName,
                'uncompressed_data': $in.uncompressed_data
            });

            $in.response.answer = $response.answer;
            $in.response.message = $response.message;
            $in.response.compressed_data = $response.compressed_data;
            $in.step = 'step_calculate_compressed_data_length';
        }

        if ($in.step === 'step_calculate_compressed_data_length')
        {
            const $uncompressedLength = $in.data_back.uncompressed_length;

            const $compressedLength = $in.response.compressed_data.length;
            $in.data_back.compressed_length = $compressedLength;

            $in.data_back.size_percent_of_original = $compressedLength / $uncompressedLength * 100.0;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'compressed_data': $in.response.compressed_data,
            'compression_method': $in.compression_method,
            'uncompressed_length': $in.data_back.uncompressed_length,
            'compressed_length': $in.data_back.compressed_length,
            'size_percent_of_original': $in.data_back.size_percent_of_original
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
    $functions.push("uncompress");
    const uncompress = function($in)
    {
        const $default = {
            'compression_method': 'gzip',
            'compressed_data': '',
            'step': 'step_start',
            'data_back': {
                'uncompressed_length': 0,
                'compressed_length': 0,
                'size_percent_of_original': 0.0
            },
            'response': {
                'answer': 'false',
                'message': 'Could not compress the data',
                'uncompressed_data': ''
            }
        };

        let $functionName;

        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            $in.data_back.compressed_length = $in.compressed_data.length;

            $in.step = 'step_ask_child_plugin';

            $functionName = 'Uncompress' + _UcWords($in.compression_method);
            if (_MethodExists('internal_' + $functionName) === true) {
                $in.step = 'step_ask_function';
            }
        }

        if ($in.step === 'step_ask_child_plugin')
        {
            const $pluginName = 'infohub_compress_' + $in.compression_method;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'uncompress'
                },
                'data': {
                    'compressed_data': $in.compressed_data
                },
                'data_back': {
                    'compression_method': $in.compression_method,
                    'compressed_length': $in.data_back.compressed_length,
                    'step': 'step_calculate_uncompressed_data_length'
                }
            });
        }

        if ($in.step === 'step_ask_function')
        {
            const $response = internal_Cmd({
                'func': $functionName,
                'compressed_data': $in.compressed_data
            });

            $in.response.answer = $response.answer;
            $in.response.message = $response.message;
            $in.response.uncompressed_data = $response.uncompressed_data;
            $in.step = 'step_calculate_uncompressed_data_length';
        }

        if ($in.step === 'step_calculate_uncompressed_data_length')
        {
            const $compressedLength = $in.data_back.compressed_length;

            const $uncompressedLength = $in.response.uncompressed_data.length;
            $in.data_back.uncompressed_length = $uncompressedLength;

            $in.data_back.size_percent_of_original = $compressedLength / $uncompressedLength * 100.0;
        }


        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'uncompressed_data': $in.response.uncompressed_data,
            'compression_method': $in.compression_method,
            'uncompressed_length': $in.data_back.uncompressed_length,
            'compressed_length': $in.data_back.compressed_length,
            'size_percent_of_original': $in.data_back.size_percent_of_original
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
    const get_available_options = function ($in)
    {
        const $options = [
            {"type": "option", "value": 'gzip', "label": 'Gzip' },
            {"type": "option", "value": 'lz', "label": 'LZ' }
        ];

        return {
            'answer': 'true',
            'message': 'List of valid compression methods.',
            'options': $options
        };
    };

}
//# sourceURL=infohub_compress.js
