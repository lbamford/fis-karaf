# Hello Service

This is a simple hello quickstart that uses Camel, CXF and AMQ in a standalone Karaf Container or OpenShift pod. 
The example can be a useful starting point for hosted, contract first (WSDL), SOAP web services that require payloads to be placed on queues for later processing or multiple recipients.

The example hello service allows for configuration of SOAP end point, contract first, and JMS queue or topic for received SOAP payloads.

Overview of example purpose: 

 *  listen for SOAP requests
 *  write any received SOAP requests to a daily file
 *  put received SOAP requests on a message queue, configured by either config map or prop file (env dependent)
 *  responds back to client with velocity template and 202 acknowledgement


The service is largely derived from Redhat JBoss fuse quick start examples.

The WSDL used to create the CXF service is from:

https://www.tutorialspoint.com/wsdl/wsdl_example.htm

It is relatively straightforward to replace with any other WSDL.

### Building

The example can be built with

    mvn clean install

### Running the example in OpenShift

    mvn fabric8:deploy 



