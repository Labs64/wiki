---
layout: default
title: Securing the Agent with SSL/TLS
parent: NetLicensing Agent
nav_order: 99
description: "Securing the Agent with SSL/TLS"
permalink: securing-the-agent-with-ssl-tls
---

Securing the Agent with SSL/TLS
===============================

-   [Motivation](#motivation)
-   [Apache HTTP](#apache-http)
    -   [httpd.conf](#httpdconf)
    -   [httpd-vhosts.conf](#httpd-vhostsconf)
    -   [Running Agent and Apache](#running-agent-and-apache)
-   [Nginx](#nginx)
    -   [nginx.conf](#nginxconf)
    -   [Running Agent and Nginx](#running-agent-and-nginx)
-   [Microsoft IIS](#microsoft-iis)
    -   [Running Agent and IIS](#running-agent-and-iis)
-   [Managing of SSL certificates for the hosts in local network](#managing-of-ssl-certificates-for-the-hosts-in-local-network)
    -   [Certificates signed by a Certificate Authority (CA)](#certificates-signed-by-a-certificate-authority-ca)
    -   [Self-signed certificates](#self-signed-certificates)
-   [Known Issues](#known-issues)
-   [Useful links](#useful-links)

Motivation
==========

Agent has a fully functional built-in HTTP server, however plain HTTP is not secure, it is easy to alter the agent reply, mangling the validation result. This security threat can be mitigated by encrypting connection with SSL/TLS, however this requires proper managing of SSL certificate, which is not supported by the Agent alone. Solution is to delegate SSL/TLS handling to the external HTTP server, forwarding plain HTTP requests to NetLicensing Agent within local secure environment.

Below you will find configuration instructions for some popular HTTP servers, as well as recommendations to managing of SSL certificates.

Apache HTTP
===========

You can find the latest Apache HTTP Server at <a href="https://httpd.apache.org/" target="_blank" rel="noopener nofollow" class="external-link">https://httpd.apache.org/</a>.
Below you will find examples for Apache 2.2 and 2.4.

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

httpd-vhosts.conf
-----------------

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

1.  Start Agent with '`run-agent-offline`' or '`run-agent`' action. Pay attention to the port specified in `conf/extra/httpd-vhosts.conf`

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

2.  Start Apache

3.  NetLicensing Agent will respond to the validation requests sent over HTTPS to `yourhost.com:443`

Nginx
=====

You can find the latest Nginx HTTP Server at <a href="https://nginx.org/en/download.html" target="_blank" rel="noopener nofollow" class="external-link">https://nginx.org/en/download.html</a>.
For this example we are using Nginx 1.13.9.

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

1.  Start Agent with `'run-agent-offline'` or `'run-agent'` action. Pay attention to the port specified in `nginx.conf`

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

2.  Start Nginx

3.  NetLicensing Agent will respond to the validation requests sent over HTTPS to `yourhost.com:443`

<span style="font-family: monospace;">  
</span>

Microsoft IIS
=============

You can find the latest <span style="color: rgb(34,34,34);">Internet Information Services</span>(IIS) at <a href="https://www.iis.net/downloads" target="_blank" rel="noopener nofollow" class="external-link">https://www.iis.net/downloads</a>.
For this example we are using IIS 7.

-   <span style="color: rgb(0,0,0);">Forward insecure connection to secure URL:</span>

    **C:\\inetpub\\wwwroot\\\<your site folder\>\\web.config**

    ``` theme:
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <clear />
                    <rule name="Forward to https" stopProcessing="true">
                        <match url="(.*)" />
                        <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
                            <add input="{HTTPS}" pattern="^OFF$" />
                        </conditions>
                        <action type="Redirect" url="https://{HTTP_HOST}{REQUEST_URI}" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>
    ```

-   Proxy the requests over the secure connection to NetLicensing Agent:</span>  

    **C:\\inetpub\\wwwroot\\\<your site folder\>\\web.config**

    ``` theme:
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <clear />
                    <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                        <match url="(.*)" />
                        <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
                        <action type="Rewrite" url="http://localhost:8080/{R:1}" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>
    ```

-   Replace port `8080` with the actual port Agent is listening on

Running Agent and IIS
---------------------

1.  Start Agent with '`run-agent-offline`' or '`run-agent`' action. Pay attention to the port specified in C:\\inetpub\\wwwroot\\\<your site folder\>\\web.config

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

2.  Start Site from IIS Manager

3.  NetLicensing Agent will respond to the validation requests sent over HTTPS to `yourhost.com:443`
 

Managing of SSL certificates for the hosts in local network
===========================================================

Certificates signed by a Certificate Authority (CA)
---------------------------------------------------

In case you have a public or private Certificate Authority (CA) infrastructure available within your network, the preferable way is to let CA issue the SSL certificate. Details are not in scope of this document, but should be normally available from the corresponding CA.

This external resource maybe helpful: <a href="https://roll.urown.net/ca/index.html" target="_blank" rel="noopener nofollow" class="external-link">https://roll.urown.net/ca/index.html</a>

Self-signed certificates
------------------------

For creating self-signed certificate you can use openssl tool or a number of other methods.

Here are some useful links:

-   <a hreftarget="_blank" rel="noopener nofollow" class="external-link">How to create a self-signed certificate with openssl</a>
-   <a href="https://support.apple.com/kb/PH20131?locale=en_US&amp;viewlocale=en_US" target="_blank" rel="noopener nofollow" class="external-link">Keychain for Mac: Create self-signed certificates using Keychain Access</a>
-   <a href="https://msdn.microsoft.com/en-us/library/ff699202.aspx" target="_blank" rel="noopener nofollow" class="external-link">Windows: How to: Create Your Own Test Certificate</a>

Self-signed certificate must be explicitly trusted by a client side via appropriate installation, it can not be automatically validated against a known certificate authority. Certificate installation procedure depends on the environment your client is running on, below you can find some hints:

<span class="expand-control-text">Java</span>

<span style="color: rgb(36,41,46);">Java uses its own keystore for certificates (separate from the OS keystore). Therefore, you must install the appropriate certificate in *Java's* keystore.</span>

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

-   *\<alias-name\>* - some descriptive name of your choice that will identify your key in keystore
-   *\<path-to-certificate\> *- path to the self-signed certificate
-   *\<path-to-keystore\> *- depends on the operating system and java installation path, here are some standard locations:
    -   Mac OS X: *$JAVA\_HOME/lib/security/cacerts*
    -   Windows: *%JAVA\_HOME%\\lib\\security\\cacerts*
    -   Linux: *$JAVA\_HOME/lib/security/cacerts*

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">C\#</span>

<span style="color: rgb(36,39,41);">C\# uses OS keystore, add the self-signed certificate to the *Local Computer Trusted Root Certification Authorities*</span>

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

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Standalone</span>

Specify path to self-signed certificate:

**PHP**

``` theme:
curl_setopt($ch, CURLOPT_CAINFO, <path-to-certificate>);
```

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Apache httpd</span>

-   Download the <a href="https://curl.haxx.se/docs/caextract.html" target="_blank" rel="noopener nofollow" class="external-link">certificate bundle</a>.
-   Add your certificate to the dowloaded file.
-   Set up <span class="pln"
    style="color: rgb(48,51,54);">curl</span><span class="pun"
    style="color: rgb(48,51,54);">.</span><span class="pln"
    style="color: rgb(48,51,54);">cainfo and </span><span class="pln"
    style="color: rgb(48,51,54);">openssl</span><span class="pun"
    style="color: rgb(48,51,54);">.</span><span class="pln"
    style="color: rgb(48,51,54);">cafile in </span>`php.ini` files:  
    ` curl.cainfo="<path to the certificate bundle>" `  
    ` openssl.cafile="<path to the certificate bundle>"`
-   Restart httpd server.
-   Verify the correct certificate bundle is used by calling:

    **PHP**

    ``` theme:
    openssl_get_cert_locations();
    ```

<span class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span class="expand-control-text">JavaScript</span>

<span class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span class="expand-control-text">Node.js</span>

Specify path to self-signed certificate:

**Node.js**

``` theme:
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const netLicensing = require('netlicensing-client');

const instance = axios.create({
    httpsAgent: new https.Agent({
        ca: fs.readFileSync('<path-to-certificate>')
    })
});

netLicensing.Service.setAxiosInstance(instance);
```

<span class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span class="expand-control-text">Browser</span>

Add Security Exception for specified host of NetLicensing Agent server.

-   <a href="https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate" target="_blank" rel="noopener nofollow" class="external-link">Chrome</a>
-   FireFox: <span style="color: rgb(72,72,72);">Go to
    </span>**Preferences**<span style="color: rgb(72,72,72);"> \>\>
    **Privacy**</span><span style="color: rgb(72,72,72);"> \>\>
    </span>**Certificates**<span style="color: rgb(72,72,72);"> \>\>
    </span>**View Certificates <span
    style="color: rgb(72,72,72);">\></span><span
    style="color: rgb(72,72,72);">\> Import</span>**
-   <a href="https://stackoverflow.com/questions/681695/what-do-i-need-to-do-to-get-internet-explorer-8-to-accept-a-self-signed-certific" target="_blank" rel="noopener nofollow" class="external-link">IE</a>

In browser host environments, origin security policy may apply in addition, see "Known Issues" below. 

Known Issues
============

1.  CORS problem: If your client is using JavaScript library, JS engine may block requests to NetLicensing Agent server for security reasons (more info: <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noopener nofollow" class="external-link">https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a>).
    To fix this problem, your NetLicensing Agent server must provide appropriate HTTP CORS headers. Below are setting examples for Apache and Nginx:

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
        Header always set Access-Control-Allow-Headers "Content-Type, Accept, Authorization, NetLicensing-Origin"
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
        add_header Access-Control-Allow-Headers "Content-Type, Accept, Authorization, NetLicensing-Origin";
        add_header Access-Control-Max-Age: "3600";
        location / {
            proxy_pass       http://localhost:8080;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            }
        }
    ```

2.  If you get a warning about the contents of a self-signed certificate, make sure you have specified CN (The Common Name) when creating the certificate.

3.  Windows servers (IIS) use .pfx files to contain the public key files and the associated private key file. There are openssl examples how to convert certificate to .pfx format bellow.

    <span class="crayon-syntax crayon-syntax-inline crayon-theme-github crayon-theme-github-inline crayon-font-consolas"><span class="crayon-syntax crayon-syntax-inline crayon-theme-github crayon-theme-github-inline crayon-font-consolas"><span class="crayon-pre crayon-code" style="color: rgb(0,0,0);"><span class="crayon-e" style="color: teal;"> </span></span></span></span>

    **nginx.conf**

    ``` theme:
    #PEM (.pem, .crt, .cer) to PFX
    openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt
     
    #PKCS#7/P7B (.p7b, .p7c) to PFX
    openssl pkcs7 -print_certs -in certificate.p7b -out certificate.crt
    ```

Useful links
============

-   <a href="https://wiki.eclipse.org/Jetty/Tutorial/Apache" target="_blank" rel="noopener nofollow" class="external-link">https://wiki.eclipse.org/Jetty/Tutorial/Apache</a>
-   <a href="https://wiki.eclipse.org/Jetty/Howto/Configure_mod_proxy#Proxying_SSL_on_Apache_to_HTTP_on_Jetty" target="_blank" rel="noopener nofollow" class="external-link">https://wiki.eclipse.org/Jetty/Howto/Configure_mod_proxy#Proxying_SSL_on_Apache_to_HTTP_on_Jetty</a>
-   <a href="https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html" target="_blank" rel="noopener nofollow" class="external-link">https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html</a>
-   <a href="https://nginx.org/en/docs/" target="_blank" rel="noopener nofollow" class="external-link">https://nginx.org/en/docs/</a>
-   <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noopener nofollow" class="external-link">https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a>
-   <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9953/38/iis-redirect-http-to-https" target="_blank" rel="noopener nofollow" class="external-link">https://www.namecheap.com/support/knowledgebase/article.aspx/9953/38/iis-redirect-http-to-https</a>
-   <a href="https://developers.coveo.com/display/public/SearchREST/Configuring+HTTPS+Reverse+Proxy+in+IIS" target="_blank" rel="noopener nofollow" class="external-link">https://developers.coveo.com/display/public/SearchREST/Configuring+HTTPS+Reverse+Proxy+in+IIS</a>
-   <a href="https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/" target="_blank" rel="noopener nofollow" class="external-link">https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/</a>
