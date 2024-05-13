# dirman
![](./dirman.jpg)

**dirman** is a command-line tool designed to help you quickly identify which folders exist in one directory but not the other. That's it.

**NOW WITH Features!:**

- Compares files based on hash, size, or basename.
- Flexible matching conditions: require all files to match (default) or any file.

### Installation

Node.js v18 or later. To install dirman globally: `yarn global add dirman`

**Usage:**

```bash
dirman <directory1> <directory2> [options]
```

**Options:**

| Option | Alias | Description | Default | Type |
|---|---|---|---|---|
| `-h`, `--help` |  | Shows this help message. | | boolean |
| `-c`, `--compare` |  | Comparison method (comma-separated for multiple). | `hash` | string (array) | 
| `-m`, `--match` |  | Matching condition. | `all` | string |

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

### thank.

👤 **ɛʟʟɨօȶ b  =^._.^= ∫ <elliot@email.gd>**

* Website: elliot.computer