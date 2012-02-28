Changes
-------

In Development:

- support for security realms (Resty.authenticateForRealm()) in case the regular authentication is not working because java is not able to determine the URL


Since 0.3.0: 

- Option to ignore SSL certificate errors: Resty.ignoreAllCerts (global switch for now)
- New constructor to specify options: new Resty(Option.timeout(3000)); (sets the socket connect timeout)
- Create your own Options (see Resty.Option.Timeout or Resty.Option.Proxy for example)
- Fixed scala naming issue
- enhanced syntax for JSON queries
- bugfixes from my contributors. Thank you!
- Proxy support. Thank you, Gabriel. r.setProxy(...) for object r or new Resty(Option.proxy(...)) to carry proxy settings over when traversing paths
- convenient location header:  new Resty().bytes(url, put(someContent)).location(); // gets Location header as URI

Since 0.2.0: 

- Support for PUT, DELETE, Support for application/multipart-formdata
