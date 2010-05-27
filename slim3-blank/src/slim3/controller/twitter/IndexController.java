package slim3.controller.twitter;

import java.util.List;

import org.slim3.controller.Controller;
import org.slim3.controller.Navigation;

import slim3.model.Tweet;
import slim3.service.TwitterService;

public class IndexController extends Controller {
    private TwitterService service = new TwitterService();
    
    @Override
    public Navigation run() throws Exception {
        List<Tweet> tweetList = service.getTweetList();
        requestScope("tweetList", tweetList);
        return forward("index.jsp");
    }
}
