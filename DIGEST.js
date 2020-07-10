/*
 *  DIGEST.js: lightweight data display software tool
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

var head = document.getElementsByTagName('head')[0];
window.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>');
window.document.write('<script src="http://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>');
window.document.write('<script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>');
var link = document.createElement('link');
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "DIGEST.css");
head.appendChild(link);
/*
 * Creates and displays Sanger Sequence data as a dialog box
 * @param seqJSON
 *              {@code seqJSON} to be displayed
 * @param dispID
 *              {@code dispID} is ID of event node 
 * @param initLoc
 * 		{@code initLoc} is relative location of first nucleotide
 * @requires {@code seqJSON} to be a 2D array object
 */
function displayTable(seqJSON, dispID, initLoc, size, labelFreq) {
  var wrapper = document.createElement("DIV");
  wrapper.setAttribute("id", "sangerSeqDisplay");
	$("#".concat(dispID)).before(wrapper);
	createChart(seqJSON, "sangerSeqDisplay", initLoc, size, labelFreq);
  $( "#sangerSeqDisplay" ).dialog({
		dialogClass: "noclose",
		position: {
			my: "right+20%",
			at: "right top",
			of: window
		}
	});
}

/*
 * Displays Sanger Sequence when mouse enters item
 * specified by @param dispID and hides it when mouse leaves item
 * @param seqJSON
 *              {@code seqJSON} stringified data to be displayed
 * @param dispID
 *              {@code dispID} is ID of event node
 * @param initLoc
 * 		{@code initLoc} is relative location of first nucleotide
 * @param size
 * 		optional parameter for size of popup between 1 and 200. default value of 100
 * @param labelFreq
 * 		optional parameter specifying frequency of location labels to be shown
 * @requires {@code seqJSON} to be a stringified 2D array JSON object
 */
function DIGEST(seqJSON, dispID, initLoc, size, labelFreq) {
size = size || 100;
labelFreq = labelFreq || 1;
	$(function() {
		$("#".concat(dispID)).mouseenter(function() {
			displayTable(seqJSON, dispID, initLoc, size, labelFreq);
   		$( "#sangerSeqDisplay" ).position({
          my: "right-20% bottom-10%",
          at: "left",
          of: event, 
          collision: "fit"
        });
			$( document ).mousemove(function( event ) {
	  		$( "#sangerSeqDisplay" ).position({	
					my: "right-20% bottom-10%",
					at: "left",
					of: event,
					collision: "fit"
				});
			});
			$("#".concat(dispID)).mouseleave(function() {
				if ($( '#chart1:hover' ).length == 0) {
					$( "#sangerSeqDisplay" ).remove();
				}
				$( "#sangerSeqDisplay" ).mouseleave(function() {
					if ($("#".concat(dispID)).length != 0) {
						$( "#sangerSeqDisplay" ).remove();
					}
				});
			});
		});
	});
}

/*
 * Creates chart from data at dispID
 * @param seqJSON
 * 		{@code seqJSON} displayed in chart
 * @param dispID
 * 		{@code dispID} is ID of event node
 * @param initLoc
 * 		{@code initLoc} is relative location of first nucleotide
 * @param size
 * 		size is relative size of graph. default value of 100
 * @requires {@code seqJSON} to be a 2D array JSON object
 */
