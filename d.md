## dirman - CLI Tool for Comparing Folders

**dirman** is a command-line tool designed to help you quickly identify which folders exist in one directory but not the other. That's it.

### Installation

Prerequisites: Node.js version 18 or later must be installed on your system.

To install dirman globally, run:

```bash
yarn global add dirman
```

### Usage

```bash
Usage: dirman <folder1> <folder2> [options]
```

**Arguments:**

* `<folder1>`: Path to the first directory.
* `<folder2>`: Path to the second directory.

**Options:**

* `-h, --help`: Display help information.
* `-f, --format`: Output format. Currently supports only `notInFolder2`. (Default: `notInFolder2`)

**Example:**

```bash
dirman /path/to/folder1 /path/to/folder2
```

This command will compare the contents of `/path/to/folder1` with `/path/to/folder2` and display a list of files that exist in `/path/to/folder1` but not in `/path/to/folder2`. Comparison method is via xxhash3.
