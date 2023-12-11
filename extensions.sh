#!/bin/zsh

# Function to list file extensions and their counts
list_file_extensions() {
  local directory=$1

  # Use fd to list all files, awk to extract extensions, sort and count
  fd . "$directory" -t f -x echo {/} | awk -F. '{if (NF>1) print $NF}' | sort | uniq -c
}

# Main function
main() {
  local target_directory=$1

  # Call function with the target directory
  list_file_extensions "$target_directory"
}

# Execute main function with the specified directory
main "/Users/eberry" # replace with your directory path
