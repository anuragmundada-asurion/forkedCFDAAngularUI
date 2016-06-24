package gov.gsa.cfda.aui.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
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
                                        @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
                                        @RequestParam(value = "includeCount", required = false, defaultValue = "false") Boolean includeCount,
                                        @RequestParam(value = "limit", required = false, defaultValue = "100") int limit,
                                        @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                                        @RequestParam(value = "sortBy", required = false, defaultValue = "-title") String sortBy,
                                        @RequestParam(value = "status", required = false, defaultValue = "") String statuses,
                                        @RequestParam(value = "latest", required = false, defaultValue = "true") boolean latest,
                                        @RequestParam(value = "organizationId", required = false, defaultValue = "") String organizationId,
                                        @RequestParam(value = "programNumber", required = false, defaultValue = "") String programNumber) {
        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("includeCount", includeCount);
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("status", statuses);
        params.put("latest", latest);
        params.put("organizationId", organizationId);
        params.put("programNumber", programNumber);
        return getsCall(accessToken, getProgramsApiUrl(), params);
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

    @RequestMapping(value = "/api/listingCount/{year}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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
    public String searchApiCall(@RequestParam(value = "keyword", required = false) String keyword,
                                @RequestParam(value = "sortBy", required = false, defaultValue = "score") String sortBy,
                                @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                                @RequestParam(value = "size", required = false, defaultValue = "10") int size,
                                @RequestParam(value = "oFilterParam", required = false, defaultValue = "{}") JSONObject oFilterParam) {
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

    @RequestMapping(value = "/api/searchHistoricalIndex", method = RequestMethod.GET, produces = "application/json")
    public String searchHistoricalIndexApiCall(@RequestParam(value = "keyword", required = false) String keyword,
                                               @RequestParam(value = "sortBy", required = false, defaultValue = "score") String sortBy,
                                               @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                                               @RequestParam(value = "size", required = false, defaultValue = "10") int size,
                                               @RequestParam(value = "oFilterParam", required = false, defaultValue = "{}") JSONObject oFilterParam) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getSearchHistoricalIndexApiUrl())
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

    @RequestMapping(value = "/api/programs/{id}/submit", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String submitProgram(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String programId,
                                @RequestBody(required = false) String jsonData) throws Exception {
        return this.actionCall(accessToken, getProgramsApiUrl() + "/" + programId + "/submit", jsonData);
    }

    @RequestMapping(value = "/api/programs/{id}/revise", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String reviseProgram(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String programId) throws Exception {
        return this.actionCall(accessToken, getProgramsApiUrl() + "/" + programId + "/revise", null);
    }

    @RequestMapping(value = "/api/programs/isProgramNumberUnique", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String isProgramNumberUnique(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                        @RequestParam(value = "id", required = true, defaultValue = "") String programId,
                                        @RequestParam(value = "programNumber", required = true, defaultValue = "") String programNumber) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("id", programId);
        params.put("programNumber", programNumber);
        return this.getsCall(accessToken, getProgramsApiUrl() + "/isProgramNumberUnique", params);
    }

    @RequestMapping(value = "/api/programs/nextAvailableProgramNumber", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
    public HttpEntity nextAvailableProgramNumber(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                 @RequestParam(value = "organizationId", required = true, defaultValue = "") String organizationId) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("organizationId", organizationId);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.getsCall(accessToken, getProgramsApiUrl() + "/nextAvailableProgramNumber", params));
        } catch (HttpServerErrorException e) {
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            JsonObject response = new Gson().fromJson(e.getResponseBodyAsString(), JsonObject.class);
            obj.put("error", response.get("message").getAsString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }
    }

    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUser(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                          @PathVariable("id") String userId) {
        return getCall(accessToken, getUsersApiUrl().concat("/").concat(userId));
    }

    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateUser(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @PathVariable("id") String userId,
                             @RequestBody String jsonBody) {
        return updateCall(accessToken, getUsersApiUrl().concat("/").concat(userId), jsonBody);
    }

    @RequestMapping(value = "/api/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUsers(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        Map<String, Object> params = new HashMap<>();
        return getsCall(accessToken, getUsersApiUrl(), params);
    }

    @RequestMapping(value = "/api/roles", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRoles() {
        Map<String, Object> params = new HashMap<>();
        return getsCall(null, getRolesApiUrl(), params);
    }

    @RequestMapping(value = "/api/programRequests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequests(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                              @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
                              @RequestParam(value = "type", required = false, defaultValue = "") String types,
                              @RequestParam(value = "program", required = false, defaultValue = "") String programId,
                              @RequestParam(value = "completed", required = false, defaultValue = "false") boolean isCompleted,
                              @RequestParam(value = "limit", required = false, defaultValue = "100") int limit,
                              @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                              @RequestParam(value = "sortBy", required = false, defaultValue = "-entryDate") String sortBy,
                              @RequestParam(value = "includeCount", required = false, defaultValue = "false") boolean includeCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("type", types);
        params.put("program", programId);
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
    public void deleteRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                              @PathVariable("id") String requestId) {
        deleteCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/api/regionalOffices", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRegionalOffices(@RequestHeader(value = "X-Auth-Token", required = false) String accessToken,
                                     @RequestParam(value = "all", required = false, defaultValue = "false") boolean all,
                                     @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
                                     @RequestParam(value = "includeCount", required = false, defaultValue = "false") Boolean includeCount,
                                     @RequestParam(value = "limit", required = false, defaultValue = "100") int limit,
                                     @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                                     @RequestParam(value = "sortBy", required = false, defaultValue = "-organizationId") String sortBy,
                                     @RequestParam(value = "oFilterParam", required = false, defaultValue = "{}") String oFilterParams) {
        Map<String, Object> params = new HashMap<>();
        params.put("all", all);
        params.put("keyword", keyword);
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("includeCount", includeCount);
        params.put("oFilterParam", oFilterParams);
        return getsCall(accessToken, getRegionalOfficeApiUrl(), params);
    }

    @RequestMapping(value = "/api/regionalOffices/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRegionalOffice(@PathVariable("id") String officeId) {
        return getCall(null, getRegionalOfficeApiUrl() + "/" + officeId);
    }

    @RequestMapping(value = "/api/regionalOffices", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @RequestBody String jsonBody) throws SQLException, RuntimeException {
        return this.createCall(accessToken, getRegionalOfficeApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/api/regionalOffices/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @PathVariable("id") String officeId,
                                       @RequestBody String jsonData) {
        return this.updateCall(accessToken, getRegionalOfficeApiUrl() + "/" + officeId, jsonData);
    }

    @RequestMapping(value = "/api/regionalOffices/{id}", method = RequestMethod.DELETE)
    public void deleteRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                     @PathVariable("id") String officeId) throws SQLException, RuntimeException {
        this.deleteCall(accessToken, getRegionalOfficeApiUrl() + "/" + officeId);
    }

    @RequestMapping(value = "/api/programRequestActions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getActions(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @RequestParam(value = "limit", required = false, defaultValue = "100") int limit,
                             @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                             @RequestParam(value = "sortBy", required = false, defaultValue = "-title") String sortBy,
                             @RequestParam(value = "includeCount", required = false, defaultValue = "false") boolean includeCount) {
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
    public void deleteAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @PathVariable("id") String actionId) {
        deleteCall(accessToken, getProgramRequestActionsApiUrl() + "/" + actionId);
    }

    private String getsCall(String accessToken, String url, Map<String, Object> params) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        if (accessToken != null && !accessToken.isEmpty()) {
            headers.add("X-Auth-Token", accessToken);
        }

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
        headers.set("Accept", MediaType.TEXT_PLAIN_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);

        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.PATCH, entity, String.class);
        return response.getBody();
    }

    private void deleteCall(String accessToken, String url) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(null, headers);
        restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.DELETE, entity, String.class);
    }

    private String federalHierarchyCall(String id, String sort, String childrenLevels, String parentLevels) {
        String url = getFederalHierarchiesApiUrl();
        if (id != null && !id.isEmpty()) {
            url += '/' + id;
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaTypes.HAL_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        if (parentLevels.equalsIgnoreCase("all")) {
            builder.queryParam("parentLevels", "all");
        } else {
            builder.queryParam("parentLevels", parentLevels);
        }

        if (childrenLevels.equalsIgnoreCase("all")) {
            builder.queryParam("childrenLevels", "all");
        } else {
            builder.queryParam("childrenLevels", childrenLevels);
        }

        if (sort != null && !sort.isEmpty()) {
            builder.queryParam("sort", sort);
        }

//        builder.queryParam("_options.hal.link", false);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/federalHierarchies", method = RequestMethod.GET, produces = MediaTypes.HAL_JSON_VALUE)
    public HttpEntity getFederalHierarchy(@RequestParam(value = "sort", required = false, defaultValue = "name") String sort,
                                          @RequestParam(value = "childrenLevels", required = false, defaultValue = "") String childrenLevels,
                                          @RequestParam(value = "parentLevels", required = false, defaultValue = "") String parentLevels) throws SQLException, RuntimeException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(federalHierarchyCall(null, sort, childrenLevels, parentLevels));
        } catch (HttpClientErrorException e) {
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            obj.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }

    }

    @RequestMapping(value = "/api/federalHierarchies/{id}", method = RequestMethod.GET, produces = MediaTypes.HAL_JSON_VALUE)
    public HttpEntity getFederalHierarchyById(@PathVariable("id") String id,
                                              @RequestParam(value = "sort", required = false, defaultValue = "name") String sort,
                                              @RequestParam(value = "childrenLevels", required = false, defaultValue = "") String childrenLevels,
                                              @RequestParam(value = "parentLevels", required = false, defaultValue = "") String parentLevels) throws SQLException, RuntimeException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(federalHierarchyCall(id, sort, childrenLevels, parentLevels));
        } catch (HttpClientErrorException e) {
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            obj.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }
    }

    //getting list of historical index changes for a certain program number
    @RequestMapping(value = "/api/historicalIndex/{id}", method = RequestMethod.GET)
    public String getHistoricalIndex(@PathVariable("id") String id,
                                     @RequestParam(value = "programNumber", required = false, defaultValue = "") String programNumber) {
        Map<String, Object> params = new HashMap<>();
        params.put("programNumber", programNumber);
        return getsCall(null, getHistoricalIndexApiUrl() + "/" + id, params);
    }

    //for a single historical index change
    @RequestMapping(value = "/api/historicalChange/{id}", method = RequestMethod.GET)
    public String getSingleHistoricalIndexChange(@PathVariable("id") String id) {
        Map<String, Object> params = new HashMap<>();
        return getsCall(null, getHistoricalChangeApiUrl() + "/" + id, params);
    }

    @RequestMapping(value = "/api/historicalChange/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateHistoricalIndexChange(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                              @PathVariable("id") String id,
                                              @RequestBody String jsonData) {
        return this.updateCall(accessToken, getHistoricalChangeApiUrl() + "/" + id, jsonData);
    }

    @RequestMapping(value = "/api/historicalChange/{id}", method = RequestMethod.DELETE)
    public void deleteHistoricalIndexChange(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                            @PathVariable("id") String id) throws SQLException, RuntimeException {
        this.deleteCall(accessToken, getHistoricalChangeApiUrl() + "/" + id);
    }

    @RequestMapping(value = "/api/federalHierarchyConfigurations", method = RequestMethod.GET)
    public String getFederalHierarchyConfigurationsList(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                        @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
                                                        @RequestParam(value = "includeCount", required = false, defaultValue = "false") Boolean includeCount,
                                                        @RequestParam(value = "limit", required = false, defaultValue = "100") int limit,
                                                        @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                                                        @RequestParam(value = "sortBy", required = false, defaultValue = "-organizationId") String sortBy,
                                                        @RequestParam(value = "oFilterParam", required = false, defaultValue = "{}") String oFilterParams) {
        Map<String, Object> params = new HashMap<>();
        params.put("keyword", keyword);
        params.put("limit", limit);
        params.put("offset", offset);
        params.put("sortBy", sortBy);
        params.put("includeCount", includeCount);
        params.put("oFilterParam", oFilterParams);
        return getsCall(accessToken, getFederalHierarchyConfigurationApiUrl(), params);
    }

    @RequestMapping(value = "/api/federalHierarchyConfigurations/{id}", method = RequestMethod.GET)
    public HttpEntity getFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                       @RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        return ResponseEntity.status(HttpStatus.OK).body(getCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id));
    }

    @RequestMapping(value = "/api/federalHierarchyConfigurations/{id}", method = RequestMethod.PATCH)
    public HttpEntity updateFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                          @RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                          @RequestBody String jsonBody) {


        return ResponseEntity.status(HttpStatus.OK).body(updateCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id, jsonBody));
    }

    @RequestMapping(value = "/api/federalHierarchyConfigurations", method = RequestMethod.POST)
    public HttpEntity createFederalHierarchyConfiguration(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                          @RequestBody String jsonBody) {
        return ResponseEntity.status(HttpStatus.OK).body(createCall(accessToken, getFederalHierarchyConfigurationApiUrl(), jsonBody));
    }

    @RequestMapping(value = "/api/federalHierarchyConfigurations/{id}", method = RequestMethod.DELETE)
    public HttpEntity deleteFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                          @RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        this.deleteCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    private String getRolesApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/roles";
    }

    private String getUsersApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/users";
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
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalOffices";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
    }

    private String getFederalHierarchiesApiUrl() {
        return environment.getProperty(API_FEDERAL_HIERARCHY_ENV);
    }

    private String getHistoricalIndexApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/historicalIndex";
    }

    private String getHistoricalChangeApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/historicalChange";
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

    private String getSearchHistoricalIndexApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/searchHistoricalIndex";
    }

    private String getFederalHierarchyConfigurationApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/federalHierarchyConfigurations";
    }
}
