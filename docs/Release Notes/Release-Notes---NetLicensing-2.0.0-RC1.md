1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [Release Notes](Release-Notes_11010240.html)

<span id="title-text"> Release Notes - NetLicensing 2.0.0-RC1 </span>
=====================================================================

by <span class="editor"> Konstantin Korotkov</span> on 09-10-2013

    ** Feature
        * [LMB-258] - Send order confirmation after successful shop transaction
        * [LMB-269] - Avoid licensee charge via PSP in case transaction can't be completed
        * [LMB-370] - Add licensing model "TimeVolume"
        * [LMB-373] - Allow vendor to visit / validate NetLicensing Shop
        * [LMB-393] - Create possibility for testing validation on necessary date for timevolume licenses
        * [LMB-404] - Introduce "Forgot password" functionality
        * [LMB-413] - Implement pagination for list operations in NetLicensing Manage
        * [LMB-439] - Introduce email sending service
        * [LMB-442] - Redesign NetLicensing Manage layout / texting
        * [LMB-443] - Rename LmBox into Labs64 NetLicensing
        * [LMB-465] - Make validation messages human-readable

    ** Improvement
        * [LMB-99] - Refine external number edit control validator
        * [LMB-308] - Password change dialog must request old password for confirmation
        * [LMB-342] - Add price to a table view of license templates, licenses and transactions
        * [LMB-355] - Add a hint for the "number" field in entity edits, saying that number is generated if left empty.
        * [LMB-388] - Licensing model description refers to the documentation with link
        * [LMB-482] - Price format in shop is set to EUR X.XX
        
    ** Bug
        * [LMB-143] - Attempt to create a license template with empty 'name' causes JPA exception (non-null DB constraint)
        * [LMB-300] - Access to non-existing endpoint should result in 404, currently 500
        * [LMB-334] - Licensee number is editable without any confirmation even if licensee is active and has licenses
        * [LMB-399] - Error 500 if name field omitted in product module create
        * [LMB-403] - Prevent automatic TIMEVOLUME license templates in FeatureWithTimeVolume LM - cause exception
        * [LMB-407] - Too strict validators for new license creation in NetLicensing Manage
        * [LMB-462] - Creation of demo data for Feature With TimeVolume is broken
        * [LMB-467] - Attempt to open non-existing entity for edit in UI doesn't generate an error.
        * [LMB-469] - Number field validator in edit mode is incorrect
        * [LMB-470] - Validate vendor profile after login
        * [LMB-473] - Filter: when valid filter returns no items and applied 2nd time - error is shown
        * [LMB-480] - If shop only transactions list is empty, shop only must be off by default
        * [LMB-481] - From entity edit view, return happens always to the first page of the list view
        * [LMB-485] - Broken linked entities navigation in default products view
        * [LMB-498] - Empty total price in product edit page leads to error after save
        * [LMB-505] - Non-automatic license with empty price causes failure in shop
        * [LMB-506] - LM Feature with TimeVolume: purchasing new feature and timevolume licenses at the same time is not working - only feature licenses added
        * [LMB-507] - Shop transactions are shown multiple times in the list view (once per license)
        * [LMB-528] - NPE in shop in case one of the fetch operations fails in backend during shop preparation
        * [LMB-535] - Custom property can't be removed from NetLicensing Manage
        * [LMB-558] - It is possible to set yellowThreshold=1 and redThreshold=0, which causes validation error and, as a result, shop error (NPE)

