■1
/sql4gtest2/war/WEB-INF/appengine-web.xml
に
<sessions-enabled>true</sessions-enabled>
を追加

■2
/sql4gtest2/war/WEB-INF/web.xml
に
    <servlet>
        <servlet-name>SQL4GAdmin</servlet-name>
        <servlet-class>jp.littlesoft.sql4g.SQL4GServlet</servlet-class>
        <init-param>
            <param-name>VelocityFileLoaderPath</param-name>
            <param-value>template</param-value>
        </init-param>
        <init-param>
            <param-name>sql4g.instanceId</param-name>
            <param-value>1</param-value>
        </init-param>
    </servlet>
    <servlet-mapping>
        <servlet-name>SQL4GAdmin</servlet-name>
        <url-pattern>/sql4gadmin</url-pattern>
    </servlet-mapping>
を追加

■3
sql4g.jar/webres/**をwar/へコピー

■4
これらをwar/WEB-INF/lib/へコピー

commons-fileupload-1.2.1.jar
log4j-1.2.15.jar
lsj-1.3.jar
sql4g.jar
velocity-1.6.2-dep.jar
