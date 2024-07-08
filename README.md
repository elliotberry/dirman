# dirman
![Static Badge](https://img.shields.io/badge/technically_passes_as_software-blue)

![eerer](https://img.shields.io/github/package-json/v/elliotberry/dirman?style=plastic
)

![](./dirman.jpg)

`dirman` is a command-line tool designed to help you quickly identify which files exist in one directory but not another.

Use case: I have a lot of versions of folder archives, so this helps with this, I guess.

*** **NOW WITH FEATURES!:** ***

- Compares files based on hash, size, or basename.
- Flexible matching conditions: require all files to match (default) or any file.

### Installation

Node.js v18 or later. To install dirman globally: `yarn global add dirman`

**Usage:**

```
dirman <directory1> <directory2> [options]
```

**Options:**

| Short Option | Alias | Description | Default | Type | Notez
|---|---|---|---|---|---|
| `-h` | `--help` | Shows this help message. | | boolean | true or false, obviously
| `-c` | `--compare` | Comparison method (comma-separated for multiple). | `hash` | string (array) | options are: `hash`, `basename`, and `size`. 
| `-m` | `--match` | Matching condition. | `all` | string (enum) | `all` or `any`

**Comparison Methods:**

- `hash`: Compares file content based on xxhash3.
- `size`: Compares file size in bytes.
- `basename`: Compares file names (without path).

**Match Conditions:**

- `all`: All comparison methods must match.
- `any`: Any comparison methods may match.


**Example:**

```bash
dirman /path/to/folder1 /path/to/folder2 -c hash,size -m any
```

This will find any files in `/path/to/folder1` that either have a different hash or size compared to files in `/path/to/folder2`.

thank.

i am ``**ɛʟʟɨօȶ b  =^._.^= ∫ <elliot@email.gd>**
 / [elliot.computer](https://elliot.computer)