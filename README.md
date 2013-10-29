Atomizer
========

A small helper to atomize HTML documents into elements for every word or character

Call atomizer.atomize for an element to split words or characters into their own element

For example 

&lt;p&gt;this is a paragraph&lt;/p&gt; 

can become

&lt;p&gt;&lt;span&gt;this&lt;/span&gt; &lt;span&gt;is&lt;/span&gt; &lt;span&gt;a&lt;/span&gt; &lt;span&gt;paragraph&lt;/span&gt;&lt;/p&gt;

or

&lt;p&gt;&lt;span&gt;t&lt;/span&gt; &lt;span&gt;h&lt;/span&gt; &lt;span&gt;i&lt;/span&gt; &lt;span&gt;s&lt;/span&gt; ... &lt;/p&gt;

Options allow you to 

* choose which type of element to wrap words or characters in
* whether to add a className to each new element
* what that className should be (e.g. letter -&gt; &lt;span class="letter"&gt;)
* whether to iterate while adding new elements, and adding this number to the className (e.g. letter21 -&gt; &lt;span class="letter21"&gt;)
* whether numbering begins again for each element, or each number is unique no matter how many words or letters are created
* whether atomize should be called recursively, on its child elements, or only on the element's textNodes

How to use it

1. Include a link to the atomize.js file in your HTML document

		&lt;script src="../atomize.js"&gt;&lt;/script&gt;

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
		
