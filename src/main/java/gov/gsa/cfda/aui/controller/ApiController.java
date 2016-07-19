package gov.gsa.cfda.aui.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggerFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.StringUtils;
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
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ApiController.class);

    @Resource
    private Environment environment;

    @RequestMapping(value = "/v1/program", method = RequestMethod.GET, produces = "application/json")
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

    @RequestMapping(value = "/v1/program/{id}", method = RequestMethod.GET, produces = "application/json")
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

    @RequestMapping(value = "/v1/program", method = RequestMethod.POST)
    public String createProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @RequestBody String jsonData) throws Exception {
        return this.createCall(accessToken, getProgramsApiUrl(), jsonData);
    }

    @RequestMapping(value = "/v1/program/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateProgramApiCall(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @PathVariable("id") String id,
                                       @RequestBody String jsonData) throws Exception {
        return this.updateCall(accessToken, getProgramsApiUrl() + "/" + id, jsonData, HttpMethod.PATCH);
    }

    @RequestMapping(value = "/v1/program/{id}", method = RequestMethod.DELETE)
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


    @RequestMapping(value = "/v1/program/{id}/submissionNotification", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String notifyAgencyCoordinators(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                      @PathVariable("id") String id) {
        Map<String, Object> params = new HashMap<>();
        return getsCall(accessToken, getProgramsApiUrl() + "/" + id + "/submissionNotification", params);
    }

    @RequestMapping(value = "/v1/contact/{agencyId}", method = RequestMethod.GET)
    public String getContactListApiCall(@PathVariable("agencyId") String agencyId) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getContactsApiUrl() + "/" + agencyId);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/v1/listingCount/{year}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getListingCountApiCall(@PathVariable("year") String year) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getListingCountApiUrl() + "/" + year);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/v1/programCount", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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

    @RequestMapping(value = "/v1/eligibilitylistings", method = RequestMethod.GET)
    public String getEligibilitylistingsApiCall() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getEligibilitylistingsApiUrl());
        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/v1/dictionary", method = RequestMethod.GET)
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

    @RequestMapping(value = "/v1/search", method = RequestMethod.GET, produces = "application/json")
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

    @RequestMapping(value = "/v1/searchHistoricalIndex", method = RequestMethod.GET, produces = "application/json")
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

    @RequestMapping(value = "/v1/program/{id}/submit", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String submitProgram(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String programId,
                                @RequestBody(required = false) String jsonData) throws Exception {
        return this.actionCall(accessToken, getProgramsApiUrl() + "/" + programId + "/submit", jsonData);
    }

    @RequestMapping(value = "/v1/program/{id}/revise", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String reviseProgram(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String programId) throws Exception {
        return this.actionCall(accessToken, getProgramsApiUrl() + "/" + programId + "/revise", null);
    }

    @RequestMapping(value = "/v1/program/isProgramNumberUnique", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
    public String isProgramNumberUnique(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                        @RequestParam(value = "id", required = true, defaultValue = "") String programId,
                                        @RequestParam(value = "programNumber", required = true, defaultValue = "") String programNumber) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("id", programId);
        params.put("programNumber", programNumber);
        return this.getsCall(accessToken, getProgramsApiUrl() + "/isProgramNumberUnique", params);
    }

    @RequestMapping(value = "/v1/program/nextAvailableProgramNumber", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
    public HttpEntity nextAvailableProgramNumber(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                 @RequestParam(value = "organizationId", required = true, defaultValue = "") String organizationId) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("organizationId", organizationId);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.getsCall(accessToken, getProgramsApiUrl() + "/nextAvailableProgramNumber", params));
        } catch (HttpServerErrorException e) {
            log.debug("Exception while getting next available program number", e);
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            JsonObject response = new Gson().fromJson(e.getResponseBodyAsString(), JsonObject.class);
            obj.put("error", response.get("message").getAsString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }
    }

    @RequestMapping(value = "/v1/user/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUser(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                          @PathVariable("id") String userId) {
        return getCall(accessToken, getUsersApiUrl().concat("/").concat(userId));
    }

    @RequestMapping(value = "/v1/user/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateUser(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @PathVariable("id") String userId,
                             @RequestBody String jsonBody) {
        return updateCall(accessToken, getUsersApiUrl().concat("/").concat(userId), jsonBody, HttpMethod.PATCH);
    }

    @RequestMapping(value = "/v1/user", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUsers(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                           @RequestParam(value = "roles", required = false, defaultValue = "") String[] roleIds,
                           @RequestParam(value = "organizations", required = false, defaultValue = "") String[] orgIds) {
        Map<String, Object> params = new HashMap<>();

        if (roleIds != null && !ArrayUtils.isEmpty(roleIds)) {
            params.put("roles", StringUtils.arrayToCommaDelimitedString(roleIds));
        }

        if (orgIds != null && !ArrayUtils.isEmpty(orgIds)) {
            params.put("organizations", StringUtils.arrayToCommaDelimitedString(orgIds));
        }

        return getsCall(accessToken, getUsersApiUrl(), params);
    }

    @RequestMapping(value = "/v1/role", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRoles() {
        Map<String, Object> params = new HashMap<>();
        return getsCall(null, getRolesApiUrl(), params);
    }

    @RequestMapping(value = "/v1/programRequest", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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

    @RequestMapping(value = "/v1/programRequest", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @RequestBody String jsonBody) {
        return createCall(accessToken, getProgramRequestsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/v1/programRequest/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                             @PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/v1/programRequest/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                @PathVariable("id") String requestId,
                                @RequestBody String jsonBody) {
        return updateCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId, jsonBody, HttpMethod.PATCH);
    }

    @RequestMapping(value = "/v1/programRequest/{id}", method = RequestMethod.DELETE)
    public void deleteRequest(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                              @PathVariable("id") String requestId) {
        deleteCall(accessToken, getProgramRequestsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/v1/regionalOffice", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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

    @RequestMapping(value = "/v1/regionalOffice/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRegionalOffice(@PathVariable("id") String officeId) {
        return getCall(null, getRegionalOfficeApiUrl() + "/" + officeId);
    }

    @RequestMapping(value = "/v1/regionalOffice", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @RequestBody String jsonBody) throws SQLException, RuntimeException {
        return this.createCall(accessToken, getRegionalOfficeApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/v1/regionalOffice/{id}", method = RequestMethod.PUT, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                       @PathVariable("id") String officeId,
                                       @RequestBody String jsonData) {
        return this.updateCall(accessToken, getRegionalOfficeApiUrl() + "/" + officeId, jsonData, HttpMethod.PUT);
    }

    @RequestMapping(value = "/v1/regionalOffice/{id}", method = RequestMethod.DELETE)
    public void deleteRegionalOffice(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                     @PathVariable("id") String officeId) throws SQLException, RuntimeException {
        this.deleteCall(accessToken, getRegionalOfficeApiUrl() + "/" + officeId);
    }

    @RequestMapping(value = "/v1/programRequestAction", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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

    @RequestMapping(value = "/v1/programRequestAction", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                               @RequestBody String jsonBody) throws SQLException, RuntimeException {
        return createCall(accessToken, getProgramRequestActionsApiUrl(), jsonBody);
    }

    @RequestMapping(value = "/v1/programRequestAction/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                            @PathVariable("id") String requestId) throws SQLException, RuntimeException {
        return getCall(accessToken, getProgramRequestActionsApiUrl() + "/" + requestId);
    }

    @RequestMapping(value = "/v1/programRequestAction/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateAction(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                               @PathVariable("id") String requestId,
                               @RequestBody String jsonBody) {
        return updateCall(accessToken, getProgramRequestActionsApiUrl() + "/" + requestId, jsonBody, HttpMethod.PATCH);
    }

    @RequestMapping(value = "/v1/programRequestAction/{id}", method = RequestMethod.DELETE)
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

    private String updateCall(String accessToken, String url, String jsonBody, HttpMethod method) {
        RestTemplate restTemplate = new RestTemplate();
        if(method.equals(HttpMethod.PATCH)) {
            //  Needed for PATCH calls only, PUT calls skips this
            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
            restTemplate.setRequestFactory(requestFactory);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Auth-Token", accessToken);
        headers.set("Accept", MediaType.TEXT_PLAIN_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        HttpEntity<?> entity = new HttpEntity<>(jsonBody, headers);

        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), method, entity, String.class);
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

    private String federalHierarchyCall(String id, String ids, String sort, String childrenLevels, String parentLevels) {
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

        if (ids != null && !ids.isEmpty()) {
            builder.queryParam("ids", ids);
        }

//        builder.queryParam("_options.hal.link", false);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/v1/federalHierarchy", method = RequestMethod.GET, produces = MediaTypes.HAL_JSON_VALUE)
    public HttpEntity getFederalHierarchy(@RequestParam(value = "sort", required = false, defaultValue = "name") String sort,
                                          @RequestParam(value = "ids", required = false, defaultValue = "") String ids,
                                          @RequestParam(value = "childrenLevels", required = false, defaultValue = "") String childrenLevels,
                                          @RequestParam(value = "parentLevels", required = false, defaultValue = "") String parentLevels) throws SQLException, RuntimeException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(federalHierarchyCall(null, ids, sort, childrenLevels, parentLevels));
        } catch (HttpClientErrorException e) {
            log.debug("Exception while getting Federal Hierarchy", e);
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            obj.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }

    }

    @RequestMapping(value = "/v1/federalHierarchy/{id}", method = RequestMethod.GET, produces = MediaTypes.HAL_JSON_VALUE)
    public HttpEntity getFederalHierarchyById(@PathVariable("id") String id,
                                              @RequestParam(value = "sort", required = false, defaultValue = "name") String sort,
                                              @RequestParam(value = "childrenLevels", required = false, defaultValue = "") String childrenLevels,
                                              @RequestParam(value = "parentLevels", required = false, defaultValue = "") String parentLevels) throws SQLException, RuntimeException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(federalHierarchyCall(id, null, sort, childrenLevels, parentLevels));
        } catch (HttpClientErrorException e) {
            log.debug("Exception while getting Federal Hierarchy By Id", e);
            JSONObject obj = new JSONObject();
            obj.put("code", e.getStatusCode().value());
            obj.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(obj.toString());
        }
    }

    //getting list of historical index changes for a certain program number
    @RequestMapping(value = "/v1/historicalIndex/{id}", method = RequestMethod.GET)
    public String getHistoricalIndex(@PathVariable("id") String id,
                                     @RequestParam(value = "programNumber", required = false, defaultValue = "") String programNumber) {
        Map<String, Object> params = new HashMap<>();
        params.put("programNumber", programNumber);
        return getsCall(null, getHistoricalIndexApiUrl() + "/" + id, params);
    }

    //for a single historical index change
    @RequestMapping(value = "/v1/historicalChange/{id}", method = RequestMethod.GET)
    public String getSingleHistoricalIndexChange(@PathVariable("id") String id) {
        Map<String, Object> params = new HashMap<>();
        return getsCall(null, getHistoricalChangeApiUrl() + "/" + id, params);
    }

    //manual add historical index
    @RequestMapping(value = "/v1/historicalChange", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    public String createHistoricalIndexChange(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                              @RequestBody String jsonData) {
        return this.createCall(accessToken, getHistoricalChangeApiUrl(), jsonData);
    }

    @RequestMapping(value = "/v1/historicalChange/{id}", method = RequestMethod.PATCH, produces = MediaType.TEXT_PLAIN_VALUE)
    public String updateHistoricalIndexChange(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                              @PathVariable("id") String id,
                                              @RequestBody String jsonData) {
        return this.updateCall(accessToken, getHistoricalChangeApiUrl() + "/" + id, jsonData, HttpMethod.PATCH);
    }

    @RequestMapping(value = "/v1/historicalChange/{id}", method = RequestMethod.DELETE)
    public void deleteHistoricalIndexChange(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                            @PathVariable("id") String id) throws SQLException, RuntimeException {
        this.deleteCall(accessToken, getHistoricalChangeApiUrl() + "/" + id);
    }

    @RequestMapping(value = "/v1/federalHierarchyConfiguration", method = RequestMethod.GET)
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

    @RequestMapping(value = "/v1/federalHierarchyConfiguration/{id}", method = RequestMethod.GET)
    public HttpEntity getFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                       @RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        return ResponseEntity.status(HttpStatus.OK).body(getCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id));
    }

    @RequestMapping(value = "/v1/federalHierarchyConfiguration/{id}", method = RequestMethod.PUT)
    public HttpEntity updateFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                          @RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                          @RequestBody String jsonBody) {


        return ResponseEntity.status(HttpStatus.OK).body(updateCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id, jsonBody, HttpMethod.PUT));
    }

    @RequestMapping(value = "/v1/federalHierarchyConfiguration", method = RequestMethod.POST)
    public HttpEntity createFederalHierarchyConfiguration(@RequestHeader(value = "X-Auth-Token", required = true) String accessToken,
                                                          @RequestBody String jsonBody) {
        return ResponseEntity.status(HttpStatus.OK).body(createCall(accessToken, getFederalHierarchyConfigurationApiUrl(), jsonBody));
    }

    @RequestMapping(value = "/v1/federalHierarchyConfiguration/{id}", method = RequestMethod.DELETE)
    public HttpEntity deleteFederalHierarchyConfiguration(@PathVariable("id") String id,
                                                          @RequestHeader(value = "X-Auth-Token", required = true) String accessToken) {
        this.deleteCall(accessToken, getFederalHierarchyConfigurationApiUrl() + "/" + id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    private String getRolesApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/role";
    }

    private String getUsersApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/user";
    }

    private String getProgramRequestsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequest";
    }

    private String getProgramRequestActionsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programRequestAction";
    }

    private String getProgramsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/program";
    }

    private String getRegionalOfficeApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalOffice";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contact";
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
        return environment.getProperty(API_PROGRAMS_ENV) + "/report/programEligibilityDistribution";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/report/programCountByYear";
    }

    private String getProgramCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/report/programCounts";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionary";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }

    private String getSearchHistoricalIndexApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/searchHistoricalIndex";
    }

    private String getFederalHierarchyConfigurationApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/federalHierarchyConfiguration";
    }
}
