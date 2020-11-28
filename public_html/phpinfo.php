<?php
/**
 * Used separately to see the php information
 *
 * @package     Infohub
 * @subpackage  root
 */

declare(strict_types=1);
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

/**
 * Used separately to see the php information
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-11-21
 * @since       2015-11-15
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/doc/core/core.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
    phpinfo();
