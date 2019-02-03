package com.iws.hello;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;

/**
 * Simple route that:
 *  - listens for SOAP requests
 *  - writes them to a daily file
 *  - puts them on a message queue, configured by either config map or prop file (env dependent)
 *  - responds back to client with velocity template and 202 acknowledgement
 * 
 * @author leebamford
 */

public class HelloService extends RouteBuilder {

    @Override
    public void configure() throws Exception {

        
        from("cxf:bean:sayHello").routeId("CXF_helloService")
                //Write the payload to file, use append mode for the day
                .to("file:audit/?fileName=${date:now:yyyyMMdd}_hello.txt&fileExist=Append").routeId("LOG_helloService")
                //Put the payload on JMS queue
                .inOnly("{{brokerTopic}}?jmsMessageType=Text")
                
                //Send response to client, use velocity template to make nice the response. 
                //Easy enough to use dynamic values in the template just set header val and access in template  
                .setHeader("status",constant("202"))
                .setHeader("statusMessage",constant("Payload received"))
                
                //Set the http resonse code, send acknowldege header 202, basically we received but not processing it for this response
                .setHeader(Exchange.HTTP_RESPONSE_CODE,constant(202))  
                .to("velocity:META-INF/velocity/response.vm").id("ResponsetoClient_HelloService");
    }
}
