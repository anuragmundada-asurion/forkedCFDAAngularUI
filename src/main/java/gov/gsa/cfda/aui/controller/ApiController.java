package gov.gsa.cfda.aui.controller;

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
import org.springframework.hateoas.MediaTypes;

import javax.annotation.Resource;
import org.json.JSONObject;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

//  TODO REFACTOR
@RestController
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class ApiController {
    public static final String API_PROGRAMS_ENV = "pub.api.programs";
    public static final String API_SEARCH_ENV = "pub.api.search";
    public static final String API_FEDERAL_HIERARCHY_ENV = "pub.api.fh";

    @Resource
    private Environment environment;

    @RequestMapping(value = "/api/programs", method = RequestMethod.GET, produces = "application/json")
    public String getProgramListApiCall(@RequestHeader(value = "X-Auth-Token", required = false) String accessToken,
                                        @RequestParam(value="keyword", required=false, defaultValue="") String keyword,
                                        @RequestParam(value="includeCount", required=false, defaultValue="false") Boolean includeCount,
                                        @RequestParam(value="limit", required=false, defaultValue="100") int limit,
                                        @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                                        @RequestParam(value="sortBy", required=false, defaultValue="-title") String sortBy,
                                        @RequestParam(value="status", required=false, defaultValue="") String status) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl())
                .queryParam("keyword", keyword)
                .queryParam("includeCount", includeCount)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("sortBy", sortBy)
                .queryParam("status", status);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/{id}", method = RequestMethod.GET, produces = "application/json")
    public String getProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = false) String accessToken,
                                    @PathVariable("id") String id) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs", method = RequestMethod.POST)
    public String createProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @RequestBody String jsonData) throws Exception {
        return this.createCall(accessToken, getProgramsApiUrl(), jsonData);
    }

    @RequestMapping(value = "/api/programs/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @PathVariable("id") String id,
                                       @RequestBody String jsonData) throws Exception {
        return this.updateCall(accessToken, getProgramsApiUrl() + "/" + id, jsonData);
    }

    @RequestMapping(value = "/api/programs/{id}", method = RequestMethod.DELETE)
    public String deleteProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @PathVariable("id") String id) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.DELETE, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/contacts/{agencyId}", method = RequestMethod.GET)
    public String getContactListApiCall(@PathVariable("agencyId") String agencyId) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getContactsApiUrl() + "/" + agencyId);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/listingcount/{year}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getListingCountApiCall(@PathVariable("year") String year) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getListingCountApiUrl() + "/" + year);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programCount", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getProgramCount(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramCountApiUrl());
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/eligibilitylistings", method = RequestMethod.GET)
    public String getEligibilitylistingsApiCall() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getEligibilitylistingsApiUrl());
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/dictionaries", method = RequestMethod.GET)
    public String getDictionaries(@RequestParam(required = false) String[] ids) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getDictionaryApiUrl())
                .queryParam("ids", ids);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/search", method = RequestMethod.GET, produces = "application/json")
    public String searchApiCall(@RequestParam(value="keyword", required=false) String keyword,
                                @RequestParam(value="sortBy", required=false, defaultValue="score") String sortBy,
                                @RequestParam(value="page", required=false, defaultValue="0") int page,
                                @RequestParam(value="size", required=false, defaultValue="10") int size,
                                @RequestParam(value="oFilterParam", required = false, defaultValue = "{}") JSONObject oFilterParam) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getSearchApiUrl())
                .queryParam("keyword", keyword)
                .queryParam("includeCount", true)
                .queryParam("sortBy", sortBy)
                .queryParam("page", page)
                .queryParam("size", size)
                .queryParam("oFilterParam", oFilterParam);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/{id}/submit", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    public String submitProgram(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String programId,
                                @RequestBody(required=false) String jsonData) throws Exception {
        return this.actionCall(accessToken, getProgramsApiUrl() + "/" + programId + "/submit", jsonData);
    }

    @RequestMapping(value = "/api/programRequests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequests(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                              @RequestParam(value="keyword", required=false, defaultValue="") String keyword,
                              @RequestParam(value="completed", required=false, defaultValue="false") boolean isCompleted,
                              @RequestParam(value="limit", required=false, defaultValue="100") int limit,
                              @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                              @RequestParam(value="sortBy", required=false, defaultValue="-entryDate") String sortBy,
                              @RequestParam(value="includeCount", required=false, defaultValue="false") boolean includeCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("completed", isCompleted);
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("includeCount", includeCount);
        return getsCall(accessToken, getProgramRequestsApiUrl(), params);
    }

    @RequestMapping(value = "/api/programRequests", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @RequestBody String jsonBody) {
        return createCall(accessToken, getProgramRequestsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String requestId,
                                @RequestBody String jsonBody) {
        return updateCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId, jsonBody);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.DELETE)
    public void deleteRequest(@PathVariable("id") String requestId) {
        deleteCall(getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequestActions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getActions(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @RequestParam(value="limit", required=false, defaultValue="100") int limit,
                             @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                             @RequestParam(value="sortBy", required=false, defaultValue="-title") String sortBy,
                             @RequestParam(value="includeCount", required=false, defaultValue="false") boolean includeCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("includeCount", includeCount);
        return getsCall(accessToken, getProgramRequestActionsApiUrl(), params);
    }

    @RequestMapping(value = "/api/programRequestActions", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                               @RequestBody String jsonBody) throws SQLException, RuntimeException {
        return createCall(accessToken, getProgramRequestActionsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                            @PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(accessToken, getProgramRequestActionsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                               @PathVariable("id") String requestId,
                               @RequestBody String jsonBody) {
        return updateCall(accessToken, getProgramRequestActionsApiUrl() + "/" + requestId, jsonBody);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.DELETE)
    public void deleteAction(@PathVariable("id") String actionId) {
        deleteCall(getProgramRequestActionsApiUrl() + "/" + actionId);
    }

    private String getsCall(String accessToken, String url, Map<String, Object> params) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        for (Map.Entry<String, Object> entry : params.entrySet()) {
            builder.queryParam(entry.getKey(), entry.getValue());
        }

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String actionCall(String accessToken, String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    private String createCall(String accessToken, String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.TEXT_PLAIN_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    private String getCall(String accessToken, String url) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String updateCall(String accessToken, String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        //  Needed for PATCH calls
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        restTemplate.setRequestFactory(requestFactory);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.PATCH, entity, String.class);
        return response.getBody();
    }

    private void deleteCall(String url) {
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        restTemplate.delete(builder.build().encode().toUri());
    }

    @RequestMapping(value = "/api/federalHierarchies/{id}", method = RequestMethod.GET, produces = MediaTypes.HAL_JSON_VALUE)
    public String getFederalHierarchyById(@PathVariable("id") String id) throws SQLException, RuntimeException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaTypes.HAL_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getFederalHierarchiesApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String getProgramRequestsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequests";
    }

    private String getProgramRequestActionsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequestActions";
    }

    private String getProgramsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs";
    }

    private String getRegionalOfficeApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalAgency";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
    }

    private String getFederalHierarchiesApiUrl() {
        return environment.getProperty(API_FEDERAL_HIERARCHY_ENV) + "/fh";
    }

    private String getEligibilitylistingsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/reports/programEligibilityDistribution";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/reports/programCountByYear";
    }

    private String getProgramCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/reports/programCounts";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionaries";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }
}
