<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

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
class infohub_compress extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2019-07-06',
            'since' => '2019-07-02',
            'version' => '1.0.0',
            'class_name' => 'infohub_compress',
            'checksum' => '{{checksum}}',
            'note' => 'Compress data. You need less internet capacity and less storage space',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'compress' => 'normal',
            'uncompress' => 'normal',
            'get_available_options' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main compress function
     * @version 2019-07-06
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function compress(array $in = array()): array
    {
        $default = array(
            'compression_method' => 'gzip',
            'uncompressed_data' => '',
            'step' => 'step_start',
            'data_back' => array(
                'uncompressed_length' => 0,
                'compressed_length' => 0,
                'size_percent_of_original' => 0.0
            ),
            'response' => array(
                'answer' => 'false',
                'message' => 'Could not compress the data',
                'compressed_data' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start')
        {
            $in['data_back']['uncompressed_length'] = strlen($in['uncompressed_data']);

            $in['step'] = 'step_ask_child_plugin';

            $functionName = 'Compress' . ucwords($in['compression_method']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                $in['step'] = 'step_ask_function';
            }
        }

        if ($in['step'] === 'step_ask_child_plugin')
        {
            $pluginName = 'infohub_compress_' . $in['compression_method'];
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $pluginName,
                    'function' => 'compress'
                ),
                'data' => array(
                    'uncompressed_data' => $in['uncompressed_data']
                ),
                'data_back' => array(
                    'compression_method' => $in['compression_method'],
                    'uncompressed_length' => $in['data_back']['uncompressed_length'],
                    'step' => 'step_calculate_compressed_data_length'
                ),
            ));
        }

        if ($in['step'] === 'step_ask_function')
        {
            $response = $this->internal_Cmd(array(
                'func' => $functionName,
                'uncompressed_data' => $in['uncompressed_data']
            ));

            $in['response']['answer'] = $response['answer'];
            $in['response']['message'] = $response['message'];
            $in['response']['compressed_data'] = $response['compressed_data'];
            $in['step'] = 'step_calculate_compressed_data_length';
        }

        if ($in['step'] === 'step_calculate_compressed_data_length')
        {
            $uncompressedLength = $in['data_back']['uncompressed_length'];

            $compressedLength = strlen($in['response']['compressed_data']);
            $in['data_back']['compressed_length'] = $compressedLength;

            $in['data_back']['size_percent_of_original'] = $compressedLength / $uncompressedLength * 100.0;
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'compressed_data' => $in['response']['compressed_data'],
            'compression_method' => $in['compression_method'],
            'uncompressed_length' => $in['data_back']['uncompressed_length'],
            'compressed_length' => $in['data_back']['compressed_length'],
            'size_percent_of_original' => $in['data_back']['size_percent_of_original']
        );
    }

    /**
     * Main uncompress function
     * @version 2019-07-06
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function uncompress(array $in = array()): array
    {
        $default = array(
            'compression_method' => 'gzip',
            'compressed_data' => '',
            'step' => 'step_start',
            'data_back' => array(
                'uncompressed_length' => 0,
                'compressed_length' => 0,
                'size_percent_of_original' => 0.0
            ),
            'response' => array(
                'answer' => 'false',
                'message' => 'Could not uncompress the data',
                'uncompressed_data' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start')
        {
            $in['data_back']['compressed_length'] = strlen($in['compressed_data']);

            $in['step'] = 'step_ask_child_plugin';

            $functionName = 'Uncompress' . ucwords($in['compression_method']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                $in['step'] = 'step_ask_function';
            }
        }

        if ($in['step'] === 'step_ask_child_plugin')
        {
            $pluginName = 'infohub_compress_' . $in['compression_method'];
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $pluginName,
                    'function' => 'uncompress'
                ),
                'data' => array(
                    'compressed_data' => $in['compressed_data']
                ),
                'data_back' => array(
                    'compression_method' => $in['compression_method'],
                    'compressed_length' => $in['data_back']['compressed_length'],
                    'step' => 'step_calculate_compressed_data_length'
                ),
            ));
        }

        if ($in['step'] === 'step_ask_function')
        {
            $response = $this->internal_Cmd(array(
                'func' => $functionName,
                'compressed_data' => $in['compressed_data']
            ));

            $in['response']['answer'] = $response['answer'];
            $in['response']['message'] = $response['message'];
            $in['response']['uncompressed_data'] = $response['uncompressed_data'];
            $in['step'] = 'step_calculate_uncompressed_data_length';
        }

        if ($in['step'] === 'step_calculate_uncompressed_data_length')
        {
            $compressedLength = $in['data_back']['compressed_length'];

            $uncompressedLength = strlen($in['response']['uncompressed_data']);
            $in['data_back']['uncompressed_length'] = $uncompressedLength;

            $in['data_back']['size_percent_of_original'] = $compressedLength / $uncompressedLength * 100.0;
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'uncompressed_data' => $in['response']['uncompressed_data'],
            'compression_method' => $in['compression_method'],
            'uncompressed_length' => $in['data_back']['uncompressed_length'],
            'compressed_length' => $in['data_back']['compressed_length'],
            'size_percent_of_original' => $in['data_back']['size_percent_of_original']
        );

    }

    /**
     * Get list with compression methods you can use
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    final protected function  get_available_options(array $in = array()): array
    {
        $options = array(
            array("type" => "option", "value" => 'gzip', "label" => 'Gzip' )
        );

        return array(
            'answer' => 'true',
            'message' => 'List of valid compression methods.',
            'options' => $options
        );
    }

    /**
     * Compress data into gzip format
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_CompressGzip(array $in = array()): array
    {
        $default = array('uncompressed_data' => '');
        $in = $this->_Default($default, $in);

        $in['compressed_data'] = base64_encode(gzencode($in['uncompressed_data']));

        return array(
            'answer' => 'true',
            'message' => 'Here are the compressed data',
            'compressed_data' => $in['compressed_data']
        );
    }

    /**
     * uncompress gzip data
     * @version 2019-07-02
     * @since   2019-07-02
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_UncompressGzip(array $in = array()): array
    {
        $default = array(
            'compressed_data' => '' // gzip compressed data encoded with base64.
        );
        $in = $this->_Default($default, $in);

        // https://stackoverflow.com/questions/621976/which-compression-method-to-use-in-php
        $binaryData = base64_decode($in['compressed_data']);
        $decodedData = gzdecode($binaryData);
        $in['uncompressed_data'] = $decodedData;

        return array(
            'answer' => 'true',
            'message' => 'Here are the uncompressed data I got from the gzip data',
            'uncompressed_data' => $in['uncompressed_data']
        );
    }

}
