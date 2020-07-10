# DIGEST
___
Visualization tool that displays frequency data from high throughput sequencing experiments as DIgitally GEnerated Sanger Traces

## Introduction

Workflows between sequencing data files (BAM) and working websites are often cumbersome or
difficult to create. DIGEST helps fill in the gaps by offering tools to visualize sequencing data and
to extract this data from BAM files.

## Installation
Download and unzip the archive file:
```bash
wget https://github.com/bundschuhlab/DIGEST/archive/master.zip
unzip master.zip
```
Change into the DIGEST directory:
```bash
cd DIGEST-master
```
Build Pileup2JSON:
```bash
make
```
To clean executables:
```bash
make clean
```
## DIGEST Usage

Ensure that DIGEST.js and DIGEST.css are found in the current working directory. 
Include external script reference in target HTML file:
```html
<script type="text/javascript" src="DIGEST.js"></script>
```
Specify target HTML element for DIGEST with a unique element ID:
```html
<div id=dispID>
...
</div>
```
Call DIGEST in an HTML script tag:
```html
<script>
	DIGEST(seqJSON, dispID, initLoc [, size [, labelFreq]]);
</script>
```
#### Parameters
_**seqJSON**_
>JSON string of a 4xN array containing nucleotide frequencies in the order A-C-T-G. eg:
>"[[Afreq1, Afreq2..., AfreqN],[Cfreq1, Cfreq2, ..., CfreqN],[Tfreq1, Tfreq2, ...,
TfreqN],[Gfreq1, Gfreq2, ..., GfreqN]]"
>
_**dispID**_
>String identical to ID of target HTML element. Must follow convention of the client's HTML
>standard.
>
_**initLoc**_
>Integer specifying the starting location of the sequence. Values may be positive or negative.
>Positive values indicate reads from the forward strand, which will be displayed by increasing
>nucleotide location. Negative values indicate reads from the reverse strand, which will be
>displayed by decreasing nucleotide location. Indicating the reverse strand also changes all
>bases into the appropriate complementary base (A to T and C to G and vice versa).
>
_**size**_ — *Optional*
>Positive integer specifying the size of the graph between 1 and 200. Default value of 100.
>
_**labelFreq**_ — *Optional*
>Positive integer specifying the frequency at which nucleotide positions will be labeled.
>Position labels which are multiples of the given value will be shown below the nucleotide label.
>Default value of 1.
>
## Pileup2JSON Usage
Use Pileup2JSON to convert the output of samtools mpileup into JSON string compatible with DIGEST:
```bash
Usage: Pileup2JSON [options]

Options:

	-o FILE		write output to FILE
	-i FILE		read input from FILE
	-m		manually provide input and output files

Default: input and output from cin and cout respectively
```
