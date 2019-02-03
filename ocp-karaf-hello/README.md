# Hello Service

This is a simple hello quickstart that uses Camel, CXF and AMQ in a standalone Karaf Container or OpenShift pod. 

The service can be a useful starting point for hosted, contract first (WSDL), SOAP web services.

The service is largely derived from Redhat JBoss fuse quick start examples.


### Building

The example can be built with

    mvn clean install

### Running the example in OpenShift

    mvn fabric8:deploy 


