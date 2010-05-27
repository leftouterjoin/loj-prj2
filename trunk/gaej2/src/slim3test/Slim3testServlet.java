package slim3test;

import java.io.IOException;
import javax.servlet.http.*;

import org.slim3.datastore.Datastore;
import org.slim3.datastore.EntityNotFoundRuntimeException;

import com.google.appengine.api.datastore.Key;

@SuppressWarnings("serial")
public class Slim3testServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		int id;
		id = 1;

		Key key = Datastore.createKey(Hoge.class, id);
//		Hoge hoge = new Hoge();
//		hoge.setId(key);
//		hoge.setMsg("Hello, Slim3 Datastore!");
//		Datastore.put(hoge);

		HogeMeta meta = new HogeMeta();

		try{
			Hoge item = Datastore.get(meta,key);

			resp.setContentType("text/plain");
			resp.getWriter().println(item.getMsg());
		}
		catch(EntityNotFoundRuntimeException e){

		}


	}
}