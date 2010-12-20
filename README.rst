======
Resty
======

Introduction
--------------

Resty is a small, convenient interface to talk to RESTful services from Java.

Its focus is on simplicity and ease-of-use, often requiring only two lines of code to access any web service.
It supports chaining several requests which is very useful in RESTful application employing HATEOS.
  
Basic usage is very simple: Create a Resty instance, use authenticate methode to add credentials, then call one of the content type specific methods.
The idea is that the method name will convey the expected content type you can then operate on.
 
Here is an example on how to use the geonames web service. It retrieves the json object (see json.org for details) and gets the name of a place from the zip code::
  
 	Resty r = new Resty();
	Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
	assertEquals(name, "Rehlingen-Siersburg");
 
Resty supports complex path queries to navigate into a json object.

Status
-------

Infancy 
- POST, GET for JSON and text/plain
- Path expressions to access JSON: simple tests on fields with operators >,=,< and full boolean expressions (&&,||,!)

Installation
-------------
Either compile yourself or grab the rest-*.jar file and add it to your CLASSPATH.
No other runtime requirements (so far).


Compile
-------
Use Maven 2 or 3 to build.


Examples
-----------

Some supported path constructs::

 store.book[price>9 && price<12.999].author
 store.book[!category='reference'].author
 
JSON Sample::

 { "store": {
    "book": [ 
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      { "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
 } 
 
