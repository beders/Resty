package us.monoid.web.ssl;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

@Path(HelloWorldTestResource.HELLO_WORLD_PATH)
@Consumes(MediaType.APPLICATION_JSON)
public class HelloWorldTestResource {
    public final static String HELLO_WORLD = "Hello World";
    public static final String HELLO_WORLD_PATH = "/hello-world";

    @GET
    public String get() {
        return HELLO_WORLD;
    }
}
