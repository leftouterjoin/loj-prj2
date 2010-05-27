package slim3.controller.twitter;

import org.slim3.datastore.Datastore;
import org.slim3.tester.ControllerTestCase;
import org.junit.Test;

import slim3.model.Tweet;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TweetControllerTest extends ControllerTestCase {

    @Test
    public void run() throws Exception {
        tester.param("content", "Hello");
        tester.start("/twitter/tweet");
        TweetController controller = tester.getController();
        assertThat(controller, is(notNullValue()));
        assertThat(tester.isRedirect(), is(true));
        assertThat(tester.getDestinationPath(), is("/twitter/"));
        Tweet stored = Datastore.query(Tweet.class).asSingle();
        assertThat(stored, is(notNullValue()));
        assertThat(stored.getContent(), is("Hello"));
    }
}
