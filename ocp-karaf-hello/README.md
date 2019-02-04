# Hello Service

This is a simple hello quickstart that uses Camel, CXF and AMQ in a Karaf Container. Karaf can be run standalone or in an OpenShift pod. 
The example can be a useful starting point for hosted, contract first (WSDL), SOAP web services that require payloads to be placed on queues for later processing or multiple recipients.

The example hello service allows for configuration of SOAP end point, contract first, and JMS queue or topic for received SOAP payloads.

Overview of example purpose: 

 *  listen for hello SOAP requests
 *  write any received hello SOAP requests to a daily file
 *  put received hello SOAP requests on a message queue, configured by either config map or prop file (env dependent)
 *  responds back to client with velocity template and 202 acknowledgement


The example service is derived from Redhat JBoss fuse quick start examples.

The WSDL used to create the CXF service is from:

https://www.tutorialspoint.com/wsdl/wsdl_example.htm

It is relatively straightforward to replace with any other WSDL.

### Building

The example can be built with

    mvn clean install

If standalone Karaf 

    mvn clean install -Ddocker.skip=true
    
    #Install in Karaf
    install -s mvn:com.iws/hello-service/1.0-SNAPSHOT

### Running the example in OpenShift

    mvn fabric8:deploy 



