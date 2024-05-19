#!/bin/bash

# Orginal file: https://github.com/jacobhumston/sxcu.api/blob/main/build.bash

# Define the nme directory.
nme_directory="$current_directory/node_modules/.bin"
if [[ -n "${NMEDIR}" ]]; then
    nme_directory="${NMEDIR}"
fi

# Function for formatted echo.
function formatted_echo() {
    echo "> $1"
}

# Node Module Execute (nme) function.
# The module executable location can be changed with the NMEDIR environment variable.
function nme() {
    if [ -f "./$nme_directory/$1" ]; then
        formatted_echo "Executing: $*"
        "./$nme_directory/"$*
    else
        formatted_echo "FATAL!: The executable './$nme_directory/$1' was not found!"
        formatted_echo "Note: The location can be changed using the NMEDIR environment variable."
        exit
    fi
}

# Function to delete a directory.
function delete_directory() {
    # Check for the directroy, execute accordingly.
    if [ -d "$1" ]; then
        formatted_echo "Deleting the '$1' directory..."
        rm -r "$1"
    else
        formatted_echo "The directory '$1' does not exists, skipping deletion..."
    fi
}

# Build
formatted_echo "Building..."
delete_directory "build/"
nme tsc --module commonjs --outDir build/commonjs/ --declaration false --declarationMap false --esModuleInterop true --noEmitOnError true
echo "{\"type\": \"commonjs\"}" >build/commonjs/package.json
nme tsc --module es2022 --outDir build/esm/ --declarationDir build/types/ --declaration true --declarationMap true --noEmitOnError true
echo "{\"type\": \"module\"}" >build/esm/package.json