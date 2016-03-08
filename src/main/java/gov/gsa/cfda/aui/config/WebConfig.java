package gov.gsa.cfda.aui.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author Jihad MOTII
 */
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
			"/programs/add/{section:\\w+}",
			"/programs/{id:\\w+}/edit/{section:\\w+}",
			"/programs/main",
			"/programs/main/{status:\\w+}",
			"/agency/main",
			"/unauthorized",
			"/forbidden"
	})
	public String index() {
	    return "forward:/index.html";
	}
    }
}