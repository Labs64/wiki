1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [NetLicensing API (RESTful)](11010215.html)

<span id="title-text"> Custom Properties </span>
================================================

by <span class="editor"> Alexey Averikhin</span> on 05-01-2016

Custom properties allow you to add arbitrary additional information
to NetLicensing entities. This can be useful to link with other
subsystems like CMS or ERP. Custom properties can be added (modified,
removed) when creating or updating entities. All standard property
names such as "name", "number", "active" etc., are reserved and can't be
used for custom properties. Custom properties can't hold empty values.

To add custom property on create or update, include it together with
other properties as POST method parameter:

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/licensee
productNumber=Ptrybuy-DEMO&crmCustomerId=cust1234
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing 
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#" 
    xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="Licensee">
            <property name="number">I3UDWEXCS</property>
            <property name="active">true</property>
            <property name="productNumber">Ptrybuy-DEMO</property>
            <property name="crmCustomerId">cust1234</property>
            <property name="inUse">true</property>
        </item>
    </items>
</netlicensing>
```

Custom property can be modified using update same as standard property.

To delete custom property, update property with empty value:

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/licensee/I3UDWEXCS
crmCustomerId=
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing 
    xmlns:ds="http://www.w3.org/2000/09/xmldsig#" 
    xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="Licensee">
            <property name="number">I3UDWEXCS</property>
            <property name="active">true</property>
            <property name="productNumber">Ptrybuy-DEMO</property>
            <property name="inUse">true</property>
        </item>
    </items>
</netlicensing>
```


