# Lets Move2EVM

This repository contains data and tools that help to compile and execute our concept implementation of an Move-to-Evm compiler which is based on [this implementation](https://github.com/move-language/move/tree/main/language/evm). For more information have a look at [our paper](https://zenodo.org/records/15591738).

In the remain part of this file we describe how to run our compiler to reproduce the data we have provided in the paper.

## Requirements

### Hardware

Our experiments should run on standard CPU-based systems based on both, x86 and ARM. We do recommend 8 GB RAM and at least 20 GB of free disk space.

### Operating Systems

All the experiments described here were tested on Ubuntu 24.04. Other systems most likely also work. Especially because we run our experiments inside a Docker container. However, adaption might be necessary.

## Docker

The compiler runs inside a docker container. We do recommend docker at version 27.5.1 or higher. For a detailed instruction on how to install docker we refer to the [offical documentation of docker](https://www.docker.com/get-started/).

## Nix

Parts of our experiments make use of the nix package manager. We do recommend version 2.18.1 or higher. We refer to [the official documentation](https://nixos.org/download/) for a detailed instruction on how to install the nix package manager.

We use nix for reproducing the environment necessary for building the Aptos benchmark. However, if you want to avoid installing nix you can also install dependencies manually:

- Zstandard CLI version 1.5.5 or higher
- Python 3.12.3 with the `requests` package enabled.

## Building the Docker Container

This repository includes a `Dockerfile` that can be used to build a docker image containing our compiler. To build the docker container, simply run the following command:

```bash
docker build -t mv2evm .
```

After that, you should be able to run a new docker container:

```bash
docker run --rm -e MOVE_COMPILER="IRM" -ti mv2evm bash
```

Inside the docker container, run

```bash
move build --arch ethereum --path PACKAGE_PATH
```

For examples on how packages should look like, have a look on examples inside the `evaluation` folder.

## Building the Aptos Benchmark

> **INFO:** If you just want to reproduce results of the paper, you can skip this section and have a look at the [Evaluation Section](#apots-benchmark-for-evaluation).

Change to the `aptos_benchmark` folder. This folder contains the dataset used for the Aptos benchmark described in the paper. This folder has the following structure:

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

### Apots Benchmark for Evaluation

In the [previous section](#building-the-aptos-benchmark) we have shown how to download the complete benchmark. However, for the experiments conducted in the paper we only need a small subset. These subset can be reproduced by executing the following command inside the nix-shell:

```
$> ./build_eval
```

Executing this script does three things: first, it download the necessary files; second it patches the downloaded files to provide additional information needed by the compiler; third, it copies the files in the respective folders of the `evaluation` folder.

A detailed instruction on how to run the experiments is given in the [Running the evaluation](#running-the-evaluation) section.

## Running the evaluation

We assume that you have already built the Docker container. If not, have a look [here](#building-the-docker-container) first. Furthermore, make sure that you have downloaded [the Aptos files for the evaluation](#apots-benchmark-for-evaluation) first.

### Running all experiments:

We first run all the experiments and run our evaluation on it later. The docker container contains all three compilers: the original, our adaption and the Solidity compiler.

Depending on which compiler we want to test, different test files have to be mounted. To simplify that process, the `attach.bash` script inside the `evaluation` folder can be used:

```
$> attach.bash <COMPILER> <DOCKER_IMAGE>
```

For `<COMPILER>` use `IRM` (our compiler) `ORIGINAL` (original compiler) or `SOL` (solidity). `<DOCKER_IMAGE>` refers to the name of the docker image. If you have [the previous steps](#building-the-docker-container) this should be `mv2evm`.

Now run `attach.bash` for each of the compilers and (in the shell that opens upon execution of `attach.bash`) execute the following command:

```
./evaluate.bash
```

The results of the experiments are than written in the folders `evaluation/irm`, `evaluation/original` and `evaluation/solidity`.

### Running evaluations

After running the experiments you can look at the results running the following commands (outside the docker container) inside the `evaluation` folder:

```bash
$> ./e2.bash # for the ERC-20 benchmark
$> ./e3.bash # for the Rosetta benchmark
$> ./e4.bash # for the Aptos benchmark
```
