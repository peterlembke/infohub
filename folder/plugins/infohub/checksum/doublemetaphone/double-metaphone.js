/**
 * 
 *
 * @package     Infohub
 * @subpackage  
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */

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
