package gov.gsa.cfda.aui;

import org.junit.Test;
import org.junit.Ignore;
import org.junit.Before;
import org.junit.runner.RunWith;
import static junit.framework.Assert.assertEquals;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.beans.factory.annotation.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
public class SeleniumTests {
    private WebDriver driver;
    final private String phantomjsbin = "node_modules/phantomjs-prebuilt/bin/phantomjs";
    final private String base_url = "http://localhost";

    @Value("${local.server.port}")
    private String port;

    @Before
    public void setUp() {
        System.out.println(base_url);
        System.out.println(phantomjsbin);
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setJavascriptEnabled(true);
        caps.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, phantomjsbin);
        driver = new PhantomJSDriver();
    }

    @Test
    public void simpleTest() throws Exception{
        //load homepage and run tasks
        driver.get(base_url+":"+port);
        waitForJSandJQueryToLoad();
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(angularHasFinishedProcessing());
        String title = driver.getTitle();
        System.out.println(title);
        driver.findElement(By.linkText("Sign In As")).click();
        WebElement modal = driver.findElement(By.id("ngdialog1"));
        Select userSelect = new Select (modal.findElement(By.tagName("select")));
        userSelect.selectByVisibleText("Super User");
        modal.findElement(By.tagName("button")).click();
        wait.until(angularHasFinishedProcessing());

        //make assertions
        assertEquals(title, "Home - CFDA: Home");
    }



    private boolean waitForJSandJQueryToLoad() {

        WebDriverWait wait = new WebDriverWait(driver, 30);

        // wait for jQuery to load
        ExpectedCondition<Boolean> jQueryLoad = new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                try {
                    System.out.println("jquery found + loaded");
                    return ((Long)((JavascriptExecutor)driver).executeScript("return jQuery.active") == 0);
                }
                catch (Exception e) {
                    System.out.println("jquery not found");
                    // no jQuery present
                    return true;
                }
            }
        };

        // wait for Javascript to load
        ExpectedCondition<Boolean> jsLoad = new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                System.out.println("js loaded");
                return ((JavascriptExecutor)driver).executeScript("return document.readyState")
                        .toString().equals("complete");
            }
        };

        return wait.until(jQueryLoad) && wait.until(jsLoad);
    }

    public static ExpectedCondition angularHasFinishedProcessing() {
        return new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                String hasAngularFinishedScript = "var callback = arguments[arguments.length - 1];\n" +
                        "var el = document.querySelector('html');\n" +
                        "if (!window.angular) {\n" +
                        "    callback('false')\n" +
                        "}\n" +
                        "if (angular.getTestability) {\n" +
                        "    angular.getTestability(el).whenStable(function(){callback('true')});\n" +
                        "} else {\n" +
                        "    if (!angular.element(el).injector()) {\n" +
                        "        callback('false')\n" +
                        "    }\n" +
                        "    var browser = angular.element(el).injector().get('$browser');\n" +
                        "    browser.notifyWhenNoOutstandingRequests(function(){callback('true')});\n" +
                        "}";

                JavascriptExecutor javascriptExecutor = (JavascriptExecutor) driver;
                String isProcessingFinished = javascriptExecutor.executeAsyncScript(hasAngularFinishedScript).toString();
                System.out.println(isProcessingFinished);
                return Boolean.valueOf(isProcessingFinished);
            }
        };
    }
}
