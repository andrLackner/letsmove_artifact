# Aptos Benchmark

This folder contains the dataset used for the Aptos benchmark described in the paper.

## Structure

```
├── aptos_benchmark
    ├── benchmark          <-- Look here for benchmark data
    │   ├── aptos
    │   ├── candidates
    │   ├── no_source
    │   ├── trivial
    │   └── unsupported
    ├── benchmark_gen.py    <-- Generate the full benchmark yourself
    ├── get_benchmark.py    <-- Get a single module
    ├── module_accounts.csv <-- List of all considered accounts
    └── README.md           <-- You are HERE :-)
```

The benchmarks themselves are located in the `benchmark` folder, which contains the following five subfolders:

1. `aptos`: Contains all modules that rely on Aptos-specific libraries.
2. `candidates`: Includes the full set of modules considered in the benchmark.
3. `no_source`: Contains modules for which the source code is not publicly available. These modules are represented by empty files.
4. `trivial`: Contains modules deemed trivial based on the small size of their source code.
5. `unsupported`: Includes modules that provide source code, are not trivial, and do not depend on Aptos libraries, but are unsupported due to compiler limitations.

All files within each subfolder follow a consistent naming convention:

```
[ACCOUNT_ID]_[MOVE_NAME].[EXT]
```

Unfortunately, for most modules, we could not find a license that explicitly permits redistribution of the source code. In such cases, the original code has been replaced with a `.txt` file—named according to the established convention—that provides instructions for manually downloading the source.
For modules with licenses that allow redistribution, the source code is included as a compressed file using the `Zstandard` format (`.zst`).

Each subfolder (except `no_source`) contains a `grouped` directory, which in turn includes multiple subdirectories. Each of these subdirectories is named after an `md5` checksum and contains all modules that share that checksum.
Note that this grouping is based on the original content of the files, so **re-generating the same structure is only possible after downloading all missing source files**, as the checksums depend on the original file contents.

Finally, the `pick_20` subfolder within the candidates directory contains the selected set of benchmarks used in the evaluation.

## Scripts

> **Note:** We assume that you have `python3` installed along with the `requests` package, as well as the `zstd` command-line utility. If not, we provide a `shell.nix` file to help you reproduce our environment. If you have `nix` installed, simply run `nix-shell` to enter an environment where all our scripts can be executed.

### `benchmark_gen.py`

Using this script, you can regenerate the entire benchmark dataset yourself, including all available source code. The script iterates over all accounts listed in `module_accounts.csv`, retrieves account information via the public API of [aptoscan.com](aptoscan.com), extracts each module's source code, and stores it in compressed form using the Zstandard format (`.zst`).

This script generates the following folder structure in your current working directory to store the downloaded source files:

```
benchmark
├── aptos
├── candidates
├── no_source
├── trivial
└── unsupported
```

#### Usage:

`python3 [PATH_TO_SCRIPT/]benchmark_gen.py`

#### Before running the script:

You must set the `CONTACT_INFO` environment variable:

```bash
$ export CONTACT_INFO="thatisme@me.com"
```

We **strongly recommend** providing valid contact information, as it is included in the User-Agent header of each HTTP request. This allows the API provider to contact you if repeated requests that are made by the script cause any issues on their site. To be considerate, the script includes a one-second delay after each request. **We advise keeping this timeout in place!**

At the time of writing, and to the best of our knowledge, `aptoscan.com` does not impose any restrictions on access to their data. However, this may change in the future. If you are unable to retrieve the benchmark data from their site, please feel free to contact the authors of this paper for full access. **Access is granted strictly for scientific purposes only!**

#### Bookmarks:

At each iteration, the script outputs the current `bookmark`:

```sh
-> Writing to benchmark/...
-> Compressing benchmark/...
Bookmark=10 # <-- THIS HERE
```

These values increment with each processed account. If you want to resume the script from a specific bookmark (for example, if you previously ran the script up to a certain point but had to stop), you can set the `BOOKMARK` environment variable to the desired starting value. For example:

```sh
export BOOKMARK=10
```

### `get_benchmark.py`

You can also download individual modules of interest. Each module’s `.txt` file includes a command to run this script specifically for downloading that module.

This script functions similarly to `benchmark_gen.py` but downloads only a single specified module.
Unlike `benchmark_gen.py`, it stores the compressed source file in the current working directory and does not apply any filtering.

#### Usage

`python3 [PATH_TO_SCRIPT/]get_benchmark.py ACCOUNT_ID MODULE_NAME`

### `md5group.sh`

This is a small helper script, with a copy located in each subfolder of benchmark (except `no_source`).
The script computes the `md5` checksum of the input file and copies the file to the corresponding folder `grouped/[MD5_HASH]/[FILE]`. If the grouped folder does not exist, it will be created automatically.
