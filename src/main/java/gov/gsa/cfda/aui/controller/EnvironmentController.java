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

    final String angularTemplate = "'use strict'\nangular.module('app.settings', []).constant('env', %s );";

    final String programsSvcEnvName = "pub.svc.programs";

    @Resource
    private Environment environment;

    @RequestMapping(value = "_env", method = RequestMethod.GET)
    public String getEnvVariables() throws Exception {
        JSONObject json = new JSONObject();
        json.put(programsSvcEnvName,environment.getProperty(programsSvcEnvName));
        return String.format(angularTemplate, json);
    }
}
