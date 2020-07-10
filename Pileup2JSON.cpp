/*
 *  Pileup2JSON.cpp: Auxillary program to DIGEST.js converting pileup output to JSON strings
 *  Copyright (C) 2020  The Ohio State University
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see https://www.gnu.org/licenses/.
 */

#include <stdio.h>
#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <vector>
#include <sstream>
#include <iomanip>
#include <string>
#include <string.h>

using namespace std;

void newInputFile(ifstream &fIn);
void newOutputFile(ofstream &fOut);
void processData(ifstream &fIn, ofstream &fOut);
void processData(ofstream &fOut);
void processData(ifstream &fIn);
void processData();
string noTab(string &s, int n);
string vectorToJSON(vector<float> v[4]);
string getAlg(istream &in);

int main(int argc, char* argv[]) {
  ifstream fIn;
	ofstream fOut;
	bool hasIn = false;
	bool hasOut = false;
	int optc = 0;
	for (int i = 1; i < argc; ++i) {
		if (strcmp(argv[i], "-i") == 0) {
			fIn.open(argv[++i]);
			hasIn = true;
			optc++;
		} else if (strcmp(argv[i], "-o") == 0) {
			fOut.open(argv[++i]);
			hasOut = true;
			optc++;
		} else if (strcmp(argv[i], "-m") == 0) {
	/*
   * creates initial input file stream.
   */
    newInputFile(fIn);
  /*
   * creates output file stream.
   */
    newOutputFile(fOut);
  /*
   * listens to user inputs.
   */
    bool circuit = true;
    char choice;
    while (circuit) {
      cout << "\n**** Options ****\n" << "** (1) New input file.\n" << "** (2) New output file.\n";
      cout << "** (3) Process contents of input file to output file.\n" << "** (4) End program.\n";
      cout << "*****************\n\n";
      cin >> choice;
      cin.ignore(1000, '\n');
      switch(choice) {
        case '1':
          newInputFile(fIn);
          break;
        case '2':
          newOutputFile(fOut);
          break;
        case '3':
          processData(fIn, fOut);
          break;
        case '4':
          circuit = false;
          break;
        default:
          cout << "INVALID";
          break;
      }
    }
  /*
   * closes input and output file streams.
   */
    fIn.close();
    fOut.close();
    return 0;
		} else if ((argc - 1) >  optc * 2) {
			cout << "\nUsage: MpileupTransformStandard [options]\n" << endl;
			cout << "Options:\n" << endl;
			cout << "\t-o FILE\t\twrite output to FILE" << endl;
			cout << "\t-i FILE\t\tread input from FILE" << endl;
			cout << "\t-m\t\tmanually provide input and output files\n" << endl;
			cout << "Default: input and output from cin and cout respectively\n" << endl;
			return 0;
		}
	}
	if (!(hasIn || hasOut)) {
		processData();
	} else if (hasIn) {
		if (hasOut) {
			processData(fIn, fOut);
		} else {
			processData(fIn);
		}
	} else if (hasOut) {
		processData(fOut);
	}
}

/*
 * closes #fIn and opens new input file.
 */
void newInputFile (ifstream &fIn) {
  if (fIn.is_open()) {
    fIn.close();
  }
/*
 * creates input file stream. 
 */
  cout << "**\tInput File: ";
  string inFile;
  cin >> inFile;
  fIn.open(inFile.c_str());
}

/*
 * closes #fOut and opens new output file.
 */
void newOutputFile (ofstream &fOut)  {
  if (fOut.is_open()) {
    fOut.close();
  }
/*
 * creates new output file stream.
 */
  cout << "**\tOutput File: ";
  string outFile;
  cin >> outFile;
  fOut.open(outFile.c_str());
}

/*
 * writes data in mpileup in fIn or cin to JSON formatted string
 * and redirects to cout or output file.
 */
void processData(ifstream &fIn, ofstream &fOut) {
	fOut << getAlg(fIn) << endl;
}

void processData(ifstream &fIn) {
	cout << getAlg(fIn) << endl;
}

void processData(ofstream &fOut) {
  fOut << getAlg(cin) << endl;
	}

void processData() {
  cout << getAlg(cin) << endl;
}

/*
 * Converts mpileup output into stringified vector of base frequencies in order ACTG.
 */
string getAlg(istream &in) {
  vector<float> data[4];
	string line;
  while (getline(in, line)) {
    int numOfReads;
    string refBase = noTab(line, 3);
    int refBaseIndex;
		/*
		 * Checks for reference base.
		 */
    if (refBase.at(0) != 'N') {
      switch (refBase.at(0)) {
        case 'A':
          refBaseIndex = 0;
          break;
        case 'C':
          refBaseIndex = 1;
          break;
        case 'T':
          refBaseIndex = 2;
          break;
        case 'G':
          refBaseIndex = 3;
          break;
      }
    }
		/*
		 * Counts number of each reads accounting for skips in reads as well as insertions
		 * or deletions.
		 */
    stringstream counter (noTab(line, 1));
    counter >> numOfReads;
    int baseCount[4] = {};
    string reads = noTab(line, 1);
    bool carat = true;
    for (int i = 0; i < reads.length(); i++) {
      if (carat) {
        switch (reads.at(i)) {
          case 'a':
          case 'A':
            baseCount[0]++;
          break;
          case 'c':
          case 'C':
            baseCount[1]++;
          break;
          case 't':
          case 'T':
            baseCount[2]++;
          break;
          case 'g':
          case 'G':
            baseCount[3]++;
          break;
          case '^':
            carat = false;
          break;
          case '.':
          case ',':
            baseCount[refBaseIndex]++;
          break;
          case '$':
            break;
          case '-':
          case '+': {
            int inDel = 0;
            do {
              i++;
              inDel *= 10;
              inDel += reads.at(i) - '0';
            } while (reads.at(i++) >= '0' && reads.at(i++) <= '9');
            i += inDel;
          }
          break;
          default:
            numOfReads--;
          break;
        }
      } else {
        carat = true;
      }
    }
		/*
		 * Calculates the relative frequencies for each base.
		 */
    for (int i = 0; i < 4; i++) {
      data[i].push_back((float)baseCount[i] / (float)numOfReads);
    }
  }
	return vectorToJSON(data);
}


/*
 * converts array of 4 vectors of type float to JSON formatted string
 */
string vectorToJSON(vector<float> v[4]) {
  string s = "[";
  for (int i = 0; i < 4; i++) {
    s += "[";
    vector<float> vInner = v[i];
    for (int j = 0; j < vInner.size(); j++) {
      ostringstream inner;
      inner << vInner.at(j);
      string innerString(inner.str());
      s += innerString;
      if (!(j == vInner.size() - 1)) {
        s += ",";
      }
    }
    s += "]";
    if (!(i == 3)) {
      s += ",";
    }
  }
  s += "]";
  return s;
}

/*
 * returns nth prefix of s not containing char '\t' and removes prefix from s
 */

string noTab(string &s, int n) {
  string prefix;
  for (int j = 0; j < n; j++) {
    int i = 0;
    while(i < s.length() && s[i] != '\t') {
      i++;
    }
    prefix = s.substr(0, i);
    s = s.substr(i + 1);
  }
  return prefix;
}

