#!/bin/bash
#
# Example demonstrating the use of OSM Overpass API to request data for a golf GPS.


overpassApiUrl="http://overpass-api.de"

my_lat=44.2450803
my_lon=-76.4488947

run_query() {
    query=$1
    overpassQuery=$overpassApiUrl"/api/interpreter?data=\[out:json\];"$query
    echo $overpassQuery
    curl $overpassQuery
}

get_nearby_golfcourses() {
    lat=$1
    lon=$2
    query="way(around:100.0,"$lat","$lon")\[leisure=golf_course\];out%20tags;"
    echo $query
}

get_nearby_hole() {
    golfcourse_name=$1
    # TODO
}

get_distance_to_pin() {
    golfcourse_name=$1
    hole_number=$2
    # TODO
}

# 1. Confirm the golf course you are at.
query=`get_nearby_golfcourses $my_lat $my_lon`
run_query $query

# 2. Confirm the hole you are on.
query=`get_nearby_hole`
run_query $query

# 3. How far are you from the pin.
query=`get_distance_to_pin`
run_query $query
