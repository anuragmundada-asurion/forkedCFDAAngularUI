package gov.gsa.cfda.aui.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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

    @Resource
    private Environment environment;

    @RequestMapping(value = "/api/programs", method = RequestMethod.GET, produces = "application/json")
    public String getProgramListApiCall(@RequestParam(value="keyword", required=false, defaultValue="") String keyword,
                                        @RequestParam(value="includeCount", required=false, defaultValue="false") Boolean includeCount,
                                        @RequestParam(value="limit", required=false, defaultValue="100") int limit,
                                        @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                                        @RequestParam(value="sortBy", required=false, defaultValue="-title") String sortBy,
                                        @RequestParam(value="status", required=false, defaultValue="") String status) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
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
    public String getProgramApiCall(@PathVariable("id") String id) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs", method = RequestMethod.POST)
    public String createProgramApiCall(@RequestBody String jsonData) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl());
        HttpEntity<?> entity = new HttpEntity<>(jsonData, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/{id}", method = RequestMethod.PUT)
    public String updateProgramApiCall(@PathVariable("id") String id,
                                       @RequestBody String jsonData) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/" + id) ;
        HttpEntity<?> entity = new HttpEntity<>(jsonData, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/{id}", method = RequestMethod.DELETE)
    public String deleteProgramApiCall(@PathVariable("id") String id) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
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

    @RequestMapping(value = "/api/listingcount/{year}", method = RequestMethod.GET)
    public String getListingCountApiCall(@PathVariable("year") String year) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getListingCountApiUrl() + "/" + year);
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

    @RequestMapping(value = "/api/programs/publish/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String publishProgram(@PathVariable("id") String programId,
                                 @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                 @RequestParam (value="reason", required=false) String reason,
                                 @RequestParam (value="programNumber", required=false) String programNumber) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/publish/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason)
                .queryParam("programNumber", programNumber);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programRequests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequests(@RequestParam(value="keyword", required=false, defaultValue="") String keyword,
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
        return getsCall(getProgramRequestsApiUrl(), params);
    }

    @RequestMapping(value = "/api/programRequests", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createRequest(@RequestBody String jsonBody) {
        return createCall(getProgramRequestsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequest(@PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateRequest(@PathVariable("id") String requestId,
                                @RequestBody String jsonBody) {
        return updateCall(getProgramRequestsApiUrl() + "/" + requestId, jsonBody);
    }

    @RequestMapping(value = "/api/programRequests/{id}", method = RequestMethod.DELETE)
    public void deleteRequest(@PathVariable("id") String requestId) {
        deleteCall(getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequestActions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getActions(@RequestParam(value="limit", required=false, defaultValue="100") int limit,
                             @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                             @RequestParam(value="sortBy", required=false, defaultValue="-title") String sortBy,
                             @RequestParam(value="includeCount", required=false, defaultValue="false") boolean includeCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("includeCount", includeCount);
        return getsCall(getProgramRequestActionsApiUrl(), params);
    }

    @RequestMapping(value = "/api/programRequestActions", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createAction(@RequestBody String jsonBody) throws SQLException, RuntimeException {
        return createCall(getProgramRequestActionsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getAction(@PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(getProgramRequestActionsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateAction(@PathVariable("id") String requestId,
                               @RequestBody String jsonBody) {
        return updateCall(getProgramRequestActionsApiUrl() + "/" + requestId, jsonBody);
    }

    @RequestMapping(value = "/api/programRequestActions/{id}", method = RequestMethod.DELETE)
    public void deleteAction(@PathVariable("id") String actionId) {
        deleteCall(getProgramRequestActionsApiUrl() + "/" + actionId);
    }

    private String getsCall(String url, Map<String, Object> params) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        for (Map.Entry<String, Object> entry : params.entrySet()) {
            builder.queryParam(entry.getKey(), entry.getValue());
        }

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String createCall(String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.TEXT_PLAIN_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    private String getCall(String url) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String updateCall(String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.TEXT_PLAIN_VALUE);
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

    @RequestMapping(value = "/api/regionalAgency", method = RequestMethod.GET, produces = "application/json")
    public String getRegionalAgencyListApiCall(@RequestParam(value="keyword", required=false, defaultValue="") String keyword,
                                        @RequestParam(value="includeCount", required=false, defaultValue="true") Boolean includeCount,
                                        @RequestParam(value="limit", required=false, defaultValue="100") int limit,
                                        @RequestParam(value="offset", required=false, defaultValue="0") int offset,
                                        @RequestParam(value="sortBy", required=false, defaultValue="-agency") String sortBy,
                                        @RequestParam(value="agency", required=false) String agency,
                                        @RequestParam(value="division", required=false) String division) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl())
                .queryParam("keyword", keyword)
                .queryParam("includeCount", includeCount)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("sortBy", sortBy)
                .queryParam("agency", agency)
                .queryParam("division", division);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/regionalAgency/{id}", method = RequestMethod.GET, produces = "application/json")
    public String getRegionalAgencyApiCall(@PathVariable("id") String id) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/regionalAgency", method = RequestMethod.POST)
    public String createRegionalAgencyApiCall(@RequestParam(value="agency", required=true) String agencyId,
                                              @RequestParam(value="division", required=false) String divisionId,
                                              @RequestParam(value="branch", required=false) String branch,
                                              @RequestParam(value="region", required=false) String region,
                                              @RequestParam(value="subbranch", required=false) String subbranch,
                                              @RequestParam(value="phone", required=true) String phone,
                                              @RequestParam(value="address", required=false) String address,
                                              @RequestParam(value="city", required=false) String city,
                                              @RequestParam(value="state", required=false) String stateId,
                                              @RequestParam(value="zip", required=false) String zip,
                                              @RequestParam(value="country", required=false) String countryId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl())
                .queryParam("agency", agencyId)
                .queryParam("division", divisionId)
                .queryParam("branch", branch)
                .queryParam("region", region)
                .queryParam("subbranch", subbranch)
                .queryParam("phone", phone)
                .queryParam("address", address)
                .queryParam("city", city)
                .queryParam("state", stateId)
                .queryParam("zip", zip)
                .queryParam("country", countryId);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/regionalAgency/{id}", method = RequestMethod.PUT)
    public String updateRegionalAgencyApiCall(@PathVariable("id") String id,
                                       @RequestBody String jsonData) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        headers.set("Media-Type", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl() + "/" + id) ;
        HttpEntity<?> entity = new HttpEntity<>(jsonData, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/regionalAgency/{id}", method = RequestMethod.DELETE)
    public String deleteRegionalAgencyApiCall(@PathVariable("id") String id) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl() + "/" + id);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.DELETE, entity, String.class);
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

    private String getRegionalAgencyApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalAgency";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
    }

    private String getEligibilitylistingsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs/listings/eligibility";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs/listings";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionaries";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }
}
