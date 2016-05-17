package gov.gsa.cfda.aui.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.json.JSONObject;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.Resource;
import java.util.Map;

//  TODO: Possibly break out to User Micro-Service
@RestController
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class UserServiceController {
    private static final String SERVICE_ACCOUNT_ENV = "iam.srvName";
    private static final String SERVICE_PASSWORD_ENV = "iam.srvPassword";
    private static final String API_KEY_ENV = "iam.apiKey";
    private static final String API_ENDPOINT_ENV = "iam.apiEndpoint";

    @Resource
    private Environment environment;

    @RequestMapping(value = "/api/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getUsers(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        //  TODO Validate access token and roles

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic ".concat(this.getServiceCredential()));
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(this.getApiEndpoint())
                .queryParam("api_key", this.getApiKey());

        HttpEntity<?> entity = new HttpEntity<>(headers);
        try {
            HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
            JsonObject responseObject = new Gson().fromJson(response.getBody(), JsonObject.class);
            JsonArray users = new JsonArray();

            if (responseObject.has("_embedded")) {
                JsonObject embedded = responseObject.get("_embedded").getAsJsonObject();
                users = embedded.get("userResources").getAsJsonArray();
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(users.toString());
        } catch (HttpClientErrorException e) {
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            obj.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }
    }

    private String getApiEndpoint() {
        return environment.getProperty(API_ENDPOINT_ENV);
    }

    private String getServiceCredential() {
        String srvAccount = environment.getProperty(SERVICE_ACCOUNT_ENV);
        String srvPassword = environment.getProperty(SERVICE_PASSWORD_ENV);
        return Base64Utils.encodeToString(srvAccount.concat(":").concat(srvPassword).getBytes());
    }

    private String getApiKey() {
        return environment.getProperty(API_KEY_ENV);
    }
}
