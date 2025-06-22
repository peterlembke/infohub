/**
 * infohub_tree_storage
 * Read and Write encrypted data in browser Storage. If missing then downloaded from Server.
 *
 * @package     Infohub
 * @subpackage  infohub_tree_storage
 * @since       2020-07-25
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tree_storage() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-30',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_storage',
            'note': 'Read and Write encrypted data in browser Storage. If missing then downloaded from Server.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'read': 'normal',
            'read_many': 'normal',
            'read_pattern': 'normal',
            'write': 'normal',
            'get_user_tree_plugin_list': 'normal',
            'get_user_plugin_path_index': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Read a path. IF it does not exist locally it will be read from the server
     * and stored locally.
     * @version 2020-08-25
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('read');
    const read = function($in = {}) {
        const $default = {
            'path': '',
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> read',
            'data': {},
            'post_exist': 'false',
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
            'post_exist': $out.post_exist,
        };
    };

    /**
     * Read many paths. If some does not exist locally they will be read from the server
     * and stored locally.
     * @version 2020-08-25
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('read_many');
    const read_many = function($in = {}) {
        const $default = {
            'path': '',
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> read',
            'data': {},
            'post_exist': 'false',
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
            'post_exist': $out.post_exist,
        };
    };

    /**
     * Read paths by pattern. If some does not exist locally they will be read from the server
     * and stored locally.
     * @version 2020-08-25
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('read_pattern');
    const read_pattern = function($in = {}) {
        const $default = {
            'path': '',
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> read',
            'data': {},
            'post_exist': 'false',
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
            'post_exist': $out.post_exist,
        };
    };

    /**
     * Write to a path to local Storage.
     * Also update the log with what paths we have updated.
     * @version 2020-08-25
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('write');
    const write = function($in = {}) {
        const $default = {
            'path': '',
            'data': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> write',
            'data': {},
            'post_exist': 'false',
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
        };
    };

    /**
     * The plugin list is a list with all Tree plugins that are available to you.
     * If the local version do not exist locally then I will get it from the server and give it to you.
     * Storing the list in the background.
     * If the list exist locally then you will get it. If the list is old then I will do a background update.
     * @version 2020-08-30
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('get_user_tree_plugin_list');
    const get_user_tree_plugin_list = function($in = {}) {
        const $default = {};
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> write',
            'data': {},
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
        };
    };

    /**
     * Each Tree plugin has its own local user_plugin_path_index that contain:
     * all paths the user have stored locally for that plugin + old checksum, new checksum, status
     * This list are updated by write alone.
     * @version 2020-08-30
     * @since   2020-08-25
     * @author  Peter Lembke
     */
    $functions.push('get_user_plugin_path_index');
    const get_user_plugin_path_index = function($in = {}) {
        const $default = {
            'plugin_name': '',
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> get_user_plugin_path_index',
            'data': {},
        };

        if ($in.step === 'step_start') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
        };
    };

}

//# sourceURL=infohub_tree_storage.js