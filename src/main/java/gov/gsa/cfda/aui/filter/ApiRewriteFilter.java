package gov.gsa.cfda.aui.filter;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ApiRewriteFilter implements Filter {
    public static final String API_PROGRAMS_ENV = "pub.api.programs";
    public static final String API_SEARCH_ENV = "pub.api.search";
    public static final  Map<String, String> MAPPING = new HashMap<>();;

    @Resource
    private Environment environment;

    @Override
    public void init(FilterConfig config) throws ServletException {
            MAPPING.put("/v1/eligibilitylistings", this.getEligibilitylistingsApiUrl());
            MAPPING.put("/v1/listingcount", this.getListingCountApiUrl());
            MAPPING.put("/v1/program", this.getProgramsApiUrl());
            MAPPING.put("/v1/programRequest", this.getProgramRequestsApiUrl());
            MAPPING.put("/v1/programRequestAction", this.getProgramRequestActionsApiUrl());
            MAPPING.put("/v1/regionalAgency", this.getRegionalAgencyApiUrl());
            MAPPING.put("/v1/contact", this.getContactsApiUrl());
            MAPPING.put("/v1/dictionary", this.getDictionaryApiUrl());
            MAPPING.put("/v1/search", this.getSearchApiUrl());
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        String requestURI = request.getRequestURI();
        boolean redirected = false;

        for (Map.Entry<String, String> entry : MAPPING.entrySet()) {
            String pattern = "(.*)".concat(entry.getKey()).concat("(.*)");
            if (requestURI.matches(pattern)) {
                //  TODO Handle Redirect
            }
        }

        if (!redirected) {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void destroy() {
        //  No destruction required
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

    private String getRegionalAgencyApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/regionalAgency";
    }

    private String getContactsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/contact";
    }

    private String getEligibilitylistingsApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/program/listings/eligibility";
    }

    private String getListingCountApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/program/listings";
    }

    private String getDictionaryApiUrl() {
        return environment.getProperty(API_PROGRAMS_ENV) + "/dictionary";
    }

    private String getSearchApiUrl() {
        return environment.getProperty(API_SEARCH_ENV) + "/search";
    }
}