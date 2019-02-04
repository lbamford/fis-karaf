package com.iws.cxf;

import org.apache.camel.Exchange;

import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * Camel route that listens for web requests at /services/list. If match, then grab the
 * CXF service page and process it with jsoup, to allow for easy dom access. Loop through all 
 * services and generate new output for a bootstrap themed datatable. 
 * 
 * @author leebamford
 */
public class CXFListing extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        

        from("servlet:///list?matchOnUriPrefix=true")
                
                .recipientList(simple("http4://${headers.Host}/cxf?bridgeEndpoint=true"))
                .process(new Processor() {

                    public void process(Exchange exchange) throws Exception {
                        String contentType = exchange.getIn().getHeader(Exchange.CONTENT_TYPE, String.class);
                        String path = exchange.getIn().getHeader(Exchange.HTTP_PATH, String.class);
                        exchange.getOut().setHeader(Exchange.CONTENT_TYPE, contentType + "; charset=UTF-8");
                        exchange.getOut().setHeader("PATH", path);
                        String serviceList = exchange.getIn().getBody(String.class);

                        Document doc = Jsoup.parse(serviceList);
                        
                        Elements rows = doc.getElementsByTag("tr");

                        String output = "<table id=\"service-table\" class=\"table table-striped table-condensed main table-hover\"><thead>";
                        output += "<th>Endpoint</th>";
                        output += "<th>WSDL</th>";
                        output += "<th>Port</th>";
                        output += "<th>Method</th>";
                        output += "<th>Namespace</th>";
                        output += "</thead>";
                        output += "<tbody>";
                        for (Element row : rows) {

                            String method = "";
                            String port = "";
                            String endpoint = "";
                            String namespace = "";

                            Elements cell = row.select("td:eq(0)");
                            port = cell.select("span:eq(0)").text();
                            method = cell.select("li:eq(0)").text();

                            cell = row.select("td:eq(1)");
                            endpoint = cell.select("span:eq(1)").text();
                            namespace = cell.select("span:eq(7)").text();
                            
                            output += "<tr>";
                            output += "<td>" + endpoint + "</td>";
                            String wsdl = endpoint + "?wsdl";
                            String wsdlLink = "<a href=\""+ wsdl + "\" target=\"_blank\"><i class=\"glyphicon glyphicon-new-window\"></i></a>";
                            output += "<td>" + wsdlLink + "</td>";
                            output += "<td>" + method + "</td>";
                            output += "<td>" + port + "</td>";
                            output += "<td>" + namespace + "</td>";
                            output += "</tr>";

                        }
                        output += "</tbody></table>";
                        String strResources = getThemeResources();

                        serviceList = "<!DOCTYPE html><html><head>"+strResources+"</head><body>";
                        serviceList += "<div class=\"container-fluid\">\n";
                        serviceList += "<h3 class=\"module-header\">Active Web Services <small> SOAP / REST</small></h3>";
                        serviceList += output;
                        serviceList += "</body></html>";
                        
                        exchange.getOut().setBody(serviceList);
                    }
                });

    }

    /**
     * getThemeResources()
     * 
     * Create a string that is basically an include of all local CSS and JavaScript files
     * required for bootstrap datatables
     * 
     * @return string
     */
    public String getThemeResources() {
        String strResources = "<link rel=\"stylesheet\" type=\"text/css\" href=\"../assets/css/bootstrap.css\" media=\"screen\" />\n";
        strResources += "<link rel=\"stylesheet\" type=\"text/css\" href=\"../assets/css/bootstrapDialog.css\" media=\"screen\" />\n";
        strResources += "<link rel=\"stylesheet\" type=\"text/css\" href=\"../assets/css/datatables.bootstrap.css\" media=\"screen\" />\n";
        strResources += "<link rel=\"stylesheet\" type=\"text/css\" href=\"../assets/css/module.css\" media=\"screen\" />\n";
        strResources += "<link rel=\"stylesheet\" type=\"text/css\" href=\"../assets/css/datatables.responsive.css\" media=\"screen\" />\n";

        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/jquery.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/jquery.dataTables.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/bootstrap.min.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/bootstrapDialog.min.js\" ></script>\n";

        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/jquery-ui-1.10.4.min.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/datatables.bootstrap.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/dataTables.searchHighlight.min.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/jquery.highlight.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/utilities.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/libs/datatables.responsive.js\" ></script>\n";
        strResources += "<script type=\"text/javascript\" src=\"../assets/js/listing_table.js\" ></script>\n";
        //strResources += "<link rel=\"shortcut icon\" href=\"../index.ico\"/>\n";
        return strResources;
    }

}
