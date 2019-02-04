# Enhanced CXF Services Page 

The format of the CXF services page is unstyled html and although it might be possible to configure I have been unable to do so. This is an attempt to provide a version of the page that is nicer looking and more user friendly. 

The project creates a servlet that expects to run in karaf. The purpose; to parse the default cxf/ service page and output to a new page enhanced with bootstrap and datatables.


## Building

    mvn clean install 

## Karaf

Run the following:


    install -s war:mvn:com.iws/cxf-services/1.0-SNAPSHOT/war?Web-ContextPath=/


![Alt text](cxf-dt.jpg?raw=true "CXF Service Page As Datatable")