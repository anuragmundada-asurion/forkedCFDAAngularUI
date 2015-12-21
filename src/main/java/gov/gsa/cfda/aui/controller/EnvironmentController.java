package gov.gsa.cfda.aui.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

import org.json.JSONObject;

import javax.annotation.Resource;
import java.util.UUID;

@RestController
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class EnvironmentController {

    final String angularTemplate = "'use strict';\nangular.module('app.settings', []).constant('env', %s );";
    final String xdomainTemplate = "'use strict';\nxdomain.slaves(%s);";
    final String xdomainProxyLocation = "/web/IE9/proxy.html";

    final String programsApiEnvName = "pub.api.programs";

    @Resource
    private Environment environment;

    @RequestMapping(value = "_env", method = RequestMethod.GET)
    public String getEnvVariables() throws Exception {
        JSONObject json = new JSONObject();
        //Hardcoded value for now until env variable on dev site is modified.
        json.put(programsApiEnvName, getProgramApiUrl());
        return String.format(angularTemplate, json);
    }

    @RequestMapping(value = "_xdomainVariables", method = RequestMethod.GET)
    public String getXdomain() throws Exception {
        JSONObject json = new JSONObject();
        json.put(getProgramApiUrl(), xdomainProxyLocation);
        return String.format(xdomainTemplate, json);
    }

    private String getProgramApiUrl() {
        String apiUrl = environment.getProperty(programsApiEnvName);
        if(apiUrl == null)
            apiUrl = "http://gsaiae-dev02.reisys.com:89";
        return apiUrl;
    }
}
