# PHPUnit Testing in Infohub

This directory contains PHPUnit tests for the Infohub project.

## Installation

PHPUnit is included as a development dependency in composer.json. To install it, run:

```bash
composer install
```

## Directory Structure

- `tests/Unit/`: Contains unit tests that test individual components in isolation
- You can add more test directories as needed (e.g., `tests/Integration/`, `tests/Feature/`)

## Running Tests

You can run tests using the following composer commands:

```bash
# Run all tests
composer test

# Run tests with code coverage report
composer test-coverage
```

Or directly using the PHPUnit binary:

```bash
./vendor/bin/phpunit
```

## Writing Tests

1. Create a new PHP file in the appropriate test directory
2. Name your test class with a "Test" suffix (e.g., `UserTest.php`)
3. Extend the `PHPUnit\Framework\TestCase` class
4. Write test methods that start with "test" or use the `@test` annotation

Example:

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function testExample()
    {
        $this->assertTrue(true);
    }
}
```

## Code Coverage

To generate a code coverage report, run:

```bash
composer test-coverage
```

This will create a coverage report in the `coverage` directory. Open `coverage/index.html` in your browser to view it.

## Configuration

PHPUnit configuration is in the `phpunit.xml.dist` file in the project root.