1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [Release Notes](Release-Notes_11010240.html)

<span id="title-text"> Release Notes - NetLicensing 2.5.0-FINAL </span>
=======================================================================


    ** Feature
        * Early Access to NetLicensing / Zapier integration ( https://zapier.com/apps/netlicensing/integrations )
        * New NetLicensing Kotlin Client ( https://github.com/Labs64/NetLicensingClient-kotlin )
        * [NLIC-1769] - Console: Publish public-alpha for the new NetLicensing Management Console ( https://ui.netlicensing.io )
        * [NLIC-1638] - Licensing Model: Extend Node-Locked licensing model (1:n pairing)
        * [NLIC-1793] - Licensing Model: Introduce Subscription / TimeVolume grace period 

    ** Improvement
        * [NLIC-1563] - Shop: Transaction improvements for recurring payments
        * [NLIC-1815] - Agent: Check smart card serial number during import
        * [NLIC-1735] - Client Libraries: revisit all client libraries
        * [NLIC-1577] - C++ Client Library: Add full set of NetLicensing services
        * [NLIC-1823] - Licensees list: allow using multiple filters at the same time
        * [NLIC-1882] - Core: Allow role 'anonymous' to register a new account
        * [NLIC-1172] - Core: Custom properties for validate
        * [NLIC-1783] - Improve documentation (incl. new model Node-Locked)
        * [NLIC-1840] - Console: Deprecate Licensee Secret mode (replaced by new Licensing Model)
        * [NLIC-1844] - Licensing Model: Grace period for Subscription LM
        * [NLIC-1862] - Licensing Model: Grace period for Rental LM    
        * [NLIC-1850] - Licensing Model: Grace Period - Show notifications

    ** Bug
        * [NLIC-1717] - Agent: Export without card of licensees exported previously with card works as if right serial provided
        * [NLIC-1729] - Core: Insufficient handling of wrong "Accept" header value
        * [NLIC-1838] - Shop: "Quota" Licensing model Label in shop
        * [NLIC-1848] - Fix NetLicensing Gateway] security vulnerabilities
        * [NLIC-1855] - Agent: Fix proxy mode
        * [NLIC-1867] - Client Libraries: Eliminate dependency on public NetLicensingService constructor from java client


