<?php
/**
 * Handle plugin information
 *
 * Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins
 *
 * @package     Infohub
 * @subpackage  infohub_plugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Handle plugin information
 *
 * Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2016-01-25
 * @since       2016-12-27
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/plugin/information/infohub_plugin_information.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_plugin_information extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2016-01-30
     * @since 2016-01-30
     * @author  Peter Lembke
     * @return  string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2016-01-30',
            'since' => '2012-08-24',
            'version' => '1.0.0',
            'class_name' => 'infohub_plugin_information',
            'checksum' => '{{checksum}}'
        );
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************


    /**
     * Get an array with detailed information about a class
     * Using the built in class PHP Reflection
     * @version 2013-12-29
     * @since   2012-08-24
     * @author  Peter Lembke
     * @param array $in
     * @return array
     * @throws ReflectionException
     */
    protected function plugin_data(array $in = [])
    {
        $default = array(
            'class_name' => '',
            'methods' => '*',
            'comment_parse' => 'false'
        );
        $in = $this->_Default($default, $in);

        if (empty($in['class_name'])) {
            $in['class_name'] = get_class($this);
        }

        $object = new $in['class_name']();
        $class = new ReflectionClass($in['class_name']);

        $classData = array(
            'name' => $in['class_name'],
            'parent_name' => get_parent_class($object),
            'comment' => $class->getDocComment(),
            'properties' => $class->getDefaultProperties(),
            'static_properties' => $class->getStaticProperties(),
            'constants' => $class->getConstants()
        );

        $wantedMethodsArray = [];
        $wantedMethod = false;
        if ($in['methods'] !== '*') {
            $response = explode(',', $in['methods']);
            foreach ($response as $tmp_name) {
                $wantedMethodsArray[$tmp_name] = 1;
            }
            $wantedMethod = true;
        }

        $methods = $class->getMethods();
        foreach ($methods as $method) {

            if ($wantedMethod == true) {
                if (isset($wantedMethodsArray[$method]) == false) {
                    continue; // Skip this method
                }
            }

            /** @var $method ReflectionClass */
            $methodsArray = [];
            foreach ($method as $methodName => $data) {
                $methodsArray[$methodName] = $data;
            }
            $methodsArray["comment"] = $method->getDocComment();

            // This sub call takes to long time. Call the sub function separately if needed. 2013-05-25
            if ($in['comment_parse'] === 'true') {
                $response = $this->internal_Cmd(array(
                    'func' => 'CommentParse',
                    'comment' => $methodsArray['comment']
                ));
                $methodsArray['comment_parsed'] = $response['comment_parsed'];
            }

            $parameters = $method->getParameters();
            $parametersArray = [];
            foreach ($parameters as $parameter) {
                $parametersArray[] = $parameter->getName();
            }

            /** @var $method ReflectionMethod */
            $methodsArray["parameters"] = $parametersArray;
            $methodsArray["isFinal"] = $method->isFinal();
            $methodsArray["isPrivate"] = $method->isPrivate();
            $methodsArray["isProtected"] = $method->isProtected();
            $methodsArray["isPublic"] = $method->isPublic();

            $methodName = $method->getName();
            // Get required variable names from the function
            if ($methodsArray["isFinal"] == true and $methodsArray["isProtected"] == true) {
                $methodsArray["required_variables"] = []; // Can not get default variables any more
            }

            $classData["methods"][$methodName] = $methodsArray;
        }

        return array(
            'answer' => 'true',
            'message' => '', 'data' => $classData
        );
    }

    /**
     * Give a PHPDOC comment and get it parsed into an array
     * Used by: you
     * @version 2013-12-29
     * @since   2013-05-25
     * @author  Peter Lembke
     * @param array $in
     * @return bool|string
     */
    protected function plugin_data_comment_parse(array $in = [])
    {
        $default = array(
            'comment' => ''
        );
        $in = $this->_Default($default, $in);

        $response = $this->internal_Cmd(array(
            'func' => 'CommentParse',
            'comment' => $in['comment']
        ));

        return $response;
    }

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * Give a PHPDOC comment and get it parsed into an array
     * You can use this to get more information about a function.
     * This function was previously called from plugin_data and the info was appended to the full array with class info.
     * That took too long time. Now you have to parse the info you are interested in.
     * example: $answer = internal_Cmd(array('func'=>'CommentParse','comment'=>$PHPDOC_comment));
     * Used by: plugin_data_comment_parse
     * @version 2013-05-25
     * @since   2013-05-25
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CommentParse(array $in = [])
    {
        $default = array(
            'comment' => ''
        );
        $in = $this->_Default($default, $in);

        $parsedRows = [];

        // Split comment into rows
        $commentRows = explode("\n", $in['comment']); // Divide text into rows
        $commentRows = array_filter($commentRows, 'trim'); // Remove rows with \r if exist
        $commentRows = array_map('trim', $commentRows); // Run the trim function on all rows.

        // Remove first and last row
        array_shift($commentRows); // Remove first row
        array_pop($commentRows); // Remove last row

        // Remove the comment code and the indents
        foreach ($commentRows as $index => $row) {
            $commentRows[$index] = substr($row, 2);
        }

        // Pull out the first row with the condensed description
        $parsedRows['info'] = array_shift($commentRows);

        // Fetch remaining text before the @ rows into "info_detail"
        $index = 0;
        foreach ($commentRows as $index => $row) {
            if (substr($row, 0, 1) == "@") {
                break 1;
            }
        }
        $parsedRows['info_detail'] = "";
        if ($index > 0) {
            $textRows = array_splice($commentRows, 0, $index);
            $parsedRows['info_detail'] = implode("\n", $textRows);
        }

        $phpDocName = '';
        // Now we have the @ parameters left to parse
        foreach ($commentRows as $index => $row) {
            if ($row[0] != '@') {
                if (isset($phpDocName) == true) {
                    if (isset($parsedRows[$phpDocName]) == true) {
                        $parsedRows[$phpDocName] = $parsedRows[$phpDocName] . ' ' . $row;
                        continue;
                    }
                }
            }
            $space = strpos($row, ' ');
            $phpDocName = strtolower(substr($row, 1, $space - 1)); // Get name without leading @
            $data = substr($row, $space + 1); // Get the data after the parameter name
            if ($phpDocName == 'param') {
                $data = explode(' ', $data);
                $data = array_map('trim', $data); // Run the trim function on all rows.
                if (count($data) > 1) {
                    $parsedRows['param'][$data[1]] = array('type' => $data[0], 'description' => '');
                }
                continue;
            }
            if ($phpDocName == 'uses') {
                $data = explode("|", $data);
                $data = array_map('trim', $data); // Run the trim function on all rows.
                if (count($data) == 3) {
                    $parsedRows['uses'][$data[0]] = array('type' => $data[1], 'description' => $data[2]);
                }
                continue;
            }
            $parsedRows[$phpDocName] = $data;
        }

        return array(
            'answer' => 'true',
            'message' => 'Have parsed the phpdoc comment into an array',
            'comment_parsed' => $parsedRows
        );
    }

}
