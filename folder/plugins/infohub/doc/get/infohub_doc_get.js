/**
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */
function infohub_doc_get() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-04-18',
            'since': '2019-04-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_get',
            'note': 'Keep data updated locally and get new data from the server.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Get'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'get_document': 'normal',
            'get_documents_list': 'normal',
            'get_all_documents': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };
    
    /**
     * You can request one document
     * @version 2019-04-18
     * @since 2019-04-18
     * @author Peter Lembke
     */
    $functions.push("get_document");
    const get_document = function ($in)
    {
        const $default = {
            'area': 'main', // main or plugin
            'document_name': 'main',
            'step': 'step_get_document_from_storage',
            'response': {},
            'data_back': {
                'area': '',
                'document_name': '',
                'data': {},
                'document_exist_locally': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === "step_get_document_from_storage") 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': 'infohub_doc_get/document/' + $in.area + '/' + $in.document_name
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'step': 'step_get_document_from_storage_response'
                }
            });
        }

        if ($in.step === "step_get_document_from_storage_response") 
        {
            $in.step = "step_get_document_from_server";
            $in.data_back.data.checksum = '';

            if (_Empty($in.response.data) === 'false') {
                // We found a document in the Storage
                $in.data_back.data = _ByVal($in.response.data);
                $in.step = 'step_check_if_data_is_old';
            }
        }

        if ($in.step === "step_check_if_data_is_old") 
        {
            // @todo Return the data we have and do a background update. That is quicker.

            const $days = 14,
                $oldSeconds = $days * 24 * 60 * 60,
                $now = _MicroTime(),
                $gettingOld = $in.data_back.data.micro_time + $oldSeconds;

            $in.step = 'step_end';
            $in.response.ok = 'true';

            if ($now > $gettingOld) {
                $in.step = 'step_get_document_from_server';
            }
        }

        if ($in.step === "step_get_document_from_server") 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_doc',
                        'function': 'get_document'
                    },
                    'data': {
                        'area': $in.area,
                        'document_name': $in.document_name,
                        'checksum': $in.data_back.data.checksum
                    }
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'data': $in.data_back.data,
                    'step': 'step_get_document_from_server_response'
                }
            });
        }

        if ($in.step === "step_get_document_from_server_response") 
        {
            $in.step = 'step_end';

            if ($in.response.answer === 'false') {
                $in.data_back.message = $in.response.message;
                $in.response.ok = 'false';
            }

            if ($in.response.answer === 'true') {
                if ($in.response.data.checksum_same === 'false') {
                    $in.data_back.data = _ByVal($in.response.data);
                    $in.step = 'step_save_data';
                } else {
                    // @todo We also need to fresh up the timestamp in the client copy of the document.
                }
            }
        }

        if ($in.step === "step_save_data")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': 'infohub_doc_get/document/' + $in.area + '/' + $in.document_name,
                    'data': $in.data_back.data
                },
                'data_back': {
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'data': $in.data_back.data,
                    'step': 'step_save_data_response'
                }
            });
        }

        if ($in.step === "step_save_data_response")
        {
            $in.response.ok = $in.response.answer;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'document_data': $in.data_back.data,
            'ok': $in.response.ok
        };
    };

    /**
     * You can request the full document list. If the list exist then you get it.
     * If the list is old then a query is done to the server with a checksum.
     * The server send back a "keep list" or a new version of the list.
     * Store the new list in the Storage.
     * If the request have still not been answered then the new list are given.
     * @version 2019-04-18
     * @since   2019-04-16
     * @author  Peter Lembke
     */
    $functions.push('get_documents_list');
    const get_documents_list = function ($in)
    {
        const $default = {
            'step': 'step_get_navigation_from_storage',
            'response': {
                'answer': 'false',
                'message': '',
                'ok': 'false',
                'data': {
                    'checksum': '',
                    'checksum_same': '',
                    'data': {},
                    'micro_time': 0.0,
                    'provided_checksum': '',
                    'time_stamp': ''
                },
                'path': '',
                'post_exist': 'false'
            },
            'data_back': {
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === "step_get_navigation_from_storage")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': 'infohub_doc_get/navigation'
                },
                'data_back': {
                    'step': 'step_get_navigation_from_storage_response'
                }
            });
        }

        if ($in.step === "step_get_navigation_from_storage_response") 
        {
            $in.step = "step_get_navigation_from_server";
            $in.data_back.data.checksum = '';

            if (_Empty($in.response.data.data) === 'false') {
                $in.data_back.data = _ByVal($in.response.data);
                $in.step = 'step_check_if_data_is_old';
            }
        }

        if ($in.step === "step_check_if_data_is_old") 
        {
            // @todo Return the data we have and do a background update. That is quicker.

            const $days = 14,
                $oldSeconds = $days * 24 * 60 * 60,
                $now = _MicroTime(),
                $gettingOld = $in.data_back.data.micro_time + $oldSeconds;

            $in.step = 'step_end';
            if ($now > $gettingOld) {
                $in.step = 'step_get_navigation_from_server';
            }
        }

        if ($in.step === "step_get_navigation_from_server") 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'function': 'get_documents_list'
                    },
                    'data': {
                        'checksum': $in.data_back.data.checksum
                    }
                },
                'data_back': {
                    'data': $in.data_back.data,
                    'step': 'step_get_navigation_from_server_response'
                }
            });
        }

        if ($in.step === "step_get_navigation_from_server_response") 
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                if ($in.response.data.checksum_same === 'false') {
                    $in.data_back.data = _ByVal($in.response.data);
                    $in.step = 'step_save_data';
                }
            }
        }

        if ($in.step === "step_save_data") 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': 'infohub_doc_get/navigation',
                    'data': $in.data_back.data
                },
                'data_back': {
                    'data': $in.data_back.data,
                    'step': 'step_end'
                }
            });
        }

        let $data = {};

        if ($in.step === "step_end")
        {
            $data = _GetData({
                'name': 'data_back/data/data',
                'default': {},
                'data': $in,
                'split': '/'
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $data
        };
    };

    /**
     * Here you get all documents so you are prepared if you need to go offline
     * @version 2019-10-06
     * @since 2019-10-06
     * @author Peter Lembke
     */
    $functions.push("get_all_documents");
    const get_all_documents = function ($in)
    {
        const $default = {
            'step': 'step_get_all_documents_from_server',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'ok': 'false'
            }
        };
        $in = _Default($default, $in);

        let $messagesArray = [];
        let $message = {};

        if ($in.step === "step_get_all_documents_from_server")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_doc',
                        'function': 'get_all_documents'
                    },
                    'data': {}
                },
                'data_back': {
                    'step': 'step_get_all_documents_from_server_response'
                }
            });
        }

        if ($in.step === "step_get_all_documents_from_server_response")
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.step = 'step_save_data';
            }
        }

        if ($in.step === "step_save_data")
        {
            for (let $key in $in.response.data)
            {
                if ($in.response.data.hasOwnProperty($key) === false) {
                    continue;
                }

                const $document = $in.response.data[$key];

                const $area = _GetData({
                    'name': 'response|data|' + $key + '|area',
                    'default': '',
                    'data': $in,
                    'split': '|'
                });

                const $documentName = _GetData({
                    'name': 'response|data|' + $key + '|document_name',
                    'default': '',
                    'data': $in,
                    'split': '|'
                });

                $message = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'write'
                    },
                    'data': {
                        'path': 'infohub_doc_get/document/' + $area + '/' + $documentName,
                        'data': $document
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messagesArray.push($message);
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messagesArray,
            'ok': $in.response.ok
        };
    };
}
//# sourceURL=infohub_doc_get.js