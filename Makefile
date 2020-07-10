# Build options for Pileup2JSON

# Simplify make
all: Pileup2JSON

# Builds executable
Pileup2JSON: Pileup2JSON.cpp
	g++ Pileup2JSON.cpp -o Pileup2JSON

# Removes executable
clean:
	rm -rf Pileup2JSON
