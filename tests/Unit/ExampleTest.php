<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicExample()
    {
        $this->assertTrue(true);
    }
    
    /**
     * Example of testing a string.
     *
     * @return void
     */
    public function testString()
    {
        $string = 'Hello, Infohub!';
        $this->assertEquals('Hello, Infohub!', $string);
    }
    
    /**
     * Example of testing an array.
     *
     * @return void
     */
    public function testArray()
    {
        $array = ['foo', 'bar'];
        $this->assertCount(2, $array);
        $this->assertContains('foo', $array);
    }
}