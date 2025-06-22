#!/bin/bash

# Script to update the headers of all JS files in the plugins directory

# Function to update the header of a single file
update_header() {
    local file=$1
    echo "Processing file: $file"

    # Check if the file already has the new header format
    if grep -q "@package     Infohub" "$file"; then
        echo "File already has the new header format. Skipping."
        return
    fi

    # Extract information from the _Version function
    local title=$(grep -A 15 "const _Version" "$file" | grep "'title'" | sed -E "s/.*'title':\s*'([^']+)'.*/\1/")
    local note=$(grep -A 15 "const _Version" "$file" | grep "'note'" | sed -E "s/.*'note':\s*'([^']+)'.*/\1/")
    local class_name=$(grep -A 15 "const _Version" "$file" | grep "'class_name'" | sed -E "s/.*'class_name':\s*'([^']+)'.*/\1/")
    local since=$(grep -A 15 "const _Version" "$file" | grep "'since'" | sed -E "s/.*'since':\s*'([^']+)'.*/\1/")

    # If title is empty, use class_name as title
    if [ -z "$title" ]; then
        title=$class_name
    fi

    # Create the new header
    local new_header
    if [ -n "$title" ] && [ -n "$note" ]; then
        new_header=$(cat << EOF
/**
 * $title
 * $note
 *
 * @package     Infohub
 * @subpackage  $class_name
 * @since       $since
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
EOF
)
    elif [ -n "$title" ]; then
        new_header=$(cat << EOF
/**
 * $title
 *
 * @package     Infohub
 * @subpackage  $class_name
 * @since       $since
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
EOF
)
    elif [ -n "$note" ]; then
        new_header=$(cat << EOF
/**
 * $note
 *
 * @package     Infohub
 * @subpackage  $class_name
 * @since       $since
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
EOF
)
    else
        new_header=$(cat << EOF
/**
 * $class_name
 *
 * @package     Infohub
 * @subpackage  $class_name
 * @since       $since
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
EOF
)
    fi

    # Create a temporary file
    local temp_file=$(mktemp)

    # Replace the old header with the new one
    sed -E '1,/\*\//d' "$file" > "$temp_file"
    echo "$new_header" > "$file"
    cat "$temp_file" >> "$file"
    rm "$temp_file"

    echo "Header updated successfully."
}

# Process all JS files in the plugins directory
find folder/plugins/ -name "*.js" | while read file; do
    update_header "$file"
done