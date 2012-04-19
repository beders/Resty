Changes
-------

New in 0.3.2:

- fix for open input streams
- support for arrays being returned as JSON
- support for security realms (Resty.authenticateForRealm()) in case the regular authentication is not working because java is not able to determine the URL
- deprecated alwaysSend in favor of withHeader
- Resty will not set a CookieHandler if one is already set. 

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

