// The MIT License (MIT)
// 
// Copyright (c) 2013 John Allsopp
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// 


//ATOMIZER//
//slices and dices the text in an element
//wraps the desired chunk in the element of choice, with optional class values

//Dependencies
//none

//DOM features you may be concerned about in really old browsers
//classList, textContent, JSON

function atomizerOptions() {
	//options are
	//granularity: string - letter | word | element - what size we should break the element up into
	//tag: string - what type of element should we wrap out atoms in? default is span
	//className: string - what classname should we add to these new elements? default ""
	//iterate: boolean - number the className uniquely from 0 (e.g class="className1", class="className2")
	//iterateRecursively: boolean - do we start iterating from 0 for each sub element, or only from the start? 
	//deep: boolean - do we recursively call atomize on child elements [deep = true] or only apply to the passed element? default false  
	//lastIndex: integer, //the last integer we used to append to className to number elements uniquely default = 0
	
	this.granularity = "element";
	this.tag = "span";
	this.className = "";
	this.iterate = false;
	this.iterateRecursively = false;
	this.deep = false;
	this.lastIndex = 0;	
}

var atomizer = {
	
	atomize: function(element, options) {
		//'atomize' the given element into components
		//see atomizerOptions above for options and defaults 
		
		switch (options.granularity) {
			
			case "letter":
				atomizer.intoLetters(element, options)
				break;
			
			case "word":
				atomizer.intoWords(element, options)
				break;
			
			case "element":
				atomizer.intoElements(element, options)
				break;
		}
		
	},
	
	reconstitute: function(element, options) {
		//remove elements, replace with text nodes
		
		var childNodes = element.childNodes;
		var currentText = "";
		var newTextNode;
		var elementsToRemove = []; 	//elements we'll remove from the document once we've got their text
		var elementsToAdd = []; 	//each entry in the array is an array of 2 items, the first is the element to be added
									//the second, the element it comes before
		
		for (var i=0; i < childNodes.length; i++) {
			if (childNodes[i].nodeType === 1 && atomizer.isAtomized(childNodes[i], options)) {
				// need to check if it is one of the atomized ones, or a regular node
				//element node, so add the contents to our buffer of text
				currentText += childNodes[i].textContent;
				elementsToRemove.push(childNodes[i])
			}
			
			var tet = (childNodes[i].parentElement.nextSibling === null)
			
			if ((childNodes[i].nextSibling === null) || !(childNodes[i].nodeType === 1 ) || !(atomizer.isAtomized(childNodes[i], options))) {
				//we've hit a non atomized element, so turn the buffered one into a text node and add that
				//or it's the last sibling element so process what's come before
				
				if (currentText != "") {
					newTextNode = document.createTextNode(currentText);
					elementsToAdd.push([newTextNode, childNodes[i]]);
					currentText = "";					
				}
			}
			
			if (childNodes[i].nodeType === 1 && !(atomizer.isAtomized(childNodes[i], options))) {
				atomizer.reconstitute(childNodes[i], options);
			}
			
		};
		
		//now remove all the old atomized elements
				
		for (var i=0; i < elementsToAdd.length; i++) {
			elementsToAdd[i][1].parentElement.insertBefore(elementsToAdd[i][0], elementsToAdd[i][1]);
		};
		
		for (var i=0; i < elementsToRemove.length; i++) {
			elementsToRemove[i].parentElement.removeChild(elementsToRemove[i])
		};
		
	},
	
	intoLetters: function(element, options) {
		//break the element into individual letter based elements with the options as outlined in atomize()
		var childNodes = element.childNodes;
		var replacedElementsArray = []; //we'll use this to remove replace textNodes with their created elements
		
			for (var i=0; i < childNodes.length; i++) {

			if (childNodes[i].nodeType === 1) {
				//HTML element, so call intoLetter recursively
				
				atomizer.intoLetters(childNodes[i], options)
				
			}
			
			else if (childNodes[i].nodeType === 3) {
				//text node
				
				if (childNodes[i].textContent) {
					
					var text = childNodes[i].textContent;
					var nextNode = childNodes[i+1];
					
					if (text !== "") {
						
						var stringArray = text.split("");
						
						var newElementsArray = [];
						
						for (var j=0; j < stringArray.length; j++) {
							
							if (stringArray[j] === "\n") continue; //ignore returns
							
							var newElement = document.createElement(options.tag)
							
							if (options.className !== "") {

								if (options.iterate) {
									newElement.classList.add(options.className + (options.lastIndex++))
									//get the last index, add one to it, then append this to the classname;
									options.lastIndex = options.lastIndex++
								}

								else {			
									newElement.classList.add(options.className)	
								}
							}
							
							newElement.textContent = stringArray[j] + ""; //add padding afterwards
							newElementsArray.push(newElement);
						};
						
						replacedElementsArray.push([childNodes[i], newElementsArray]) 
						//we'll later iterate through this array, and replace the text element with its atomized words 
												
					}	
				}	
			}	
		};
		
		for (var i=0; i < replacedElementsArray.length; i++) {
			replacedElementsArray[i]
			atomizer.insertElementsBefore(replacedElementsArray[i][0], replacedElementsArray[i][1])			
			replacedElementsArray[i][0].parentElement.removeChild(replacedElementsArray[i][0])		
		};
		
		
		
		
	},

	intoWords: function(element, options) {
		//break the element into individual word based elements with the options as outlined in atomize()

		var childNodes = element.childNodes;
		var replacedElementsArray = []; //we'll use this to remove replace textNodes with their created elements
		
			for (var i=0; i < childNodes.length; i++) {

				if (childNodes[i].nodeType === 1) {
					//HTML element, so call intoWords recursively
				
					atomizer.intoWords(childNodes[i], options)
				
				}
			
				else if (childNodes[i].nodeType === 3) {
					//text node
				
					if (childNodes[i].textContent) {
					
						var text = childNodes[i].textContent.trim();
						var nextNode = childNodes[i+1]
						if (text !== "") {
						
							var stringArray = text.split(" ");
							var newElementsArray = [];
						
							for (var j=0; j < stringArray.length; j++) {
								var newElement = document.createElement(options.tag)
								
								if (options.className !== "") {

									if (options.iterate) {
										newElement.classList.add(options.className + (options.lastIndex++))
										//get the last index, add one to it, then append this to the classname;
										options.lastIndex = options.lastIndex++
									}

									else {			
										newElement.classList.add(options.className)	
									}
								}
								
								newElement.textContent = stringArray[j] + " "; //add padding afterwards
								newElementsArray.push(newElement);
							};
						
							replacedElementsArray.push([childNodes[i], newElementsArray]) 
							//we'll later iterate through this array, and replace the text element with its atomized words 
												
						}	
					}	
				}	
			};
		
			for (var i=0; i < replacedElementsArray.length; i++) {
				replacedElementsArray[i]
				atomizer.insertElementsBefore(replacedElementsArray[i][0], replacedElementsArray[i][1])			
				replacedElementsArray[i][0].parentElement.removeChild(replacedElementsArray[i][0])		
			};
	},


	intoElements: function(element, options) {
		//apply the options to the element, and if options.deep = true child elements.
		
		
		if (options.className !== "") {

			if (options.iterate) {
				element.classList.add(options.className + (options.lastIndex++))
				//get the last index, add one to it, then append this to the classname;
				options.lastIndex = options.lastIndex++
			}
			
			else {			
				element.classList.add(options.className)	
			}
		}
		
		
		if (options.deep) {
			//recursively apply the options to child elements
			
			var passOptions = options
			//we're may have to clone our options and pass these as options tracks the current counter of the iterator
			
			if (options.iterateRecusively) {
				var newOptions = atomizer.cloneOptions(options);
				newOptions.lastIndex = 0;				
				passOptions = newOptions
				//clone the options and reset the lastIndex to 0
				//otherwise, we'll simply linearly iterate elements				
			}
			
			
			var children = element.children
			
			for (var i=0; i < children.length; i++) {
				atomizer.atomize(children[i], passOptions)
			};
		}
	},
	
	cloneOptions: function(options) {
		//clone the options to be used recursively
		
		return JSON.parse(JSON.stringify(options));
		
	},
	
	insertElementsBefore: function(insertBefore, elementArray) {
		//insert the elements in the array before the element
				
		for (var i= 0 ; i < elementArray.length; i++) {
			insertBefore.parentElement.insertBefore(elementArray[i], insertBefore)
		};
		
	},
	
	isAtomized: function(element, options) {
		
		if (element.classList) {
 			return element.classList.contains(options.className)
		}
		else {
			return false
		}
	}
}