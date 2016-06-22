package gov.gsa.cfda.aui.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;

@RestController
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class EnvironmentController {
    final String xdomainTemplate = "'use strict';\nxdomain.slaves(%s);";
    final String xdomainProxyLocation = "/web/IE9/proxy.html";

    final String programsApiEnvName = "pub.api.programs";
    final String iaeConfigUrlEnvName = "CLP.CONFIG.URL";

    @Resource
    private Environment environment;

    @RequestMapping(value = "_xdomainVariables", method = RequestMethod.GET)
    public String getXdomain() throws Exception {
        JSONObject json = new JSONObject();
        json.put(getProgramApiUrl(), xdomainProxyLocation);
        return String.format(xdomainTemplate, json);
    }

    @RequestMapping(value = "/js/iae-config-proxy.js", method = RequestMethod.GET)
    public void iaeConfigProxy(HttpServletRequest request,
                               HttpServletResponse response) throws IOException {
        response.setContentType("application/javascript; charset=UTF-8");
        String configUrl = this.getConfigUrl();

        //  If no config is provided, use the default config so as to not break the system
        if (configUrl == null || configUrl.isEmpty()) {
            configUrl = "/js/iae-config.min.js";
        }
        response.sendRedirect(configUrl);
    }

    private String getConfigUrl() {
        return environment.getProperty(iaeConfigUrlEnvName);
    }

    private String getProgramApiUrl() {
        return environment.getProperty(programsApiEnvName);
    }
}
