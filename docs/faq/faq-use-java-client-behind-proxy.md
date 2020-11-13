---
layout: post
title: How to use Java client library behind proxy
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use NetLicensing Java Client library behind proxy"
permalink: faq-use-java-client-behind-proxy
---

{{ page.title }}
=============

## Question

I am behind a proxy server. How can I configure NetLicensing Java Client to use the proxy?

## Answer

Proxy server act as an intermediate instance between your product using [NetLicensing Java Client](https://github.com/Labs64/NetLicensingClient-java){:target="_blank"}{:rel="noopener nofollow"} library and NetLicensing Server at go.netlicensing.io

Java exposes a set of system properties that can be used to configure JVM-wide behaviour.

- `http.proxyHost` – the hostname of the HTTP proxy server
- `http.proxyPort` – the port number of the HTTP proxy server (default: 80)
- `http.nonProxyHosts` - the hosts that should bypass proxy

There are several options available on how you can run your application behind proxy.

### Command Line

Set the JVM flags `http.proxyHost` and `http.proxyPort` when starting your JVM on the command line.
This is usually done in a shell script (in Unix) or bat file (in Windows).

**Unix shell script example:**
```shell
JAVA_FLAGS=-Dhttp.proxyHost=10.0.0.64 -Dhttp.proxyPort=6464 -Dhttp.nonProxyHosts="localhost|127.0.0.1|1.*.*.*|*.foo.com‌​|etc"
java ${JAVA_FLAGS} ...
```

### Programatically

In case CLI option is not suitable, proxy properties can be set programmatically with `System.setProperty()` within your application:

```java
System.setProperty("http.proxyHost", "10.0.0.64");
System.setProperty("http.proxyPort", "6464");
```

### Refrences

- Java documentation: [https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html](https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html){:target="_blank"}{:rel="noopener nofollow"}
