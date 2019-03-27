1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [NetLicensing Agent](NetLicensing-Agent_17432579.html)

<span id="title-text"> NetLicensing Wiki : Securing the Agent with SSL/TLS </span>
==================================================================================

Created by <span class="author"> Andrew Yushkevich</span>, last modified
by <span class="editor"> Konstantin Korotkov</span> on 18-11-2018

-   [Motivation](#SecuringtheAgentwithSSL/TLS-Motivation)
-   [Apache HTTP](#SecuringtheAgentwithSSL/TLS-ApacheHTTP)
    -   [httpd.conf](#SecuringtheAgentwithSSL/TLS-httpd.conf)
    -   [httpd-vhosts.conf:](#SecuringtheAgentwithSSL/TLS-httpd-vhosts.conf:)
    -   [Running Agent and
        Apache](#SecuringtheAgentwithSSL/TLS-RunningAgentandApache)
-   [Nginx](#SecuringtheAgentwithSSL/TLS-Nginx)
    -   [nginx.conf](#SecuringtheAgentwithSSL/TLS-nginx.conf)
    -   [Running Agent and
        Nginx](#SecuringtheAgentwithSSL/TLS-RunningAgentandNginx)
-   [Managing of SSL certificates for the hosts in local
    network](#SecuringtheAgentwithSSL/TLS-ManagingofSSLcertificatesforthehostsinlocalnetwork)
    -   [Certificates signed by a Certificate Authority
        (CA)](#SecuringtheAgentwithSSL/TLS-CertificatessignedbyaCertificateAuthority(CA))
    -   [Self-signed
        certificates](#SecuringtheAgentwithSSL/TLS-Self-signedcertificates)
-   [Known Issues](#SecuringtheAgentwithSSL/TLS-KnownIssues)
-   [Useful links](#SecuringtheAgentwithSSL/TLS-Usefullinks)

Motivation
==========

Agent has a fully functional built-in HTTP server, however plain HTTP is
not secure, it is easy to alter the agent reply, mangling the validation
result. This security threat can be mitigated by encrypting connection
with SSL/TLS, however this requires proper managing of SSL certificate,
which is not supported by the Agent alone. Solution is to delegate
SSL/TLS handling to the external HTTP server, forwarding plain HTTP
requests to NetLicensing Agent within local secure environment.

Below you will find configuration instructions for some popular HTTP
servers, as well as recommendations to managing of SSL certificates.

Apache HTTP
===========

You can find the latest Apache HTTP Server
at <a href="https://httpd.apache.org/" class="external-link">https://httpd.apache.org/</a><span
style="color: rgb(51,51,51);">. Below you will find examples for Apache
2.2 and 2.4.</span>

httpd.conf
----------

-   Ensure these modules are loaded:

    **httpd.conf**

    ``` theme:
    # Proxy
    LoadModule proxy_module lib/httpd/modules/mod_proxy.so
    LoadModule proxy_http_module lib/httpd/modules/mod_proxy_http.so
    # SSL/TLS
    LoadModule ssl_module lib/httpd/modules/mod_ssl.so
    ```

-   Enable virtual hosts configuration: 

    **httpd.conf**

    ``` theme:
    Include conf/extra/httpd-vhosts.conf
    ```

-   Enable SSL configuration:

    **httpd.conf**

    ``` theme:
     Include conf/extra/httpd-ssl.conf
    ```

httpd-vhosts.conf:
------------------

-   Forward insecure connection to secure URL:

    **conf/extra/httpd-vhosts.conf**

    ``` theme:
    <VirtualHost *:80>
        ServerName "yourhost.com"
        Redirect permanent / https://yourhost.com/ 
    </VirtualHost>
    ```

-   Proxy requests over secure connection to NetLicensing Agent:

    **conf/extra/httpd-vhosts.conf**

    ``` theme:
    <VirtualHost *:443>
        ServerName "yourhost.com"

        ProxyRequests Off
        ProxyVia Off

        <Proxy *>
          AddDefaultCharset off
          ## Apache 2.2
          #Order deny,allow
          #Allow from all
          ## Apache 2.4
          Require all granted
        </Proxy>

        ProxyPass / http://localhost:8080/

        SSLEngine On
        #path to you local sectificate
        SSLCertificateFile /usr/local/etc/httpd/server.crt
        SSLCertificateKeyFile /usr/local/etc/httpd/server.key
    </VirtualHost>
    ```

-   Replace port `8080` with the actual port Agent is listening on

-   Replace `yourhost.com` with the actual host name of your server

Running Agent and Apache
------------------------

1.  Start Agent with '`run-agent-offline`' or '`run-agent`' action. Pay
    attention to the port specified in `conf/extra/httpd-vhosts.conf`

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

2.  Start Apache

3.  NetLicensing Agent will respond to the validation requests sent over
    HTTPS to <span
    style="font-family: monospace;">yourhost.com:443</span>

Nginx
=====

You can find the latest Nginx HTTP Server
at <a href="https://nginx.org/en/download.html" class="external-link">https://nginx.org/en/download.html</a>.
For this example we are using Nginx 1.13.9.

<span style="color: rgb(0,0,0);"><span
style="color: rgb(0,0,0);"> </span></span>

nginx.conf
----------

-   Forward insecure connection to secure URL:

    **nginx.conf**

    ``` theme:
     server {
            listen       80;
            server_name  yourhost.com  alias  yourhost.com.alias;
            return 301 https://yourhost.com;
    }
    ```

-   Proxy requests over secure connection to NetLicensing Agent:

    **nginx.conf**

    ``` theme:
    # HTTPS server
    server {
        listen       443 ssl;
        server_name  yourhost.com  alias  yourhost.com.alias;
     
        #path to you local sectificate
        ssl_certificate      /usr/local/etc/httpd/server.crt;
        ssl_certificate_key  /usr/local/etc/httpd/server.key;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
        location / {
            proxy_pass       http://localhost:8080;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            }
        }
    ```

-   Replace port `8080` with the actual port Agent is listening on

-   Replace `yourhost.com` with the actual host name of your server

 

Running Agent and Nginx
-----------------------

1.  Start Agent with `'run-agent-offline'` or `'run-agent'` action. Pay
    attention to the port specified in `nginx.conf`

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

2.  Start Nginx

3.  NetLicensing Agent will respond to the validation requests sent over
    HTTPS to `yourhost.com:443`

     

Managing of SSL certificates for the hosts in local network
===========================================================

Certificates signed by a Certificate Authority (CA)
---------------------------------------------------

In case you have a public or private Certificate Authority (CA)
infrastructure available within your network, the preferrable way is to
let CA issue the SSL certificate. Details are not in scope of this
document, but should be normally availble from the corresponding CA.

This external resource maybe
helpful: <a href="https://roll.urown.net/ca/index.html" class="external-link">https://roll.urown.net/ca/index.html</a>

Self-signed certificates
------------------------

For creating self-signed certificate you can use openssl tool or a
number of other methods.

Here are some useful links:

-   <a href="https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl" class="external-link">How to create a self-signed certificate with openssl</a>
-   <a href="https://support.apple.com/kb/PH20131?locale=en_US&amp;viewlocale=en_US" class="external-link">Keychain for Mac: Create self-signed certificates using Keychain Access</a>
-   <a href="https://msdn.microsoft.com/en-us/library/ff699202.aspx" class="external-link">Windows: How to: Create Your Own Test Certificate</a>

Self-signed certificate must be explicitly trusted by a client side via
appropriate installation, it can not be automatically validated against
a known certificate authority. Certificate installation procedure
depends on the environment your client is running on, below you can find
some hints:

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Java</span>

<span style="color: rgb(36,41,46);">Java uses its own keystore for
certificates (separate from the OS keystore). Therefore, you must
install the appropriate certificate in *Java's* keystore.</span>

**Mac OS X**

``` theme:
$ cd $JAVA_HOME/bin
$ sudo keytool -import -trustcacerts -keystore <path-to-keystore> -storepass changeit -noprompt -alias <alias-name> -file <path-to-certificate>
```

**Windows**

``` theme:
> cd %JAVA_HOME%\bin
> keytool.exe -import -trustcacerts -keystore "<path-to-keystore>" -storepass changeit -noprompt -alias <alias-name> -file "<path-to-certificate>"
```

**Linux**

``` theme:
$ sudo $JAVA_HOME/bin/keytool -import -trustcacerts -keystore <path-to-keystore> -storepass changeit -noprompt -alias <alias-name> -file <path-to-certificate>
```

Where:

-   *\<alias-name\>* - some descriptive name of your choice that will
    identify your key in keystore
-   *\<path-to-certificate\> *- path to the self-signed certificate
-   *\<path-to-keystore\> *- depends on the operating system and java
    installation path, here are some standard locations:
    -   Mac OS X: *$JAVA\_HOME/lib/security/cacerts*
    -   Windows: *%JAVA\_HOME%\\lib\\security\\cacerts*
    -   Linux: *$JAVA\_HOME/lib/security/cacerts*

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">C\#</span>

<span style="color: rgb(36,39,41);">C\# uses OS keystore, add the
self-signed certificate to the *Local Computer Trusted Root
Certification Authorities*</span>

**Mac OS X**

``` theme:
$ sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain <path-to-certificate>
```

**Windows**

``` theme:
> certutil -addstore -f "ROOT" <path-to-certificate>
```

**Linux (Ubuntu, Debian)**

``` theme:
$ sudo cp <path-to-certificate> /usr/local/share/ca-certificates/
$ sudo update-ca-certificates
```

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">PHP</span>

Specify path to self-signed certificate:

**PHP**

``` theme:
curl_setopt($ch, CURLOPT_CAINFO, <path-to-certificate>);
```

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">JavaScript</span>

Self-signed certificates handled by the host environment. In browser
host environments additionally origin security policy may apply, see
"Known Issues" below.

 

Known Issues
============

1.  CORS problem: If your client is using JavaScript library, JS engine
    may block requests to NetLicensing Agent server for security reasons
    (more
    info: <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" class="external-link">https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a>).
    To fix this problem, your NetLicensing Agent server must provide
    appropriate HTTP CORS headers. Below are setting examples for Apache
    and Nginx:

    **conf/extra/httpd-vhosts.conf**

    ``` theme:
    <VirtualHost *:443>
        ServerName "yourhost.com"

        ProxyRequests Off
        ProxyVia Off

        <Proxy *>
          AddDefaultCharset off
          #Apache 2.2
          Order deny,allow
          Allow from all
          #Apache 2.4
          #Require all denied
        </Proxy>

        ProxyPass / http://localhost:8080/

        SSLEngine On
        #path to you local sectificate
        SSLCertificateFile /usr/local/etc/httpd/server.crt
        SSLCertificateKeyFile /usr/local/etc/httpd/server.key
     
        #CORS Headers
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Accept, Authorization"
        Header always set Access-Control-Max-Age: "3600"
        RewriteEngine On
        RewriteCond %{REQUEST_METHOD} OPTIONS
        RewriteRule ^(.*)$ $1 [R=200,L]

    </VirtualHost>
    ```

    **nginx.conf**

    ``` theme:
    # HTTPS server
    server {
        listen       443 ssl;
        server_name  yourhost.com  alias  yourhost.com.alias;
     
        #path to you local sectificate
        ssl_certificate      /usr/local/etc/httpd/server.crt;
        ssl_certificate_key  /usr/local/etc/httpd/server.key;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
     
        #CORS Headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Accept, Authorization";
        add_header Access-Control-Max-Age: "3600";
        location / {
            proxy_pass       http://localhost:8080;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            }
        }
    ```

 

Useful links
============

-   <a href="https://wiki.eclipse.org/Jetty/Tutorial/Apache" class="external-link">https://wiki.eclipse.org/Jetty/Tutorial/Apache</a>
-   <a href="https://wiki.eclipse.org/Jetty/Howto/Configure_mod_proxy#Proxying_SSL_on_Apache_to_HTTP_on_Jetty" class="external-link">https://wiki.eclipse.org/Jetty/Howto/Configure_mod_proxy#Proxying_SSL_on_Apache_to_HTTP_on_Jetty</a>
-   <a href="https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html" class="external-link">https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html</a>
-   <a href="https://nginx.org/en/docs/" class="external-link">https://nginx.org/en/docs/</a>
-   <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" class="external-link">https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a>

**  
**

<span style="font-family: monospace;white-space: pre;">  
</span>

Document generated by Confluence on 17-03-2019 17:44

[Atlassian](http://www.atlassian.com/)
