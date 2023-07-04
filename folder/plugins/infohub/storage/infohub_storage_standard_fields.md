# Infohub Storage - Standard fields

Today you can store a data object as a json encoded string, in a key value storage.
There are no standard fields today. The plugin decide what fields should be there and what names to use.
That makes the rendering of dropdowns unique. That makes the linking between posts problematic.

This below might become something in the code, or it will be discarded. 

## Fields

### Mandatory fields

They are applied to the object you want to save.
The checksum is calculated before save. Will only save if checksums are different.
All fields have validators.

* hub_uid - string with the infohub universal id. Populated if empty.
* alias - String you can have as an alias for this post. Only popular posts have an alias.
* title - String 96 characters
* note - Medium note 16 Kb
* created_at - date and time string "2022-10-20 20:20:20". Populated if empty.
* updated_at - date and time string "2022-10-20 20:20:20". Updated on save if checksum is different.
* checksum - MD5 string based on all fields data excluding `checksum`, `updated_at`. Field names in ascending order. Pipe separator.

### Optional fields

Standard names for fields that you can add if you need them.
All fields have validators.

* {link_name}_link - Link between objects for a plugin and user. Example: second_track_link = "track/{hub_uid}", full path "{plugin_name}/{user_uid}/track/{hub_uid}"
* {date_name}_date - A short date string "2022-10-20". Example names: date, event_date, training_date
* {time_name}_time - A time string "20:20:20". Example names: time, exercise_time, lap_time
* {date_time name_}_at - date and time string "2022-10-20 20:20:20". Example: date_at, event_at, training_at
* {color_name}_color - A color code in hex "A0B1C2". Example names: shorts_color, shoe_color 
* is_enabled (boolean) Default true. If field does not exist it is default true.
* language_code - Example: "[sv](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-[SE](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)"
* latitude - GPS latitude, float: Example: 23.0
* longitude - GPS longitude, float. Example 54.0
* {ip_name}_ip - An IPv4 string. Example: "123.123.123.123"
* {ip_name}_ip6 - An IPv6 string.

### Calculated fields

These fields are automatically calculated and populated if they exist in the table.
You can then use them in selections and calculations. 

** Date fields **

Populated from date_at if empty.

* date - Only the date string "2022-10-20".

Populated from date

* calc_date_month_number - A number 1-12.
* calc_date_week_number - A number 1-52.
* calc_date_week_day - A number 0-6.
* calc_date_day_of_year - A number 1-366.

** Color fields **

Populated from color

* calc_color_red - A number 0-255. 
* calc_color_green - A number 0-255.
* calc_color_blue - A number 0-255.
* calc_color_hue_degree - A number.
* calc_color_saturation_percent - A number.
* calc_color_lightness - A number.

** Time fields ** 

Populated from date_at if empty.

* time - only a time string in 24h format. 22:00:12.
 
Populated from time

* calc_time_h - Time in hours as a float
* calc_time_m - Time in minutes as a float
* calc_time_s - Time in seconds as a float
