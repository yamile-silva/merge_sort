

function ComparisonSort(am, w, h)
{
	this.init(am, w, h);

}


var ARRAY_SIZE_SMALL;
var ARRAY_WIDTH_SMALL = 17;
var ARRAY_BAR_WIDTH_SMALL = 10;
var ARRAY_INITIAL_X_SMALL = 15;

var ARRAY_Y_POS = 230;
var ARRAY_LABEL_Y_POS = 240;

var LOWER_ARRAY_Y_POS = 400;
var LOWER_ARRAY_LABEL_Y_POS = 410;

var SCALE_FACTOR = 1.0;

var ARRAY_SIZE_LARGE = 200;
var ARRAY_WIDTH_LARGE = 4;
var ARRAY_BAR_WIDTH_LARGE = 2;
var ARRAY_INITIAL_X_LARGE = 15;

var BAR_FOREGROUND_COLOR = "#DAA40D";
var BAR_BACKGROUND_COLOR ="#EFCB65";
var INDEX_COLOR = "#FF7000";

ComparisonSort.prototype = new Algorithm();
ComparisonSort.prototype.constructor = ComparisonSort;
ComparisonSort.superclass = Algorithm.prototype;

ComparisonSort.prototype.init = function(am, w, h)
{
	var sc = ComparisonSort.superclass;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;

}



ComparisonSort.prototype.addControls =  function()
{
	this.insertli = addControlToAlgorithmBar("Text", "Ingrese limite inferior");
	this.ingresali = addControlToAlgorithmBar("Text", 0);
	this.insertls = addControlToAlgorithmBar("Label", "Ingrese limite superior");
	this.ingresals = addControlToAlgorithmBar("Text", 100);
	this.insertam = addControlToAlgorithmBar("Label", "Longitud");
	this.ingresatam = addControlToAlgorithmBar ("Text", 50);

	this.resetButton = addControlToAlgorithmBar("Button", "Random");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.mergeSortButton = addControlToAlgorithmBar("Button", "Merge Sort");
	this.mergeSortButton.onclick = this.mergeSortCallback.bind(this);

}


	
ComparisonSort.prototype.setArraySize = function (small)
{
	if (small)
	{
		this.array_size = ARRAY_SIZE_SMALL;
		this.array_width = ARRAY_WIDTH_SMALL;
		this.array_bar_width = ARRAY_BAR_WIDTH_SMALL;
		this.array_initial_x = ARRAY_INITIAL_X_SMALL;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = true;
	}
	else
	{
		this.array_size = ARRAY_SIZE_LARGE;
		this.array_width = ARRAY_WIDTH_LARGE;
		this.array_bar_width = ARRAY_BAR_WIDTH_LARGE;
		this.array_initial_x = ARRAY_INITIAL_X_LARGE;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = false;
	}
	this.arrayData = new Array(ARRAY_SIZE_LARGE);
	this.arraySwap = new Array(ARRAY_SIZE_LARGE);
	this.labelsSwap = new Array(ARRAY_SIZE_LARGE);
	this.objectsSwap = new Array(ARRAY_SIZE_LARGE);
}

ComparisonSort.prototype.randomizeArray = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		
		this.arrayData[i] = Math.floor(Math.random() * (sup - inf) + inf);
		this.oldData[i] = this.arrayData[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");					
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);				
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}


ComparisonSort.prototype.createVisualObjects = function()
{
	this.barObjects = new Array(this.array_size);
	this.oldBarObjects= new Array(this.array_size);
	this.oldbarLabels= new Array(this.array_size);
	
	this.barLabels = new Array(this.array_size);
	this.barPositionsX = new Array(this.array_size);			
	this.oldData = new Array(this.array_size);
	this.obscureObject  = new Array(this.array_size);
		
	var xPos = this.array_initial_x;
	var yPos = this.array_y_pos;
	var yLabelPos = this.array_label_y_pos;
	
	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		xPos = xPos + this.array_width;
		this.barPositionsX[i] = xPos;
		this.cmd("CreateRectangle", this.nextIndex, "", this.array_bar_width, 200, xPos, yPos,"center","bottom");
		this.cmd("SetForegroundColor", this.nextIndex, BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, BAR_BACKGROUND_COLOR);//colorcito
		this.barObjects[i] = this.nextIndex;
		this.oldBarObjects[i] = this.barObjects[i];
		this.nextIndex += 1;
		if (this.showLabels)
		{
			this.cmd("CreateLabel", this.nextIndex, "0", xPos, yLabelPos);
		}
		else
		{
			this.cmd("CreateLabel", this.nextIndex, "", xPos, yLabelPos);
		}
		this.cmd("SetForegroundColor", this.nextIndex, INDEX_COLOR);
		
		this.barLabels[i] = this.nextIndex;
		this.oldbarLabels[i] = this.barLabels[i];
		++this.nextIndex;				
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.randomizeArray();
	for (i = 0; i < this.array_size; i++)
	{
		this.obscureObject[i] = false;
	}
	this.lastCreatedIndex = this.nextIndex;
}

