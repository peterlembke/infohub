<?php
/**
 * Handle password
 *
 * Generate passwords
 *
 * @package     Infohub
 * @subpackage  infohub_password
 */

declare(strict_types=1);

if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Blog plugin handle blog texts in Markdown format
 *
 * @author      Peter Lembke <info@charzam.com>
 * @version     2021-11-24
 * @since       2021-11-24
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 */
class charzam_blog extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return  string[]
     * @since 2016-12-27
     * @author  Peter Lembke
     * @version 2017-04-02
     */
    protected function _Version(): array
    {
        return [
            'date' => '2021-11-24',
            'since' => '2021-11-24',
            'version' => '1.0.0',
            'class_name' => 'charzam_blog',
            'checksum' => '{{checksum}}',
            'note' => 'Show your blog texts',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'source_code' => 'https://github.com/peterlembke/charzam_blog',
            'homepage' => 'https://blog.charzam.com',
            'user_role' => 'guest'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2017-04-02
     * @since 2016-12-27
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'write' => 'normal',
            'list' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Read one blog post by its hub_id that you get from the list
     *
     * @param  array  $in
     * @return array
     * @since   2021-11-24
     * @author  Peter Lembke
     * @version 2021-11-24
     */
    protected function read(array $in = []): array
    {
        $default = [
            'hub_id' => ''
        ];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'message' => '',
            'text' => ''
        ];
    }

    /**
     * Write one blog post
     * Can only be used by a logged in administrator
     *
     * @param  array  $in
     * @return array
     * @since   2021-11-24
     * @author  Peter Lembke
     * @version 2021-11-24
     */
    protected function write(array $in = []): array
    {
        $default = [
            'hub_id' => '',
            'path' => '',
            'text' => ''
        ];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'message' => '',
            'text' => ''
        ];
    }

    /**
     * Get a list with all blog posts indexed on hub_id
     *
     * hub_id => [
     *      hub_id
     *      checksum
     *      path
     *      tags
     *      title
     *      published_at
     * ]
     *
     * @param  array  $in
     * @return array
     * @since   2021-11-24
     * @author  Peter Lembke
     * @version 2021-11-24
     */
    protected function list(array $in = []): array
    {
        $default = [];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'message' => '',
            'list' => ''
        ];
    }

    /**
     * Get many blog posts
     * Send in an array with the hub_ids you want
     *
     * You get a lookup with
     * [
     *      hub_id => 'The Markdown text with the images embedded'
     * ]
     *
     * @param  array  $in
     * @return array
     * @since   2021-11-24
     * @author  Peter Lembke
     * @version 2021-11-24
     */
    protected function read_many(array $in = []): array
    {
        $default = [
            'hub_id_array' => '',
        ];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'message' => '',
            'list' => ''
        ];
    }

}
