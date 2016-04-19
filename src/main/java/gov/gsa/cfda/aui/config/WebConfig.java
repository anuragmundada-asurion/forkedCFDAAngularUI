package gov.gsa.cfda.aui.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    /**
     * Maps all AngularJS routes to index so that they work with direct linking.
     */
    @Controller
    static class Routes {
        @RequestMapping({
                "/search",
                "/advanced-search",

                "/programs/add/",
                "/programs/add/{section:\\w+}",
                "/programs/{id:\\w+}/edit/{section:\\w+}",
                "/programs",
                "/programs/{list:\\w+}/{filter:\\w+}",
                "/programs/{id:\\w+}/view",
                "/programs/{id:\\w+}/preview",
                "/programs/{id:\\w+}/review",

                "/agency/main",
                "/agency/edit/{id:\\w+}",
                "/agency/review/{id:\\w+}",
                "/agency/create",

                "/regionalOffice",
                "/regionalOffice/create",
                "/regionalOffice/{id:\\w+}/edit",
                "/regionalOffice/{id:\\w+}/view",


                "/organizationList",
//                "/regionalOffice/create",
                "/organization/{id:\\w+}/edit",
                "/organization/{id:\\w+}/view",

                "/unauthorized",
                "/forbidden",

        })
        public String index() {
            return "forward:/index.html";
        }
    }
}