ComparisonSort.prototype.highlightRange  = function(lowIndex, highIndex)
{
	for (var i = 0; i < lowIndex; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}
	}
	for (i = lowIndex; i <= highIndex; i++)
	{
		if (this.obscureObject[i])
		{
			this.obscureObject[i] = false;
			this.cmd("SetAlpha", this.barObjects[i], 1.0);
			this.cmd("SetAlpha", this.barLabels[i], 1.0);
		}				
	}
	for (i = highIndex+1; i < this.array_size; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}				
	}
}



ComparisonSort.prototype.reset = function()
{
	for (var i = 0; i < this.array_size; i++)
	{
		
		this.arrayData[i]= this.oldData[i];
		this.barObjects[i] = this.oldBarObjects[i];
		this.barLabels[i] = this.oldbarLabels[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");					
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
	}
	this.commands = new Array();
}


ComparisonSort.prototype.resetCallback = function(event)
{

	var Longitud = parseInt(this.ingresatam.value);
	ARRAY_SIZE_SMALL=Longitud;
	var inferior = parseInt(this.ingresali.value);
	var superior = parseInt(this.ingresals.value);
	inf=inferior;
	sup=superior+1;
	this.setArraySize(true);	
	this.createVisualObjects();	
}

	

ComparisonSort.prototype.mergeSortCallback = function(event)
{
	this.animationManager.clearHistory();
	
	this.commands = new Array();
	this.doMergeSort(0, this.array_size-1);
	this.animationManager.StartNewAnimation(this.commands);
}

ComparisonSort.prototype.doMergeSort = function(low,high)
{
	this.highlightRange(low, high);
	if (low < high)
	{
		this.cmd("Step");
		var mid = Math.floor((low + high) / 2);
		this.doMergeSort(low,mid);
		this.doMergeSort(mid+1, high);
		this.highlightRange(low,high);
		var insertIndex = low;
		var leftIndex = low;
		var rightIndex = mid+1;
		while (insertIndex <= high)
		{
			if (leftIndex <= mid && (rightIndex > high || this.arrayData[leftIndex] <= this.arrayData[rightIndex]))
			{
				this.arraySwap[insertIndex] = this.arrayData[leftIndex];
				this.cmd("move", this.barObjects[leftIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_Y_POS);
				this.cmd("move", this.barLabels[leftIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_LABEL_Y_POS);
				this.cmd("step");
				this.labelsSwap[insertIndex] = this.barLabels[leftIndex];
				this.objectsSwap[insertIndex] = this.barObjects[leftIndex];
				insertIndex++;
				leftIndex++;
			}
			else
			{
				this.arraySwap[insertIndex] = this.arrayData[rightIndex];
				this.cmd("move", this.barLabels[rightIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_LABEL_Y_POS);
				this.cmd("move", this.barObjects[rightIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_Y_POS);
				this.cmd("step");
				this.labelsSwap[insertIndex] = this.barLabels[rightIndex];
				this.objectsSwap[insertIndex] = this.barObjects[rightIndex];
				
				insertIndex++;
				rightIndex++;					
			}
		}
		for (insertIndex = low; insertIndex <= high; insertIndex++)
		{
			this.barObjects[insertIndex] = this.objectsSwap[insertIndex];
			this.barLabels[insertIndex] = this.labelsSwap[insertIndex];
			this.arrayData[insertIndex] = this.arraySwap[insertIndex];
			this.cmd("Move", this.barObjects[insertIndex], this.barPositionsX[insertIndex], this.array_y_pos);
			this.cmd("Move", this.barLabels[insertIndex], this.barPositionsX[insertIndex], this.array_label_y_pos);
		}
		this.cmd("Step");				
	}
	else
	{
		this.cmd("Step");				
	}
	
}

ComparisonSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.ingresali.disabled = true;
	this.ingresals.disabled = true;
	this.mergeSortButton.disabled = true;
	this.insertli.disabled = true;
	this.insertls.disabled =true;
	this.insertam.disabled = true;
	this.ingresatam.disabled = true;
	
}
ComparisonSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.ingresali.disabled = false;
	this.ingresals.disabled = false;
	this.mergeSortButton.disabled = false;
	this.insertli.disabled=true;
	this.insertls.disabled =true;
	this.insertam.disabled = true;
	this.ingresatam.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new ComparisonSort(animManag, canvas.width, canvas.height);
}