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

    @RequestMapping(value = "/api/programs/archive/request/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String archiveProgramRequest(@PathVariable("id") String programId,
                                        @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                        @RequestParam (value="reason", required=true) String reason) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/archive/request/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/publish/request/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String publishProgramRequest(@PathVariable("id") String programId,
                                        @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                        @RequestParam (value="reason", required=false, defaultValue="") String reason,
                                        @RequestBody String jsonData) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/publish/request/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(jsonData, headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/unarchive/request/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String unarchiveProgramRequest(@PathVariable("id") String programId,
                                          @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                          @RequestParam (value="reason", required=true) String reason) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/unarchive/request/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/archive/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String archiveProgram(@PathVariable("id") String programId,
                                 @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                 @RequestParam (value="reason", required=true) String reason,
                                 @RequestParam (value="programNumber", required=true) String programNumber) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/archive/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason)
                .queryParam("programNumber", programNumber);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/unarchive/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String unarchiveProgram(@PathVariable("id") String programId,
                                   @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                   @RequestParam (value="reason", required=true) String reason,
                                   @RequestParam (value="programNumber", required=true) String programNumber)throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/unarchive/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason)
                .queryParam("programNumber", programNumber);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
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

    @RequestMapping(value = "/api/programs/archive/reject/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String rejectArchiveProgram(@PathVariable("id") String programId,
                                       @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                       @RequestParam (value="reason", required=true) String reason) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/archive/reject/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/unarchive/reject/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String rejectUnarchiveProgram(@PathVariable("id") String programId,
                                         @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                         @RequestParam (value="reason", required=true) String reason) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/unarchive/reject/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    @RequestMapping(value = "/api/programs/publish/reject/{id}", method = RequestMethod.POST, produces = { MediaType.TEXT_PLAIN_VALUE })
    public String rejectPublishProgram(@PathVariable("id") String programId,
                                       @RequestParam (value="parentProgramId", required=false) String parentProgramId,
                                       @RequestParam (value="reason", required=true) String reason) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/publish/reject/" + programId)
                .queryParam("parentProgramId", parentProgramId)
                .queryParam("reason", reason);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.POST, entity, String.class);
        return response.getBody();
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
                                              @RequestParam(value="street", required=false) String street,
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
                .queryParam("street", street)
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
                                              @RequestParam(value="address_id", required=true) String addressId,
                                              @RequestParam(value="agency", required=true) String agencyId,
                                              @RequestParam(value="division", required=false) String divisionId,
                                              @RequestParam(value="branch", required=false) String branch,
                                              @RequestParam(value="region", required=false) String region,
                                              @RequestParam(value="subbranch", required=false) String subbranch,
                                              @RequestParam(value="phone", required=true) String phone,
                                              @RequestParam(value="street", required=false) String street,
                                              @RequestParam(value="city", required=false) String city,
                                              @RequestParam(value="state", required=false) String stateId,
                                              @RequestParam(value="zip", required=false) String zip,
                                              @RequestParam(value="country", required=false) String countryId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getRegionalAgencyApiUrl() + "/" + id)
                .queryParam("address_id", addressId)
                .queryParam("agency", agencyId)
                .queryParam("division", divisionId)
                .queryParam("branch", branch)
                .queryParam("region", region)
                .queryParam("subbranch", subbranch)
                .queryParam("phone", phone)
                .queryParam("street", street)
                .queryParam("city", city)
                .queryParam("state", stateId)
                .queryParam("zip", zip)
                .queryParam("country", countryId);
        HttpEntity<?> entity = new HttpEntity<>(headers);
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

    private String getProgramsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs";
    }

    private String getRegionalAgencyApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalAgency";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
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
