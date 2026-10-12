# dirman

`dirman` is a command-line tool for finding files that exist in one directory tree but not another.

Use case: comparing versions of folder archives to see what is unique.

## Install

Node.js v22.12 or later.

```bash
npm install -g dirman
```

## Usage

```
dirman <directory1> <directory2> [options]
```

By default, files are matched by **content** (xxhash3). A file in directory 1 is unique if no file in directory 2 has the same hash, regardless of path or name.

```bash
dirman /path/to/folder1 /path/to/folder2
```

Prints relative paths that exist in `folder1` but have no content match in `folder2`.

## Options

| Option | Alias | Description | Default |
| --- | --- | --- | --- |
| `--help` | `-h` | Show help | |
| `--compare` | `-c` | Comparison methods: `hash`, `size`, `basename`. Repeat the flag or comma-separate. | `hash` |
| `--match` | `-m` | `all` (every selected method must match) or `any` (any method may match) | `all` |
| `--by` | | `content` (file exists anywhere in the other tree) or `path` (same relative path) | `content` |
| `--only` | | Which unique list to print: `1`, `2`, or `both` | `1` |
| `--json` | | Print a JSON report | `false` |
| `--ignore` | `-i` | Glob or basename patterns to skip in both trees | |
| `--concurrency` | | Max parallel file hashes | CPU count |
| `--verbose` | `-v` | Verbose logging | `false` |

### Comparison methods

- `hash`: file content via xxhash3
- `size`: size in bytes
- `basename`: file name without directories

### Matching models

- `--by content` (default): a file matches if any counterpart in the other tree satisfies the compare predicates. Same bytes at a different path count as a match.
- `--by path`: pair files that share a relative path, then apply the compare predicates. Use this for tree diffs / changelog-style output.

## Examples

Content that exists in folder 1 but not folder 2:

```bash
dirman /path/to/folder1 /path/to/folder2
```

Same relative paths whose content changed:

```bash
dirman /path/to/folder1 /path/to/folder2 --by path
```

Match on hash or size:

```bash
dirman /path/to/folder1 /path/to/folder2 -c hash,size -m any
```

JSON, both sides, skip temp files:

```bash
dirman /path/to/folder1 /path/to/folder2 --json --only both --ignore '*.tmp'
```

## JSON shape

```json
{
  "directory1": "/abs/folder1",
  "directory2": "/abs/folder2",
  "by": "content",
  "compare": ["hash"],
  "match": "all",
  "onlyIn1": ["unique-a.txt"],
  "onlyIn2": ["unique-b.txt"]
}
```

---

ɛʟʟɨօȶ b  =^._.^= ∫ <elliot@email.gd> / [elliot.computer](https://elliot.computer)
