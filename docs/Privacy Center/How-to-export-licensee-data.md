1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [Privacy Center](Privacy-Center_17433021.html)

<span id="title-text"> How to export licensee data </span>
==========================================================


GDPR requires to offer your customers the ability to ask for a copy of
their data for portability reasons. The data export should be in a
machine-readable format (not human readable).

NetLicensing RESTful API
------------------------

With the help of [NetLicensing RESTful API](11010215.html), you can
easily export customer's data in `XML` or `JSON` format.

Please refer to the documentation for the GET operations of the
corresponding service:

-   [Licensee
    Services](https://www.labs64.de/confluence/display/NLICPUB/Licensee+Services) -
    to retrieve *Licensee* data using its *LicenseeNumber*
-   [License
    Services](https://www.labs64.de/confluence/display/NLICPUB/License+Services) -
    to retrieve *License* data, which can be filtered post-export by
    `"`licenseeNumber`"` property within single *License* entity
-   [Transaction
    Services](https://www.labs64.de/confluence/display/NLICPUB/Transaction+Services) -
    to retrieve *Transaction* data, which can be filtered post-export by
    `"`licenseNumber`"` property within single *Transaction* entity


