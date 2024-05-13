# dirman
[![Version](https://img.shields.io/npm/v/dirman.svg)](https://www.npmjs.com/package/dirman)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
[![License: The Unlicense](https://img.shields.io/badge/License-The Unlicense-yellow.svg)](#)
![](./dirman.jpg)

> A CLI tool for the specfic function of showing what folders one directory has the the other does not.

**dirman** is a command-line tool designed to help you quickly identify which folders exist in one directory but not the other. That's it.

### Installation

Prerequisites: Node.js v18 or later. To install dirman globally, run:

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

Comparison method is via file contents & xxhash3.

## it me

👤 **ɛʟʟɨօȶ b  =^._.^= ∫ <elliot@email.gd>**

* Website: elliot.computer