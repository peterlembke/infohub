<?php
declare(strict_types=1);
/*
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

/**
 * Handle the session
 * Folder "session" contain date folder where session files exist
 * Each midnight the folder are deleted. You lose you login.
 * You will quickly get logged in again the next day since you have your login credentials in the client.
 * This is a simple solution.
 * Class session
 */
class session
{
    const INFOHUB_SESSION = 'INFOHUB_SESSION';
    protected $sessionData;

    /**
     * index.php and infohub.php call this function to handle the sessions
     * @param bool $createMissingSession
     * @return bool
     */
    public function isAllOk($createMissingSession = false): bool
    {
        $sessionCode = $this->getSessionCode();
        if (empty($sessionCode)) {
            if ($createMissingSession) {
                $this->startSession(); // You get the new sessionCode in a cookie
                return true;
            }
            return false;
        }

        $valid = $this->sessionValid($sessionCode);
        if ($valid === false) {
            $this->removeSession($sessionCode);
            return false;
        }

        $canDoRequest = $this->canDoRequest($sessionCode);
        if ($canDoRequest === false) {
            return false;
        }

        $this->addBanTime(1);

        return true;
    }

    /**
     * This is the default session data
     */
    protected function defaultSessionData()
    {
        return array(
            'session_code' => '',
            'fingerprint' => '',
            'session_start' => 0.0,
            'banned_until' => 0.0,
            'ban_reason' => '',
            'message_count' => 0,
            'login_data' => array(),
            'custom_data' => array()
        );
    }

    /**
     * Add ban time in seconds to banned_until
     * Save to session data and update the cookie banned_until
     * @param int $seconds
     * @return bool
     */
    public function addBanTime($seconds = 0): bool {
        // @todo continue here
    }

    /**
     * Check if the session cookie contain a valid session code
     * If code has a file then open that file and check that the client fingerprint match
     * Also check that the session date is valid and that we are not banned.
     * @param string $sessionCode
     * @return bool
     */
    protected function sessionValid($sessionCode = ''): bool
    {
        $sessionDataExist = $this->doesSessionDataExist($sessionCode);
        if ($sessionDataExist === false) {
            return false;
        }

        $sessionData = $this->getSessionData($sessionCode);
        if ($sessionData['session_code'] !== $sessionCode) {
            return false;
        }

        if (empty($sessionData['fingerprint'])) {
            return false;
        }
        if (empty($sessionData['session_start'])) {
            return false;
        }
        if (empty($sessionData['banned_until'])) {
            return false;
        }

        $currentTime = $this->getMicroTime();
        if ($sessionData['session_start'] > $currentTime) {
            return false;
        }

        $this->sessionData[$sessionCode] = $sessionData;

        return true;
    }

    /**
     * Check if the request can be done.
     * We can but it is not required to run sessionValid() first to validate the session.
     * @param string $sessionCode
     * @return bool
     */
    protected function canDoRequest($sessionCode = ''): bool
    {
        $sessionCode = $this->getSessionCode();
        if (empty($sessionCode)) {
            return false;
        }
        $sessionData = $this->getSessionData($sessionCode);

        $fingerprint = $this->getFingerprint();
        if ($sessionData['fingerprint'] !== $fingerprint) {
            return false;
        }

        $currentTime = $this->getMicroTime();
        if ($sessionData['banned_until'] > $currentTime) {
            return false;
        }

        return true;
    }

    /**
     * Create a session and write data to the session file
     */
    protected function startSession(): void
    {
        $currentTime = $this->getMicroTime();
        $sessionCode = $this->createSessionCode($currentTime);
        $fingerprint = $this->getFingerprint();

        $sessionData = array(
            'session_code' => $sessionCode,
            'fingerprint' => $fingerprint,
            'session_start' => $currentTime,
            'banned_until' => $currentTime + 1.0,
            'login_data' => array(),
            'custom_data' => array()
        );

        $this->putSessionData($sessionCode, $sessionData);
        $this->setSessionCode($sessionCode);
    }

    /**
     * Get session code from cooke if cookie exist
     * @return string
     */
    protected function getSessionCode(): string
    {
        $sessionCode = '';
        if (isset($_COOKIE[self::INFOHUB_SESSION])) {
            $sessionCode = $_COOKIE[self::INFOHUB_SESSION];
        }
        return $sessionCode;
    }

    protected function setSessionCode($sessionCode): void
    {
        $currentTime = $this->getMicroTime();
        $time24h = (int) $currentTime + 24 * 60 * 60;
        setcookie(self::INFOHUB_SESSION, $sessionCode, $time24h);
    }

    /**
     * Create a session code based on time and random number
     * @param float $microTime
     * @return string
     * @throws Exception
     */
    protected function createSessionCode($microTime = 0.0): string
    {
        if (empty($microTime)) {
            $microTime = $this->getMicroTime();
        }
        $randomNumber = random_int(0, PHP_INT_MAX); // PHP >= 7
        $result = $microTime . '_' . $randomNumber;
        $result = str_replace('.', '_', $result);

        return $result;
    }

