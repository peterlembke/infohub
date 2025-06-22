/**
 * infohub_checksum_doublemetaphone
 * The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.
 *
 * @package     Infohub
 * @subpackage  infohub_checksum_doublemetaphone
 * @since       2017-03-01
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
/**
 * doublemetaphone Checksums are calculated and verified here
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-02-25
 * @since       2017-02-25
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/doublemetaphone/infohub_checksum_doublemetaphone.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_checksum_doublemetaphone() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-01-10',
            'since': '2017-03-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_doublemetaphone',
            'note': 'The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'calculate_checksum': 'normal',
            'verify_checksum': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * Uses https://github.com/maritz/js-double-metaphone
     * @version 2020-01-10
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('calculate_checksum');
    const calculate_checksum = function($in = {}) {
        const $default = {
            'value': '',
        };
        $in = _Default($default, $in);

        // const $back = {'primary': 'aa', 'secondary': 'bb' };
        const $back = double_metaphone($in.value);
        const $result = $back.primary + ' ' + $back.secondary;

        return {
            'answer': 'true',
            'message': 'Here are the checksum',
            'value': $in.value,
            'checksum': $result,
            'verified': 'false',
        };
    };

    /**
     * Main checksum calculation
     * Uses https://github.com/maritz/js-double-metaphone
     * @version 2020-01-10
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('verify_checksum');
    const verify_checksum = function($in = {}) {
        const $default = {
            'value': '',
            'checksum': '',
        };
        $in = _Default($default, $in);

        let $verified = 'false';

        // const $back = {'primary': 'aa', 'secondary': 'bb' }; // double_metaphone($in.value);
        const $back = double_metaphone($in.value);
        const $result = $back.primary + ' ' + $back.secondary;

        if ($result === $in.checksum) {
            $verified = 'true';
        }

        return {
            'answer': 'true',
            'message': 'Here are the result of the checksum verification',
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': $verified,
        };
    };

}

//# sourceURL=infohub_checksum_doublemetaphone.js

// This is a very rough common.js transformation of a php implementation. $original copyright of the PHP implementation follows:

// VERSION DoubleMetaphone Class 1.01
//
// DESCRIPTION
//
//   This class implements a "sounds like" algorithm developed
//   by Lawrence Philips which he published in the June, 2000 issue
//   of C/C++ Users Journal.  Double Metaphone is an improved
//   version of Philips' $original Metaphone algorithm.
//
// COPYRIGHT
//
//   Copyright 2001, Stephen Woodbridge <woodbri@swoodbridge.com>
//   All rights reserved.
//
//   http://swoodbridge.com/DoubleMetaPhone/
//
//   This PHP translation is based heavily on the C implementation
//   by Maurice Aubrey <maurice@hevanet.com>, which in turn
//   is based heavily on the C++ implementation by
//   Lawrence Philips and incorporates several bug fixes courtesy
//   of Kevin Atkinson <kevina@users.sourceforge.net>.
//
//   This module is free software; you may redistribute it and/or
//   modify it under the same terms as Perl itself.
//
// CONTRIBUTIONS
//
//   17-May-2002 Geoff Caplan  http://www.advantae.com
//     Bug fix: added code to return class object which I forgot to do
//     Created a functional callable version instead of the class version
//     which is faster if you are calling this a lot.
//
// https://github.com/maritz/js-double-metaphone
//
//  2020-01-10 Peter Lembke https://www.charzam.com
//  Could not get the code to work in the browser. A lot of issues and warnings in PHP Storm and jshint.
//  Ran the code through the PHP Storm "reformat code". Changed all variables to start with $.
//  All comparision from == to === and !==. Added variable declarations with let.
//  Changed to a command. Now it works in the browser.
// ------------------------------------------------------------------

var double_metaphone = function double_metaphone($string) {
    let $primary = '';
    let $secondary = '';
    let $current = 0;

    let $length = $string.length;
    let $last = $length - 1;
    let $original = $string + '     ';

    $original = $original.toUpperCase();

    // skip this at beginning of word

    if (string_at($original, 0, 2,
        ['GN', 'KN', 'PN', 'WR', 'PS']))
        $current++;

    // Initial 'X' is pronounced 'Z' e.g. 'Xavier'

    if ($original.substr(0, 1) === 'X') {
        $primary = $primary + 'S';   // 'Z' maps to 'S'
        $secondary = $secondary + 'S';
        $current++;
    }

    // main loop

    while ($primary.length < 4 || $secondary.length < 4) {
        if ($current >= $length)
            break;

        switch ($original.substr($current, 1)) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
            case 'Y':
                if ($current === 0) {
                    // all init vowels now map to 'A'
                    $primary = $primary + 'A';
                    $secondary = $secondary + 'A';
                }
                $current = $current + 1;
                break;

            case 'B':
                // '-mb', e.g. "dumb", already skipped over ...
                $primary = $primary + 'P';
                $secondary = $secondary + 'P';

                if ($original.substr($current + 1, 1) === 'B')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            case 'Ç':
                $primary = $primary + 'S';
                $secondary = $secondary + 'S';
                $current = $current + 1;
                break;

            case 'C':
                // various gremanic
                if (($current > 1)
                    && !is_vowel($original, $current - 2)
                    && string_at($original, $current - 1, 3,
                        ['ACH'])
                    && (($original.substr($current + 2, 1) !== 'I')
                        && (($original.substr($current + 2, 1) !== 'E')
                            || string_at($original, $current - 2, 6,
                                ['BACHER', 'MACHER'])))) {

                    $primary = $primary + 'K';
                    $secondary = $secondary + 'K';
                    $current = $current + 2;
                    break;
                }

                // special case 'caesar'
                if (($current === 0)
                    && string_at($original, $current, 6,
                        ['CAESAR'])) {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'S';
                    $current = $current + 2;
                    break;
                }

                // italian 'chianti'
                if (string_at($original, $current, 4,
                    ['CHIA'])) {
                    $primary = $primary + 'K';
                    $secondary = $secondary + 'K';
                    $current = $current + 2;
                    break;
                }

                if (string_at($original, $current, 2,
                    ['CH'])) {

                    // find 'michael'
                    if (($current > 0)
                        && string_at($original, $current, 4,
                            ['CHAE'])) {
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'X';
                        $current = $current + 2;
                        break;
                    }

                    // greek roots e.g. 'chemistry', 'chorus'
                    if (($current === 0)
                        && (string_at($original, $current + 1, 5,
                            ['HARAC', 'HARIS'])
                            || string_at($original, $current + 1, 3,
                                ['HOR', 'HYM', 'HIA', 'HEM']))
                        && !string_at($original, 0, 5, ['CHORE'])) {
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'K';
                        $current = $current + 2;
                        break;
                    }

                    // germanic, greek, or otherwise 'ch' for 'kh' sound
                    if ((string_at($original, 0, 4, ['VAN ', 'VON '])
                        || string_at($original, 0, 3, ['SCH']))
                        // 'architect' but not 'arch', orchestra', 'orchid'
                        || string_at($original, $current - 2, 6,
                            ['ORCHES', 'ARCHIT', 'ORCHID'])
                        || string_at($original, $current + 2, 1,
                            ['T', 'S'])
                        || ((string_at($original, $current - 1, 1,
                            ['A', 'O', 'U', 'E'])
                            || ($current === 0))
                            // e.g. 'wachtler', 'weschsler', but not 'tichner'
                            && string_at($original, $current + 2, 1,
                                [
                                    'L',
                                    'R',
                                    'N',
                                    'M',
                                    'B',
                                    'H',
                                    'F',
                                    'V',
                                    'W',
                                    ' ']))) {
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'K';
                    } else {
                        if ($current > 0) {
                            if (string_at($original, 0, 2, ['MC'])) {
                                // e.g. 'McHugh'
                                $primary = $primary + 'K';
                                $secondary = $secondary + 'K';
                            } else {
                                $primary = $primary + 'X';
                                $secondary = $secondary + 'K';
                            }
                        } else {
                            $primary = $primary + 'X';
                            $secondary = $secondary + 'X';
                        }
                    }
                    $current = $current + 2;
                    break;
                }

                // e.g. 'czerny'
                if (string_at($original, $current, 2, ['CZ'])
                    && !string_at($original, $current - 2, 4,
                        ['WICZ'])) {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'X';
                    $current = $current + 2;
                    break;
                }

                // e.g. 'focaccia'
                if (string_at($original, $current + 1, 3,
                    ['CIA'])) {
                    $primary = $primary + 'X';
                    $secondary = $secondary + 'X';
                    $current = $current + 3;
                    break;
                }

                // double 'C', but not McClellan'
                if (string_at($original, $current, 2, ['CC'])
                    && !(($current === 1)
                        && ($original.substr(0, 1) === 'M'))) {
                    // 'bellocchio' but not 'bacchus'
                    if (string_at($original, $current + 2, 1,
                        ['I', 'E', 'H'])
                        && !string_at($original, $current + 2, 2,
                            ['HU'])) {
                        // 'accident', 'accede', 'succeed'
                        if ((($current === 1)
                            && ($original.substr($current - 1, 1) === 'A'))
                            || string_at($original, $current - 1, 5,
                                ['UCCEE', 'UCCES'])) {
                            $primary = $primary + 'KS';
                            $secondary = $secondary + 'KS';
                            // 'bacci', 'bertucci', other italian
                        } else {
                            $primary = $primary + 'X';
                            $secondary = $secondary + 'X';
                        }
                        $current = $current + 3;
                        break;
                    } else {
                        // Pierce's rule
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'K';
                        $current = $current + 2;
                        break;
                    }
                }

                if (string_at($original, $current, 2,
                    ['CK', 'CG', 'CQ'])) {
                    $primary = $primary + 'K';
                    $secondary = $secondary + 'K';
                    $current = $current + 2;
                    break;
                }

                if (string_at($original, $current, 2,
                    ['CI', 'CE', 'CY'])) {
                    // italian vs. english
                    if (string_at($original, $current, 3,
                        ['CIO', 'CIE', 'CIA'])) {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'X';
                    } else {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'S';
                    }
                    $current = $current + 2;
                    break;
                }

                // else
                $primary = $primary + 'K';
                $secondary = $secondary + 'K';

                // name sent in 'mac caffrey', 'mac gregor'
                if (string_at($original, $current + 1, 2,
                    [' C', ' Q', ' G'])) {
                    $current = $current + 3;
                } else {
                    if (string_at($original, $current + 1, 1,
                        ['C', 'K', 'Q'])
                        && !string_at($original, $current + 1, 2,
                            ['CE', 'CI'])) {
                        $current = $current + 2;
                    } else {
                        $current = $current + 1;
                    }
                }
                break;

            case 'D':
                if (string_at($original, $current, 2,
                    ['DG'])) {
                    if (string_at($original, $current + 2, 1,
                        ['I', 'E', 'Y'])) {
                        // e.g. 'edge'
                        $primary = $primary + 'J';
                        $secondary = $secondary + 'J';
                        $current = $current + 3;
                        break;
                    } else {
                        // e.g. 'edgar'
                        $primary = $primary + 'TK';
                        $secondary = $secondary + 'TK';
                        $current = $current + 2;
                        break;
                    }
                }

                if (string_at($original, $current, 2,
                    ['DT', 'DD'])) {
                    $primary = $primary + 'T';
                    $secondary = $secondary + 'T';
                    $current = $current + 2;
                    break;
                }

                // else
                $primary = $primary + 'T';
                $secondary = $secondary + 'T';
                $current = $current + 1;
                break;

            case 'F':
                if ($original.substr($current + 1, 1) === 'F')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'F';
                $secondary = $secondary + 'F';
                break;

            case 'G':
                if ($original.substr($current + 1, 1) === 'H') {
                    if (($current > 0)
                        && !is_vowel($original, $current - 1)) {
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'K';
                        $current = $current + 2;
                        break;
                    }

                    if ($current < 3) {
                        // 'ghislane', 'ghiradelli'
                        if ($current === 0) {
                            if ($original.substr($current + 2, 1) === 'I') {
                                $primary = $primary + 'J';
                                $secondary = $secondary + 'J';
                            } else {
                                $primary = $primary + 'K';
                                $secondary = $secondary + 'K';
                            }
                            $current = $current + 2;
                            break;
                        }
                    }

                    // Parker's rule (with some further refinements) - e.g. 'hugh'
                    if ((($current > 1)
                        && string_at($original, $current - 2, 1,
                            ['B', 'H', 'D']))
                        // e.g. 'bough'
                        || (($current > 2)
                            && string_at($original, $current - 3, 1,
                                ['B', 'H', 'D']))
                        // e.g. 'broughton'
                        || (($current > 3)
                            && string_at($original, $current - 4, 1,
                                ['B', 'H']))) {
                        $current = $current + 2;
                        break;
                    } else {
                        // e.g. 'laugh', 'McLaughlin', 'cough', 'gough', 'rough', 'tough'
                        if (($current > 2)
                            && ($original.substr($current - 1, 1) === 'U')
                            && string_at($original, $current - 3, 1,
                                ['C', 'G', 'L', 'R', 'T'])) {
                            $primary = $primary + 'F';
                            $secondary = $secondary + 'F';
                        } else if (($current > 0) &&
                            $original.substr($current - 1, 1) !== 'I') {
                            $primary = $primary + 'K';
                            $secondary = $secondary + 'K';
                        }
                        $current = $current + 2;
                        break;
                    }
                }

                if ($original.substr($current + 1, 1) === 'N') {
                    if (($current === 1) && is_vowel($original, 0)
                        && !Slavo_Germanic($original)) {
                        $primary = $primary + 'KN';
                        $secondary = $secondary + 'N';
                    } else {
                        // not e.g. 'cagney'
                        if (!string_at($original, $current + 2, 2,
                            ['EY'])
                            && ($original.substr($current + 1) !== 'Y')
                            && !Slavo_Germanic($original)) {
                            $primary = $primary + 'N';
                            $secondary = $secondary + 'KN';
                        } else {
                            $primary = $primary + 'KN';
                            $secondary = $secondary + 'KN';
                        }
                    }
                    $current = $current + 2;
                    break;
                }

                // 'tagliaro'
                if (string_at($original, $current + 1, 2,
                    ['LI'])
                    && !Slavo_Germanic($original)) {
                    $primary = $primary + 'KL';
                    $secondary = $secondary + 'L';
                    $current = $current + 2;
                    break;
                }

                // -ges-, -gep-, -gel- at beginning
                if (($current === 0)
                    && (($original.substr($current + 1, 1) === 'Y')
                        || string_at($original, $current + 1, 2,
                            [
                                'ES',
                                'EP',
                                'EB',
                                'EL',
                                'EY',
                                'IB',
                                'IL',
                                'IN',
                                'IE',
                                'EI',
                                'ER']))) {
                    $primary = $primary + 'K';
                    $secondary = $secondary + 'J';
                    $current = $current + 2;
                    break;
                }

                // -ger-, -gy-
                if ((string_at($original, $current + 1, 2,
                    ['ER'])
                    || ($original.substr($current + 1, 1) === 'Y'))
                    && !string_at($original, 0, 6,
                        ['DANGER', 'RANGER', 'MANGER'])
                    && !string_at($original, $current - 1, 1,
                        ['E', 'I'])
                    && !string_at($original, $current - 1, 3,
                        ['RGY', 'OGY'])) {
                    $primary = $primary + 'K';
                    $secondary = $secondary + 'J';
                    $current = $current + 2;
                    break;
                }

                // italian e.g. 'biaggi'
                if (string_at($original, $current + 1, 1,
                    ['E', 'I', 'Y'])
                    || string_at($original, $current - 1, 4,
                        ['AGGI', 'OGGI'])) {
                    // obvious germanic
                    if ((string_at($original, 0, 4, ['VAN ', 'VON '])
                        || string_at($original, 0, 3, ['SCH']))
                        || string_at($original, $current + 1, 2,
                            ['ET'])) {
                        $primary = $primary + 'K';
                        $secondary = $secondary + 'K';
                    } else {
                        // always soft if french ending
                        if (string_at($original, $current + 1, 4,
                            ['IER '])) {
                            $primary = $primary + 'J';
                            $secondary = $secondary + 'J';
                        } else {
                            $primary = $primary + 'J';
                            $secondary = $secondary + 'K';
                        }
                    }
                    $current = $current + 2;
                    break;
                }

                if ($original.substr($current + 1, 1) === 'G')
                    $current = $current + 2;
                else
                    $current = $current + 1;

                $primary = $primary + 'K';
                $secondary = $secondary + 'K';
                break;

            case 'H':
                // only keep if first & before vowel or btw. 2 vowels
                if ((($current === 0) ||
                    is_vowel($original, $current - 1))
                    && is_vowel($original, $current + 1)) {
                    $primary = $primary + 'H';
                    $secondary = $secondary + 'H';
                    $current = $current + 2;
                } else
                    $current = $current + 1;
                break;

            case 'J':
                // obvious spanish, 'jose', 'san jacinto'
                if (string_at($original, $current, 4,
                    ['JOSE'])
                    || string_at($original, 0, 4, ['SAN '])) {
                    if ((($current === 0)
                        && ($original.substr($current + 4, 1) === ' '))
                        || string_at($original, 0, 4, ['SAN '])) {
                        $primary = $primary + 'H';
                        $secondary = $secondary + 'H';
                    } else {
                        $primary = $primary + 'J';
                        $secondary = $secondary + 'H';
                    }
                    $current = $current + 1;
                    break;
                }

                if (($current === 0)
                    && !string_at($original, $current, 4,
                        ['JOSE'])) {
                    $primary = $primary + 'J';  // Yankelovich/Jankelowicz
                    $secondary = $secondary + 'A';
                } else {
                    // spanish pron. of .e.g. 'bajador'
                    if (is_vowel($original, $current - 1)
                        && !Slavo_Germanic($original)
                        && (($original.substr($current + 1, 1) === 'A')
                            || ($original.substr($current + 1, 1) === 'O'))) {
                        $primary = $primary + 'J';
                        $secondary = $secondary + 'H';
                    } else {
                        if ($current === $last) {
                            $primary = $primary + 'J';
                            $secondary = $secondary + '';
                        } else {
                            if (!string_at($original, $current + 1, 1,
                                ['L', 'T', 'K', 'S', 'N', 'M', 'B', 'Z'])
                                && !string_at($original, $current - 1, 1,
                                    ['S', 'K', 'L'])) {
                                $primary = $primary + 'J';
                                $secondary = $secondary + 'J';
                            }
                        }
                    }
                }

                if ($original.substr($current + 1, 1) === 'J') // it could happen
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            case 'K':
                if ($original.substr($current + 1, 1) === 'K')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'K';
                $secondary = $secondary + 'K';
                break;

            case 'L':
                if ($original.substr($current + 1, 1) === 'L') {
                    // spanish e.g. 'cabrillo', 'gallegos'
                    if ((($current === ($length - 3))
                        && string_at($original, $current - 1, 4,
                            ['ILLO', 'ILLA', 'ALLE']))
                        || ((string_at($original, $last - 1, 2,
                            ['AS', 'OS'])
                            || string_at($original, $last, 1,
                                ['A', 'O']))
                            && string_at($original, $current - 1, 4,
                                ['ALLE']))) {
                        $primary = $primary + 'L';
                        $secondary = $secondary + '';
                        $current = $current + 2;
                        break;
                    }
                    $current = $current + 2;
                } else
                    $current = $current + 1;
                $primary = $primary + 'L';
                $secondary = $secondary + 'L';
                break;

            case 'M':
                if ((string_at($original, $current - 1, 3,
                    ['UMB'])
                    && ((($current + 1) === $last)
                        || string_at($original, $current + 2, 2,
                            ['ER'])))
                    // 'dumb', 'thumb'
                    || ($original.substr($current + 1, 1) === 'M')) {
                    $current = $current + 2;
                } else {
                    $current = $current + 1;
                }
                $primary = $primary + 'M';
                $secondary = $secondary + 'M';
                break;

            case 'N':
                if ($original.substr($current + 1, 1) === 'N')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'N';
                $secondary = $secondary + 'N';
                break;

            case 'Ñ':
                $current = $current + 1;
                $primary = $primary + 'N';
                $secondary = $secondary + 'N';
                break;

            case 'P':
                if ($original.substr($current + 1, 1) === 'H') {
                    $current = $current + 2;
                    $primary = $primary + 'F';
                    $secondary = $secondary + 'F';
                    break;
                }

                // also account for "campbell" and "raspberry"
                if (string_at($original, $current + 1, 1,
                    ['P', 'B']))
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'P';
                $secondary = $secondary + 'P';
                break;

            case 'Q':
                if ($original.substr($current + 1, 1) === 'Q')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'K';
                $secondary = $secondary + 'K';
                break;

            case 'R':
                // french e.g. 'rogier', but exclude 'hochmeier'
                if (($current === $last)
                    && !Slavo_Germanic($original)
                    && string_at($original, $current - 2, 2,
                        ['IE'])
                    && !string_at($original, $current - 4, 2,
                        ['ME', 'MA'])) {
                    $primary = $primary + '';
                    $secondary = $secondary + 'R';
                } else {
                    $primary = $primary + 'R';
                    $secondary = $secondary + 'R';
                }
                if ($original.substr($current + 1, 1) === 'R')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            case 'S':
                // special cases 'island', 'isle', 'carlisle', 'carlysle'
                if (string_at($original, $current - 1, 3,
                    ['ISL', 'YSL'])) {
                    $current = $current + 1;
                    break;
                }

                // special case 'sugar-'
                if (($current === 0)
                    && string_at($original, $current, 5,
                        ['SUGAR'])) {
                    $primary = $primary + 'X';
                    $secondary = $secondary + 'S';
                    $current = $current + 1;
                    break;
                }

                if (string_at($original, $current, 2,
                    ['SH'])) {
                    // germanic
                    if (string_at($original, $current + 1, 4,
                        ['HEIM', 'HOEK', 'HOLM', 'HOLZ'])) {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'S';
                    } else {
                        $primary = $primary + 'X';
                        $secondary = $secondary + 'X';
                    }
                    $current = $current + 2;
                    break;
                }

                // italian & armenian
                if (string_at($original, $current, 3,
                    ['SIO', 'SIA'])
                    || string_at($original, $current, 4,
                        ['SIAN'])) {
                    if (!Slavo_Germanic($original)) {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'X';
                    } else {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'S';
                    }
                    $current = $current + 3;
                    break;
                }

                // german & anglicisations, e.g. 'smith' match 'schmidt', 'snider' match 'schneider'
                // also, -sz- in slavic language altho in hungarian it is pronounced 's'
                if ((($current === 0)
                    && string_at($original, $current + 1, 1,
                        ['M', 'N', 'L', 'W']))
                    || string_at($original, $current + 1, 1,
                        ['Z'])) {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'X';
                    if (string_at($original, $current + 1, 1,
                        ['Z']))
                        $current = $current + 2;
                    else
                        $current = $current + 1;
                    break;
                }

                if (string_at($original, $current, 2,
                    ['SC'])) {
                    // Schlesinger's rule
                    if ($original.substr($current + 2, 1) === 'H')
                        // dutch origin, e.g. 'school', 'schooner'
                        if (string_at($original, $current + 3, 2,
                            ['OO', 'ER', 'EN', 'UY', 'ED', 'EM'])) {
                            // 'schermerhorn', 'schenker'
                            if (string_at($original, $current + 3, 2,
                                ['ER', 'EN'])) {
                                $primary = $primary + 'X';
                                $secondary = $secondary + 'SK';
                            } else {
                                $primary = $primary + 'SK';
                                $secondary = $secondary + 'SK';
                            }
                            $current = $current + 3;
                            break;
                        } else {
                            if (($current === 0)
                                && !is_vowel($original, 3)
                                &&
                                ($original.substr($current + 3, 1) !== 'W')) {
                                $primary = $primary + 'X';
                                $secondary = $secondary + 'S';
                            } else {
                                $primary = $primary + 'X';
                                $secondary = $secondary + 'X';
                            }
                            $current = $current + 3;
                            break;
                        }

                    if (string_at($original, $current + 2, 1,
                        ['I', 'E', 'Y'])) {
                        $primary = $primary + 'S';
                        $secondary = $secondary + 'S';
                        $current = $current + 3;
                        break;
                    }

                    // else
                    $primary = $primary + 'SK';
                    $secondary = $secondary + 'SK';
                    $current = $current + 3;
                    break;
                }

                // french e.g. 'resnais', 'artois'
                if (($current === $last)
                    && string_at($original, $current - 2, 2,
                        ['AI', 'OI'])) {
                    $primary = $primary + '';
                    $secondary = $secondary + 'S';
                } else {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'S';
                }

                if (string_at($original, $current + 1, 1,
                    ['S', 'Z']))
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            case 'T':
                if (string_at($original, $current, 4,
                    ['TION'])) {
                    $primary = $primary + 'X';
                    $secondary = $secondary + 'X';
                    $current = $current + 3;
                    break;
                }

                if (string_at($original, $current, 3,
                    ['TIA', 'TCH'])) {
                    $primary = $primary + 'X';
                    $secondary = $secondary + 'X';
                    $current = $current + 3;
                    break;
                }

                if (string_at($original, $current, 2,
                    ['TH'])
                    || string_at($original, $current, 3,
                        ['TTH'])) {
                    // special case 'thomas', 'thames' or germanic
                    if (string_at($original, $current + 2, 2,
                        ['OM', 'AM'])
                        || string_at($original, 0, 4, ['VAN ', 'VON '])
                        || string_at($original, 0, 3, ['SCH'])) {
                        $primary = $primary + 'T';
                        $secondary = $secondary + 'T';
                    } else {
                        $primary = $primary + '0';
                        $secondary = $secondary + 'T';
                    }
                    $current = $current + 2;
                    break;
                }

                if (string_at($original, $current + 1, 1,
                    ['T', 'D']))
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'T';
                $secondary = $secondary + 'T';
                break;

            case 'V':
                if ($original.substr($current + 1, 1) === 'V')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                $primary = $primary + 'F';
                $secondary = $secondary + 'F';
                break;

            case 'W':
                // can also be in middle of word
                if (string_at($original, $current, 2, ['WR'])) {
                    $primary = $primary + 'R';
                    $secondary = $secondary + 'R';
                    $current = $current + 2;
                    break;
                }

                if (($current === 0)
                    && (is_vowel($original, $current + 1)
                        || string_at($original, $current, 2,
                            ['WH']))) {
                    // Wasserman should match Vasserman
                    if (is_vowel($original, $current + 1)) {
                        $primary = $primary + 'A';
                        $secondary = $secondary + 'F';
                    } else {
                        // need Uomo to match Womo
                        $primary = $primary + 'A';
                        $secondary = $secondary + 'A';
                    }
                }

                // Arnow should match Arnoff
                if ((($current === $last)
                    && is_vowel($original, $current - 1))
                    || string_at($original, $current - 1, 5,
                        ['EWSKI', 'EWSKY', 'OWSKI', 'OWSKY'])
                    || string_at($original, 0, 3, ['SCH'])) {
                    $primary = $primary + '';
                    $secondary = $secondary + 'F';
                    $current = $current + 1;
                    break;
                }

                // polish e.g. 'filipowicz'
                if (string_at($original, $current, 4,
                    ['WICZ', 'WITZ'])) {
                    $primary = $primary + 'TS';
                    $secondary = $secondary + 'FX';
                    $current = $current + 4;
                    break;
                }

                // else skip it
                $current = $current + 1;
                break;

            case 'X':
                // french e.g. breaux
                if (!(($current === $last)
                    && (string_at($original, $current - 3, 3,
                        ['IAU', 'EAU'])
                        || string_at($original, $current - 2, 2,
                            ['AU', 'OU'])))) {
                    $primary = $primary + 'KS';
                    $secondary = $secondary + 'KS';
                }

                if (string_at($original, $current + 1, 1,
                    ['C', 'X']))
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            case 'Z':
                // chinese pinyin e.g. 'zhao'
                if ($original.substr($current + 1, 1) === 'H') {
                    $primary = $primary + 'J';
                    $secondary = $secondary + 'J';
                    $current = $current + 2;
                    break;
                } else if (string_at($original, $current + 1, 2,
                    ['ZO', 'ZI', 'ZA'])
                    || (Slavo_Germanic($original)
                        && (($current > 0)
                            && $original.substr($current - 1, 1) !== 'T'))) {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'TS';
                } else {
                    $primary = $primary + 'S';
                    $secondary = $secondary + 'S';
                }

                if ($original.substr($current + 1, 1) === 'Z')
                    $current = $current + 2;
                else
                    $current = $current + 1;
                break;

            default:
                $current = $current + 1;

        } // end switch

        // printf("<br>$original:    '%s'\n", $original);
        // printf("<br>$current:    '%s'\n", $current);
        // printf("<br>  $primary:   '%s'\n", $primary);
        // printf("<br>  $secondary: '%s'\n", $secondary);

    } // end while

    $primary = $primary.substr(0, 4);
    $secondary = $secondary.substr(0, 4);

    if ($primary === $secondary) {
        $secondary = null;
    }

    return {
        primary: $primary,
        secondary: $secondary,
    };

}; // end of function MetaPhone

/*=================================================================*\
  # Name:   string_at(string, start, length, list)
  # Purpose:  Helper function for double_metaphone( )
  # Return:   Bool
\*=================================================================*/

function string_at($string, $start, $length, $list) {
    if (($start < 0) || ($start >= $string.length)) {
        return 0;
    }

    for (let $i = 0, $len = $list.length; $i < $len; $i++) {
        if ($list[$i] === $string.substr($start, $length)) {
            return 1;
        }
    }

    return 0;
}

/*=================================================================*\
  # Name:   is_vowel(string, pos)
  # Purpose:  Helper function for double_metaphone( )
  # Return:   Bool
\*=================================================================*/

function is_vowel($string, $pos) {
    return /[AEIOUY]/.test($string.substr($pos, 1));
}

/*=================================================================*\
  # Name:   Slavo_Germanic(string, pos)
  # Purpose:  Helper function for double_metaphone( )
  # Return:   Bool
\*=================================================================*/

function Slavo_Germanic($string) {
    const $result = /W|K|CZ|WITZ/.test($string);
    return $result;
}
