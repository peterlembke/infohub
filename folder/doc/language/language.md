# Language
This is a side project where I define a new language the way I think a language should be.

# Goals
The goal with the language is to be very easy to learn. When you see code you will instantly recognize things you learned from school in math, english and logic.

* All code is in english.
* The operators come from math and are used in the same way.
* Symbols are not used. Instead use english.
* Python syntax with indent is used.
* Infohub syntax is used: plugin, cmd functions, internal functions.

# Variable
Variables are declared like in Javascript with const or let and work exactly as in Javascript.

Example: `let $myVariable = 'Hello'` 

## Variable type
You have string, number and array (associative).
You do not have boolean, null, data objects, numbered arrays.

examples:
```
let $myVariable = 'Hello'
let $myVariable = 123.45

let $myVariable = array
    my_data = 123.45
    more_data = array
        even_more = 2019
```
### Numbers
Numbers always have decimals and a decimal point

### Strings
Strings are wrapped with ' and are stored as UTF-16

# If statement
The if statement look like this:
```
if $myVariable = 'Hello'
    internal_Cmd
        func=ViewText
        text=$myVariable
        
if $myVariable <> 'Hello'
    internal_Cmd
        func=ViewText
        text='Standard text'
```
## Compare with if
The = in if statements always compare.
You can also compare with: < less than, > larger than, <> different from, >= larger or equal, <= less or equal.

### Compare numbers
Comparing numbers are easy but be aware of the decimals
`2.0 = 1.99999999999999' they are not equal but almost. You can use:

`_Round(2.0, 5) = _Round(1.99999999999999, 5)
That would round the numbers with 5 decimals and then compare. 

### Compare strings
Strings can be used with all the operators to compare two strings alphabetically without caring about the letter case.  
`if 'abc' < 'c'`
It is about the position and the weight of the letter.

### Compare date time
Date time strings are in ISO8601 format like this: `2005-08-14T16:13:03+0000`
Comparing datetime is a simple string comparison.

Seconds since EPOC is another time format with seconds since midnight 1970-01-01.
It is a number with decimals.

## Compare with ternary operators
You do not have any ternary operators because they can be substituted with if statements. 
https://en.wikipedia.org/wiki/%3F:

## else
else, elseif, endif - does not exist. Use if instead.

# Boolean expressions and operators
There are no boolean data type. The IF statements are boolean since they can be fulfilled or not.
In other languages like Javascript and PHP you have: and, &&, or, || and others.
You have if statements in each other instead of AND, like this:
```
if $myVariable = 'Hello' or $myVariable = 'World'
    if $myOtherVariable = 'true'
        internal_Cmd
            func=ViewText
            text='myVariable is Hello or World and my other variable is true'
```            
PHP example:
`if ($a === 1 and $b === 2) or ($a === 4 and $b === 5) {`

Our example in this language:

```
$result = 'false'

if $a = 1
    if $b = 2
        $result = 'true'
    
if $a = 4
    if $b = 5
        $result = 'true'
        
if $result = 'true
    internal_Cmd
        func=ViewText
        text='a=1 and b=2 OR a=4 and b=5'
``` 
# Loop
There are only one type of loop.
 
foreach $key in $myArray
    ...

# plugin (class)
You group functions in plugins.
```
plugin mydomainname_pluginname_childname_grandchildname_andmore
    'step' = 'step_start'
    'data' = 'Hello'
```
# function
You define functions like this

```
function internal_MyFunction
    ...

function my_public_function
    ...
```

## Sub call to public function
You call a public function like this:    
```
return _SubCall
    to = array
        node=this
        plugin=mydomainname_mypluginname
        function=my_public_function
    data = array
        text = 'My text'
    data_back = array
        step = 'step_handle_response'
```
A plugin can call its children, siblings and level 1 plugins on the same node.
Level 1 plugins can call level1 plugins on other nodes.

## Sub call to internal function
You call an internal function like this:
```
internal_Cmd
    function = ViewText
    text = 'My text'
```
## Function return value
You can do sub calls with return _SubCall.
You can return values to the caller.
```
return array
    answer = 'true'
    message = 'Here are the md5 checksum'
    md5 = '49t7f976rb976r976rb'
```    
# Math (plugin)
Use the function calls 
* `_Sub($number1, $number2)`
* `_Add($number1, $number2)`
* `_Mul(number1, $number2)`
* `_Div($number1, $number2)`

# String (plugin)

```
$mySubstring = _SubString
    string=$myStringVariable
    start=$start
    length=length

$myNumber = _StringToNumber
    string = $myString

$myString = _NumberToString
    number = $myNumber

$myVariable = _StringToLowerCase
    string = $myString
    
$myVariable = _StringLength
    string = $myString
    
$myVariable = _SubStringPosition
    string = $myString
    find = $findThis
    from = 'right'
    start_position = 4
```
    
# Time (plugin)

```
$seconds = _DateTimeToSeconds
    datetime = $myDate

$dateTime = _SecondsToDateTime
```
    
# Array
You get all incoming variables in the $in array.
You send all parameters to the commands with arrays.
You return an array in your functions.

```
let $myArray = array
    my_data = 'hello'
    my_other_data = 'world'
    
$myData = _GetData
    name' = 'my_data',
    default = '',
    data = $myArray,
    split = '/'
```
    
# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2019-07-23 by Peter Lembke  
Changed 2019-07-23 by Peter Lembke  
