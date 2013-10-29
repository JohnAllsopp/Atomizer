Atomizer
========

A small helper to atomize HTML documents into elements for every word or character

Call atomizer.atomize for an element to split words or characters into their own element

For example 

<p>this is a paragraph</p> 

can become

<p><span>this</span> <span>is</span> <span>a</span> <span>paragraph</span></p>

or

<p><span>t</span> <span>h</span> <span>i</span> <span>s</span> ... </p>

Options allow you to 

* choose which type of element to wrap words or characters in
* whether to add a className to each new element
* what that className should be (e.g. letter -> <span class="letter">)
* whether to iterate while adding new elements, and adding this number to the className (e.g. letter21 -> <span class="letter21">)
* whether numbering begins again for each element, or each number is unique no matter how many words or letters are created
* whether atomize should be called recursively, on its child elements, or only on the element's textNodes

How to use it

1. Include a link to the atomize.js file in your HTML document

  <script src="../atomize.js"></script>

2. create an atomizerOptions object, and change any default options (see atomize.js for details on the options)

		var options = new atomizerOptions
		options.granularity = 'letter';
		options.className = 'atomized';
		options.iterate = true;
		options.iterateRecusively = true;
		options.deep = true;
		
	}
	
3. Call atomizer.atomize on an element, with the optiosn you want

    atomizer.atomize(document.body, options)
		
