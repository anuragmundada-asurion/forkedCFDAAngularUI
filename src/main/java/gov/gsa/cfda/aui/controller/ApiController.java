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
                                        @RequestParam(value="sortBy", required=false, defaultValue="-title") String sortBy) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl())
                .queryParam("keyword", keyword)
                .queryParam("includeCount", includeCount)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("sortBy", sortBy);

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
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getProgramsApiUrl() + "/" + id);
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
                                @RequestParam(value="size", required=false, defaultValue="10") int size) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getSearchApiUrl())
                .queryParam("keyword", keyword)
                .queryParam("includeCount", true)
                .queryParam("sortBy", sortBy)
                .queryParam("page", page)
                .queryParam("size", size);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        HttpEntity<String> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String getProgramsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/programs";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contacts";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/listingcount";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionaries";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }
}
