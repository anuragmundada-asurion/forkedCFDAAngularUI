package gov.gsa.cfda.aui.controller;

import org.json.JSONObject;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;

@RestController
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class EnvironmentController {
    final String xdomainTemplate = "'use strict';\nxdomain.slaves(%s);";
    final String xdomainProxyLocation = "/web/IE9/proxy.html";

    final String programsApiEnvName = "pub.api.programs";

    @Resource
    private Environment environment;

    @RequestMapping(value = "/environment/api", method = RequestMethod.GET)
    public String getEnvVariables() throws Exception {
        return getProgramApiUrl();
    }

    @RequestMapping(value = "_xdomainVariables", method = RequestMethod.GET)
    public String getXdomain() throws Exception {
        JSONObject json = new JSONObject();
        json.put(getProgramApiUrl(), xdomainProxyLocation);
        return String.format(xdomainTemplate, json);
    }

    private String getProgramApiUrl() {
        String apiUrl = environment.getProperty(programsApiEnvName);
        if(apiUrl == null) {
            apiUrl = "http://gsaiae-dev02.reisys.com:82";
        }
        return apiUrl;
    }
}
