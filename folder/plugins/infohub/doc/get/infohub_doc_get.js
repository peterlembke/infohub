/**
 * Get document from local storage. If old or none existing we download from the server
 * Get a document list what documents exist.
 * Get a server document list what documents exist in the server
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2022-10-15
 * @since       2019-04-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/doc/infohub_doc.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_doc_get() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2022-10-15',
            'since': '2019-04-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_get',
            'note': 'Keep data updated locally and get new data from the server.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Get',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'get_document': 'normal',
            'get_documents_list': 'normal',
            'get_all_documents': 'normal',
            'store_document': 'normal',
            'build_local_documents_list': 'normal',
            'get_local_documents_list': 'normal',
            'get_wanted_documents_list': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * You can request one document
     * If the document is in the browser Storage and is not old then you get it.
     * If the document is missing or is old then it is requested from the server.
     * The document is stored in the browser Storage and returned to you.
     *
     * @version 2019-04-18
     * @since 2019-04-18
     * @author Peter Lembke
     */
    $functions.push('get_document');
    const get_document = function($in = {}) {
        const $default = {
            'area': 'main', // main or plugin
            'document_name': 'main',
            'step': 'step_get_document_from_storage',
            'data': {},
            'response': {},
            'data_back': {
                'area': '',
                'document_name': '',
                'data': {},
                'document_exist_locally': 'false',
            }
        };
        $in = _Default($default, $in);

        let $shouldUpdateDocumentInTheBackground = 'false';
        let $messageArray = [];

        if ($in.step === 'step_get_document_from_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_doc_get/document/' + $in.area + '/' + $in.document_name,
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'step': 'step_get_document_from_storage_response',
                },
            });
        }

        if ($in.step === 'step_get_document_from_storage_response') {
            $in.step = 'step_get_document_from_server';
            $in.data_back.data.checksum = '';

            const $checksum = $in.response.data.checksum ?? '';

            const $isDocumentFound = _Empty($in.response.data) === 'false' &&
                _Empty($checksum) === 'false';

            if ($isDocumentFound === true) {
                // We found a document in the Browser Storage
                $in.data_back.data = _ByVal($in.response.data);
                $in.step = 'step_check_if_data_is_old';
            }
        }

        if ($in.step === 'step_check_if_data_is_old') {

            const $validUntil = $in.data_back.data.valid_until ?? 0;
            const $now = _MicroTime();
            const $isDocumentValid = $validUntil > $now;

            $in.step = 'step_end'; // This will return the document we found in the local storage
            $in.response.ok = 'true';

            if ($isDocumentValid === false) {
                $shouldUpdateDocumentInTheBackground = 'true';
                $in.step = 'step_get_document_from_server';
            }
        }

        if ($in.step === 'step_get_document_from_server') {
            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_doc',
                        'function': 'get_document',
                    },
                    'data': {
                        'area': $in.area,
                        'document_name': $in.document_name,
                        'checksum': $in.data_back.data.checksum,
                    },
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'data': $in.data_back.data,
                    'step': 'step_get_document_from_server_response',
                },
            });

            if ($shouldUpdateDocumentInTheBackground === 'false') {
                return $messageOut; // We do not have the document. We ask the server.
            }

            $in.step = 'step_end'; // This will return the document we found in the local storage
            $messageArray.push($messageOut); // Will update the document in the local storage in the background
        }

        let $writeMode = 'overwrite';

        if ($in.step === 'step_get_document_from_server_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'false') {
                $in.data_back.message = $in.response.message;
                $in.response.ok = 'false';
            }

            if ($in.response.answer === 'true') {

                $in.data_back.data = _ByVal($in.response.data);

                if ($in.data.is_checksum_same === 'true') {

                    $writeMode = 'merge';

                    $in.data_back.data = {
                        'valid_until': $in.data_back.data['valid_until'], // TODO: Check if this is correct
                        'time_stamp': $in.data_back.data['time_stamp'],
                        'micro_time': $in.data_back.data['micro_time']
                    };
                }

                $in.step = 'step_save_data';
            }
        }

        if ($in.step === 'step_save_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_doc_get/document/' + $in.area + '/' + $in.document_name,
                    'data': $in.data_back.data,
                    'mode': $writeMode
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'data': $in.data_back.data,
                    'step': 'step_save_data_response',
                },
            });
        }

        if ($in.step === 'step_save_data_response') {
            $in.response.ok = $in.response.answer;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'document_data': $in.data_back.data,
            'ok': $in.response.ok,
            'messages': $messageArray
        };
    };

    /**
     * You can request the full document list. If the list exist then you get it.
     * If the list is old then a query is done to the server with a checksum.
     * The server compare your checksum with the current checksum and send back "keep your list",
     * or you get a new version of the list. You store the new list in the Storage.
     *
     * @version 2019-04-18
     * @since   2019-04-16
     * @author  Peter Lembke
     */
    $functions.push('get_documents_list');
    const get_documents_list = function($in = {}) {
        const $default = {
            'step': 'step_get_navigation_from_storage',
            'response': {
                'answer': 'false',
                'message': '',
                'ok': 'false',
                'data': {
                    'checksum': '',
                    'is_checksum_same': '',
                    'data': {},
                    'micro_time': 0.0,
                    'provided_checksum': '',
                    'time_stamp': '',
                    'valid_until': 0.0
                },
                'path': '',
                'post_exist': 'false',
            },
            'data_back': {
                'data': {},
            },
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $shouldUpdateDocumentListInTheBackground = 'false';

        if ($in.step === 'step_get_navigation_from_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_doc_get/navigation',
                },
                'data_back': {
                    'step': 'step_get_navigation_from_storage_response',
                },
            });
        }

        if ($in.step === 'step_get_navigation_from_storage_response') {
            $in.step = 'step_get_navigation_from_server';
            $in.data_back.data.checksum = '';

            if (_Empty($in.response.data.data) === 'false') {
                $in.data_back.data = _ByVal($in.response.data);
                $in.step = 'step_check_if_data_is_old';
            }
        }

        if ($in.step === 'step_check_if_data_is_old') {

            const $validUntil = $in.data_back.data.valid_until ?? 0;
            const $now = _MicroTime();
            const $isDocumentValid = $validUntil > $now;

            $in.step = 'step_end'; // This will return the document we found in the local storage
            $in.response.ok = 'true';

            if ($isDocumentValid === false) {
                $shouldUpdateDocumentListInTheBackground = 'true';
                $in.step = 'step_get_navigation_from_server';
            }
        }

        if ($in.step === 'step_get_navigation_from_server') {
            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'function': 'get_documents_list',
                    },
                    'data': {
                        'checksum': $in.data_back.data.checksum,
                    },
                },
                'data_back': {
                    'data': $in.data_back.data,
                    'step': 'step_get_navigation_from_server_response',
                },
            });

            if ($shouldUpdateDocumentListInTheBackground === 'false') {
                return $messageOut; // We do not have the document. We ask the server.
            }

            $in.step = 'step_end'; // This will return the document list we found in the local storage
            $messageArray.push($messageOut); // Will update the document list in the local storage in the background
        }

        let $writeMode = 'overwrite';

        if ($in.step === 'step_get_navigation_from_server_response') {

            $in.step = 'step_end';

            if ($in.response.answer === 'true') {

                $in.data_back.data = _ByVal($in.response.data);

                if ($in.response.data.is_checksum_same === 'true') {

                    $writeMode = 'merge';

                    $in.data_back.data = {
                        'valid_until': $in.data_back.data['valid_until'],
                        'time_stamp': $in.data_back.data['time_stamp'],
                        'micro_time': $in.data_back.data['micro_time']
                    };
                }

                $in.step = 'step_save_data';
            }
        }

        if ($in.step === 'step_save_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_doc_get/navigation',
                    'data': $in.data_back.data,
                    'mode': $writeMode
                },
                'data_back': {
                    'data': $in.data_back.data,
                    'step': 'step_end',
                },
            });
        }

        let $data = {};

        if ($in.step === 'step_end') {
            $data = _GetData({
                'name': 'data_back/data/data',
                'default': {},
                'data': $in,
                'split': '/',
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $data,
            'messages': $messageArray
        };
    };

    /**
     * You get all documents downloaded to your browser Storage.
     * You can then go offline and still read the documents.
     *
     * Load the wanted documents list
     * Send the list to the server.
     * Handle the response - save the documents.
     * If there are items left on the list then send it again to the server, and so on.
     *
     * @version 2022-10-19
     * @since 2019-10-06
     * @author Peter Lembke
     */
    $functions.push('get_all_documents');
    const get_all_documents = function($in = {}) {
        const $default = {
            'step': 'step_get_wanted_documents_list',
            'response': {
                'answer': 'false',
                'message': '',
                'wanted_documents_list': {},
                'ask_again_documents_list': {},
                'failed_to_load_documents_list': {},
                'data': {},
                'ok': 'false',
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $message = {};
        let $wantedDocumentsList = {};

        if ($in.step === 'step_get_wanted_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_wanted_documents_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_wanted_documents_list_response',
                },
            });
        }

        if ($in.step === 'step_get_wanted_documents_list_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_get_all_documents_from_server';
                $wantedDocumentsList = $in.response.wanted_documents_list;
            }
        }

        if ($in.step === 'step_get_all_documents_from_server_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.step = 'step_save_data';
            }
        }

        if ($in.step === 'step_save_data') {
            for (let $key in $in.response.data) {
                if ($in.response.data.hasOwnProperty($key) === false) {
                    continue;
                }

                const $document = $in.response.data[$key];

                $message = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_doc_get',
                        'function': 'store_document',
                    },
                    'data': {
                        'area': $document['area'] ?? '',
                        'document_name': $document['document_name'] ?? '',
                        'document': $document,
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });

                $messageArray.push($message);
            }

            $in.step = 'step_end';
            $wantedDocumentsList = $in.response.ask_again_documents_list;
            if (_Count($wantedDocumentsList) > 0) {
                $in.step = 'step_get_all_documents_from_server';
            }
        }

        if ($in.step === 'step_get_all_documents_from_server') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_doc',
                        'function': 'get_all_documents',
                    },
                    'data': {
                        'wanted_documents_list': $wantedDocumentsList
                    },
                },
                'data_back': {
                    'step': 'step_get_all_documents_from_server_response',
                },
                'messages': $messageArray
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messageArray,
            'ok': $in.response.ok
        };
    };

    $functions.push('store_document');
    /**
     * Store a document and update the local_documents_list
     * You can add / update / delete a document
     * Leave the document empty to delete it and remove it from the local documents list
     *
     * @version 2022-07-24
     * @since 2022-07-13
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|*}
     */
    const store_document = function($in = {}) {
        const $default = {
            'area': '',
            'document_name': '',
            'document': { // Leave empty to delete it and remove it from the local documents list
                'document': '',
                "document_size": 0,
                "area": "",
                "document_name": "",
                "time_stamp": "",
                "micro_time": 0.0,
                "checksum": "",
            },
            'step': 'step_get_local_documents_list',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'ok': 'false',
            },
            'data_back': {
                'local_documents_list': {}
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $messageOut = {};

        if ($in.step === 'step_get_local_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_doc_get/local_documents_list',
                },
                'data_back': {
                    'step': 'step_store',
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'document': $in.document
                },
            });
        }

        if ($in.step === 'step_store') {

            let $default = {
                "checksum": "",
                "is_checksum_same": "false",
                "data": {},
                "micro_time": _MicroTime(),
                "provided_checksum": "",
                "time_stamp": _TimeStamp()
            };

            let $localList = _Default($default, $in.response.data);

            if (_IsSet($localList.data[$in.area]) === 'false') {
                $localList.data[$in.area] = {};
            }

            let $shouldDeleteDocument = _Empty($in.document.document);

            if ($shouldDeleteDocument === 'true') {
                delete $localList.data[$in.area][$in.document_name];
                if (_Empty($localList.data[$in.area]) === 'true') {
                    delete $localList.data[$in.area];
                }
            } else {
                const $item = {
                    "document_name": $in.document_name,
                    "label": "",
                    "area": $in.area,
                    "checksum": $in.document.checksum ?? '',
                    "size": $in.document.document_size ?? 0,
                };
                $localList.data[$in.area][$in.document_name] = $item;
            }

            $localList.micro_time = _MicroTime();
            $localList.time_stamp = _TimeStamp();

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_doc_get/document/' + $in.area + '/' + $in.document_name,
                    'data': $in.document,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_doc_get/local_documents_list',
                    'data': $localList
                },
                'data_back': {
                    'step': 'step_end'
                },
            });
            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'Storage is done',
            'messages': $messageArray
        };
    };

    $functions.push('build_local_documents_list');
    /**
     * Checks what documents we have in the local Store and builds a new local_documents_list
     * Saves the local_documents_list, overwriting the existing one.
     *
     * The document path start with infohub_doc_get/document
     * And then you have one of: root, main, plugin
     * And then the document name
     * Example: infohub_doc_get/document/plugin/infohub_translate_manual
     *
     * @version 2022-08-13
     * @since 2022-08-13
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|*}
     */
    const build_local_documents_list = function($in = {}) {
        const $default = {
            'step': 'step_get_path_list_for_local_documents',
            'response': {
                'answer': 'false',
                'message': '',
                'items': {},
                'ok': 'false',
            },
            'data_back': {
                'local_documents_list': {}
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $messageOut = {};
        let $localList = {};

        if ($in.step === 'step_get_path_list_for_local_documents') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_pattern',
                },
                'data': {
                    'path': 'infohub_doc_get/document/*',
                    // 'data_request': { // @todo HUB-1646
                        // 'document_namne': '',
                        // 'area': '',
                        // 'checksum': '',
                        // 'document_size': 0
                    // }
                },
                'data_back': {
                    'step': 'step_store'
                },
            });
        }

        if ($in.step === 'step_store') {

            $localList = {
                "checksum": "",
                "is_checksum_same": "false",
                "data": {}, // Indexed on [area][document_name][data_item]
                "micro_time": _MicroTime(),
                "provided_checksum": "",
                "time_stamp": _TimeStamp()
            };

            for (let $key in $in.response.items) {
                if ($in.response.items.hasOwnProperty($key) === false) {
                    continue;
                }

                const $document = $in.response.items[$key];

                const $dataItem = {
                    "document_name": $document.document_name,
                    "label": "",
                    "area": $document.area,
                    "checksum": $document.checksum ?? '',
                    "size": $document.document_size ?? 0,
                };

                if (_IsSet($localList.data[$document.area]) === 'false') {
                    $localList.data[$document.area] = {};
                }

                $localList.data[$document.area][$document.document_name] = $dataItem;
            }

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_doc_get/local_documents_list',
                    'data': $localList
                },
                'data_back': {
                    'step': 'step_end'
                },
            });
            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'Storage of local list is on its way',
            'data': $localList,
            'messages': $messageArray
        };
    }

    $functions.push('get_local_documents_list');
    /**
     * Load the local documents list.
     * It is a list with all documents you have available locally.
     *
     *             let $localList = {
     *                 "checksum": "",
     *                 "is_checksum_same": "false",
     *                 "data": {}, // Indexed on [area][document_name][data_item]
     *                 "micro_time": _MicroTime(),
     *                 "provided_checksum": "",
     *                 "time_stamp": _TimeStamp()
     *             };
     *
     * @version 2022-10-17
     * @since 2022-10-17
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, messages: [], message: string}|{}|{}|{}|*}
     */
    const get_local_documents_list = function($in = {}) {
        const $default = {
            'step': 'step_load',
            'response': {
                'answer': 'false',
                'message': '',
                'post_exist': 'false',
                'data': {},
                'ok': 'false',
            },
            'data_back': {
                'local_documents_list': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_doc_get/local_documents_list',
                },
                'data_back': {
                    'step': 'step_load_response'
                },
            });
        }

        if ($in.step === 'step_load_response') {
            $in.step = 'step_handle_list';
            if ($in.response.post_exist === 'false') {
                $in.step = 'step_build_local_documents_list';
            }
        }

        if ($in.step === 'step_build_local_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'build_local_documents_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_handle_list'
                },
            });
        }

        if ($in.step === 'step_handle_list') {
            let $default = {
                "checksum": "",
                "is_checksum_same": "false",
                "data": {}, // Indexed on [area][document_name][data_item]
                "micro_time": _MicroTime(),
                "provided_checksum": "",
                "time_stamp": _TimeStamp()
            };
            $in.response.data = _Default($default, $in.response.data);
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    }

    $functions.push('get_wanted_documents_list');
    /**
     * Call get_local_documents_list.
     * Call get_documents_list
     * Figure out what documents we will:
     *
     * keep (checksum same)
     * delete (missing in documents_list)
     * update (old or different checksum)
     * new (missing in local_documents_list)
     *
     * Delete the ones we can delete.
     * Return the wanted_documents_list
     *
     * @version 2022-11-30
     * @since 2022-10-17
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, messages: [], message: string}|{}|{}|{}|*}
     */
    const get_wanted_documents_list = function($in = {}) {
        const $default = {
            'step': 'step_get_local_documents_list',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'ok': 'false',
            },
            'data_back': {
                'local_documents_list': {}
            }
        };
        $in = _Default($default, $in);

        let $wantedDocumentsList = {};
        let $messageArray = [];

        if ($in.step === 'step_get_local_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_local_documents_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_local_documents_list_response'
                },
            });
        }

        if ($in.step === 'step_get_local_documents_list_response') {
            $in.step = 'step_get_documents_list';
        }

        if ($in.step === 'step_get_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_documents_list',
                },
                'data': {},
                'data_back': {
                    'local_documents_list': $in.response.data,
                    'step': 'step_get_documents_list_response'
                },
            });
        }

        if ($in.step === 'step_get_documents_list_response') {
            $in.step = 'step_get_wanted_documents_list';
        }

        if ($in.step === 'step_get_wanted_documents_list') {

            let $localList = _GetData({
                'name': 'data_back/local_documents_list/data', // example: "response/data/checksum"
                'default': {}, // example: ""
                'data': $in, // an object with data where you want to pull out a part of it
            });

            let $serverList = _GetData({
                'name': 'response/data', // example: "response/data/checksum"
                'default': {}, // example: ""
                'data': $in, // an object with data where you want to pull out a part of it
            });

            let $deleteList = {};

            // What local documents are no longer available on the server but exist locally?
            for (let $area in $localList) {
                if ($localList.hasOwnProperty($area) === false) {
                    continue;
                }
                if (_IsSet($serverList[$area]) === 'false') {
                    // Delete the whole area
                    $deleteList[$area] = _ByVal($localList[$area]);
                    continue;
                }

                for (let $documentName in $localList[$area]) {
                    if ($localList[$area].hasOwnProperty($documentName) === false) {
                        continue;
                    }
                    if (_IsSet($serverList[$area][$documentName]) === 'true') {
                        continue;
                    }

                    // Local document is missing from the server list. We store its name for later deletion
                    if (_IsSet($deleteList[$area]) === 'false') {
                        $deleteList[$area] = {};
                    }
                    $deleteList[$area][$documentName] = $localList[$area][$documentName];
                }
            }

            let $messageOut = {};

            // Delete the local documents that are no longer available on the server
            for (let $area in $deleteList) {
                if ($deleteList.hasOwnProperty($area) === false) {
                    continue;
                }
                for (let $documentName in $deleteList[$area]) {
                    if ($deleteList[$area].hasOwnProperty($documentName) === false) {
                        continue;
                    }

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_doc_get',
                            'function': 'store_document',
                        },
                        'data': {
                            'area': $area,
                            'document_name': $documentName,
                            'document': {} // Will delete the document and update the local list
                        },
                        'data_back': {
                            'step': 'step_end'
                        },
                    });
                    $messageArray.push($messageOut);
                }
            }

            // What local documents are missing or need to be updated
            for (let $area in $serverList) {
                if ($serverList.hasOwnProperty($area) === false) {
                    continue;
                }

                const $isAreaMissing = _IsSet($localList[$area]) === 'false';
                if ($isAreaMissing === true) {
                    $wantedDocumentsList[$area] = Object.keys($serverList[$area]);
                    continue;
                }

                for (let $documentName in $serverList[$area]) {
                    if ($serverList[$area].hasOwnProperty($documentName) === false) {
                        continue;
                    }

                    const $isDocumentMissing = _IsSet($localList[$area][$documentName]) === 'false';
                    if ($isDocumentMissing === true) {
                        if (_IsSet($wantedDocumentsList[$area]) === 'false') {
                            $wantedDocumentsList[$area] = [];
                        }
                        $wantedDocumentsList[$area].push($documentName);
                        continue;
                    }

                    const $isDocumentChanged = $localList[$area][$documentName]['checksum'] !== $serverList[$area][$documentName]['checksum'];
                    if ($isDocumentChanged === true) {
                        if (_IsSet($wantedDocumentsList[$area]) === 'false') {
                            $wantedDocumentsList[$area] = [];
                        }
                        $wantedDocumentsList[$area].push($documentName);
                    }
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'wanted_documents_list': $wantedDocumentsList,
            'messages': $messageArray
        };
    }
}

//# sourceURL=infohub_doc_get.js