function createChart(seqJSON, dispID, initLoc, size, labelFreq) {
	var data = JSON.parse(seqJSON);
  var dataY = new Array(data.length);
	var flip = false;
	if (initLoc < 0) {
		[data[0], data[2]] = [data[2], data[0]];
		[data[1], data[3]] = [data[3], data[1]];
		initLoc = -initLoc;
		data.forEach(item => item.reverse());
		flip = true;
	}
  for (var i = 0; i < data.length; i++) {
    dataY[i] = new Array(2 * data[0].length + 1);
    for (var j = 0; j < dataY[0].length; j++) {
      if (j % 2 == 0) {
        dataY[i][j] = 0;
      } else {
        dataY[i][j] = data[i][(j - 1)/ 2];
      }
    }
  }
  for (i = 0; i < data.length; i++) {
    for (var k = 1; k < data[0].length; k++) {
      dataY[i][k * 2] = 0.3 * (dataY[i][(k * 2) - 1] + dataY[i][(k * 2) + 1]) / 2;
    }
  }
  var divObj = document.createElement("DIV");
  divObj.setAttribute("class", "ct-chart");
  divObj.setAttribute("id", "chart1");
  var dataX = new Array(dataY.length);
  for (var i = 0; i < dataY[0].length; i++) {
    if (i % 2 != 0) {
      var max = Math.max(dataY[0][i], dataY[1][i], dataY[2][i], dataY[3][i]);
      var label = "";
			switch (max) {
				case dataY[0][i]:
					label = "A";
					break;
				case dataY[1][i]:
					label = "C";
					break;
				case dataY[2][i]:
					label = "T";
					break;
				case dataY[3][i]:
					label = "G";
					break;
      }
      dataX[i] = label;
			if (!flip) {
				var loc = parseInt(initLoc) + (i - 1) / 2;
			} else {
				var loc = parseInt(initLoc) + (dataY[0].length - 3) / 2 - (i - 1) / 2;
			}
			if (loc % labelFreq == 0) {
				dataX[i] = " ".repeat(loc.toString().length - 1).concat(dataX[i].concat("\n ", loc));
    	}
		}
  }
  var plotData = {
    labels: dataX,
    series:
     dataY
  };
	var length = (size / 7) * 60;
  var options = {
    width: length,
    height: size,
    showArea: false,
    showGridBackground: false,
    showPoint: true,
    chartPadding: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 10
    },
    axisX: {
      offset: 30,
      labelOffset: {
        x: -4,
        y: 0
      },
      showGrid: false,
      showLabel: true,
      type: undefined
    },
    axisY: {
      offset: 30,
      labelOffset: {
        x: 0,
        y: 15
      },
      showGrid: false,
      showLabel: true,
      type: undefined
    }
  };
  if (dataX.length <  61) {
		length = (size / 7) * dataX.length;
		options.width = length;
  } 
	divObj.setAttribute("style", "background-color:white; width:" + length + "px; height:" + size +"px;");
	$("#".concat(dispID)).prepend(divObj); 
	var chart = new Chartist.Line("#chart1", plotData, options);
}


/*
 * Generates table at specified location with locations for rows, samples for columns, and A to I editing
 * percentages at their intersection 
 * @param insertAt
 * 		{@code insertAt} is id of element to append table to
 * @param ...samples
 * {@code ...samples} is unbounded list of parameters specifying samples of data processed by AlignmentsToJSON
 * @requires {@code ...samples} to be tab delineated data such that each column corresponds to a location on
 * genome where the first entry is the location name and the second is the JSON string of data
 * */

function MpileupToTable (insertAt, ...samples) {
  var table = document.createElement("TABLE");
  var header = table.createTHead();
	var row = header.insertRow(0);
  var rootLabel = row.insertCell(0);
  var mapArray = new Array(samples.length);
	rootLabel.innerHTML = "Locations on Genome \\ Samples";
	let promise = new Promise(function(resolve, reject) {
		for (let index = 0; index < samples.length; index++) {
			let label = row.insertCell(-1);
			label.innerHTML = samples[index];
			mapArray[index] = new Map();
			$.get(samples[index].concat(".txt"), function(result) {
				var lines = result.split("\n");
				lines.forEach(function(currentValue) {
					var locData = currentValue.split("\t");
					if (locData[0] != "") {
						mapArray[index].set(locData[0], JSON.parse(locData[1]));
					}
				});
				if (index == samples.length - 1) {
					resolve("success");
				}
			})
			.fail(function() {
				reject(new Error(samples[index] + " not found."));
			});
		}
	});
	promise.then(
		function(result) {
			var locSet = new Array();
			mapArray.forEach(function(map) {
				for (let loc of map.keys()) {
					if (!locSet.includes(loc)) {
						locSet.push(loc);
					}
				}
			});
			var graphCount = 0;
			locSet.forEach(function(loc) {
				var newRow = table.insertRow(-1);
				var cell = newRow.insertCell(0);
				var center = loc.split(':')[0] + ":" + loc.split(':')[1].split('-').reduce((sum, current) => parseInt(sum) + parseInt(current)) / 2;
				cell.innerHTML = center;
				mapArray.forEach(function(map) {
					if (map.has(loc)) {
						var data = map.get(loc);
						var gCount = data[3][Math.trunc(data[0].length / 2)];
						var aCount = data[0][Math.trunc(data[0].length / 2)];
						var percent = 0;
						if (aCount + gCount != 0) {
							percent = gCount / (aCount + gCount);
						}
						var dataCell = newRow.insertCell(-1);
						dataCell.setAttribute("id", "graph" + graphCount);
						dataCell.innerHTML = gCount *  100 + "%";
						DIGEST(JSON.stringify(data), "graph" + graphCount, center.split(':')[1], 120, 10);
						graphCount++;
					} else {
						var dataCell = newRow.insertCell(-1);
						dataCell.innerHTML = "N/A";
					}
				});
			});
			document.getElementById(insertAt).appendChild(table);
		},
		function(error) {
			alert(error);
		}
	);
}