    /**
     * Check if file exist and contain any data
     * @param $sessionCode
     * @return bool
     */
    protected function doesSessionDataExist($sessionCode): bool
    {
        $filePath = $this->getFilePath($sessionCode);
        if (file_exists($filePath) === false) {
            return false;
        }

        if (filesize($filePath) === 0) {
            return false;
        }

        return true;
    }

    /**
     * Load the session data from file
     * Makes sure the data contain the default fields with the right datatype
     * @param $sessionCode
     * @return array
     */
    protected function getSessionData($sessionCode): array
    {
        if (isset($this->sessionData[$sessionCode]) === true) {
            return $this->sessionData[$sessionCode];
        }

        $filePath = $this->getFilePath($sessionCode);
        $contents = file_get_contents($filePath);

        $sessionData = array();
        if (empty($contents) === false) {
            $sessionData = json_decode($contents);
        }
        $sessionData = $this->_Default($this->defaultSessionData(), $sessionData);

        // I do not save the $sessionData to the cache here. Instead that is done in sessionValid()
        return $sessionData;
    }

    /**
     * Write session data to file.
     * Also makes sure that the required fields are in the data before save.
     * @param $sessionCode
     * @param $sessionData
     * @return bool
     */
    protected function putSessionData($sessionCode, $sessionData): bool
    {
        $filePath = $this->getFilePath($sessionCode);

        $sessionData = $this->_Default($this->defaultSessionData(), $sessionData);
        $contents = json_encode($sessionData, JSON_PRETTY_PRINT);

        $charactersWritten = file_put_contents($filePath, $contents);

        $response = false;
        if (is_integer($charactersWritten)) {
            $response = true;
        }

        return $response;
    }

    /**
     * Remove a session by its sessionCode.
     * @param $sessionCode
     * @return bool
     */
    protected function removeSession($sessionCode): bool
    {
        $filePath = $this->getFilePath($sessionCode);
        $response = unlink($filePath);

        $currentTime = $this->getMicroTime();
        $time24hBack = (int) $currentTime - 24 * 60 * 60;
        setcookie(self::INFOHUB_SESSION, '', $time24hBack);
        unset($_COOKIE[self::INFOHUB_SESSION]);

        return $response;
    }

    /**
     * Get todays date in format yyyymmdd 20191130
     * @return string
     */
    protected function getDate(): string {
        return date('Ymd');
    }

    /**
     * Get seconds since EPOC with decimals
     * @return float
     */
    protected function getMicroTime(): float {
        return microtime(true);
    }

    /**
     * Get the path to a session file
     * @param $sessionCode
     * @return string
     */
    protected function getFilePath($sessionCode): string
    {
        $path = SESSION . DS . $this->getDate() . DS . $sessionCode . '.json';

        return $path;
    }

    /**
     * Delete old sessions by deleting old folders
     */
    protected function deleteOldSessions(): void
    {
        $today = $this->getDate();
        $folders = glob(SESSION, GLOB_ONLYDIR);
        foreach ($folders as $folderName) {
            if ($folderName === '.' || $folderName === '..') {
                continue;
            }
            if ($folderName === $today) {
                continue;
            }

            // Delete all files in this folder
            array_map('unlink', glob($folderName . "/*.json"));

            // Delete the empty folder
            rmdir($folderName);
        }
    }

    /**
     * Put together a fingerprint from the information we have of the visitor.
     * Hash the fingerprint
     * @return string
     */
    protected function getFingerprint(): string
    {
        $ip = $_SERVER['REMOTE_ADDR'];
        $encoding = $_SERVER['HTTP_ACCEPT_ENCODING'];
        $language = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
        $accept = $_SERVER['HTTP_ACCEPT'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        $host = $_SERVER['HTTP_HOST'];

        $fingerPrint = md5($ip . $encoding . $language . $accept . $userAgent . $host);

        return $fingerPrint;
    }

    /**
     * Makes sure you get all default variables with at least default values, and the right data type.
     * The $default variables, You can only use: array, string, integer, float, null
     * The $in variables, You can only use: array, string, integer, float
     * @example: $in = _Default($default,$in);
     * @version 2016-01-25
     * @since   2013-09-05
     * @author  Peter Lembke
     * @param $default
     * @param $in
     * @return array
     */
    final protected function _Default(array $default = array(), array $in = array()): array
    {
        if (is_array($default) === false and is_array($in) === true) {
            return $in;
        }
        if (is_array($default) === true and is_array($in) === false) {
            return $default;
        }

        // On this level: Remove all variables that are not in default. Add all variables that are only in default.
        $answer = array_intersect_key(array_merge($default, $in), $default);

        // Check the data types
        foreach ($default as $key => $data) {
            if (gettype($answer[$key]) !== gettype($default[$key])) {
                if (is_null($default[$key]) === false) {
                    $answer[$key] = $default[$key];
                }
                continue;
            }
            if (is_null($default[$key]) === true and is_null($answer[$key]) === true) {
                $answer[$key] = '';
                continue;
            }
            if (is_array($default[$key]) === false) {
                continue;
            }
            if (count($default[$key]) === 0) {
                continue;
            }
            $answer[$key] = $this->_Default($default[$key], $answer[$key]);
        }

        return $answer;
    }

}

/** @var session $session */
$session = new session();
