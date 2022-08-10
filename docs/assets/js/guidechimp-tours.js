var tourChangelog = [
  {
    element: 'h3#customer-aliases ~ p.change-description',
    title: 'Customer Aliases',
    description: 'Specify alternative unique aliases for your customers or provide a list of the aliases, such as course participants, students, team members, etc. and use these for the validation calls.',
  },
  {
    element: 'h3#new-customer-portal-released ~ p.change-description',
    title: 'New Customer Portal',
    description: 'Easily create, customize and embed a new white-label Customer Portal, and offer your customers a comprehensive view of all their licenses.',
  },  
  {
    element: 'h3#experimental-customer-warning-level ~ p.change-description',
    title: 'Customer Warning Level',
    description: 'Get an instant view of customers status using the new experimental feature Customer Warning Level. Customer status is represented using intuitive traffic light shown on the customers list and detail view.',
  },
  {
    element: 'h3#netlicensing--auth0-integration ~ p.change-description',
    title: 'NetLicensing / Auth0 Integration',
    description: 'Enable AAV Framework for your products by enriching Auth0 authentication flow and user profile with the NetLicensing validation data.',
  },
  {
    element: 'h3#specify-api-key-scope ~ p.change-description',
    title: 'Specify API Key Scope',
    description: 'Now you can specify API Key scope by providing specific customer number, so the API Key validation and transfer operations can be executed for this specified customer only.',
  },
  {
    element: 'h3#ho-ho-ho-netlicensing-christmas-edition-released ~ p.change-description',
    title: 'Multi-currency support in NetLicensing Shops',
    description: 'Offer your products in different regions and local currencies. NetLicensing Shop now supports multiple currencies.',
  },
  {
    element: 'h3#instant-validate-api-access ~ p.change-description',
    title: 'API Examples Page',
    description: 'Get instant access to the essential NetLicensing RESTful API methods examples and see how to validate customers directly in the Management Console.',
  },
  {
    element: 'h3#stay-up-to-date-with-netlicensing-platform-news ~ p.change-description',
    title: 'NetLicensing Platform News',
    description: 'Stay informed about the latest changes to NetLicensing platform directly in the management console.',
  },
  {
    element: 'h3#extended-customer-data ~ p.change-description',
    title: 'Extended Customer Data',
    description: 'Improve customer profiles by adding and grouping customer information using Custom Properties in the UI.',
  },
  {
    element: 'h3#pricing-table-licensing-model ~ p.change-description',
    title: 'Pricing Table Licensing Model',
    description: 'Easily maintain Pricing Table & Membership Plans for your SaaS products in the NetLicensing UI.',
  },
  {
    element: 'h3#vendor-usage-page ~ p.change-description',
    title: 'Vendor Usage Page',
    description: 'Easily verify the limits (active products, customers) and available features and licensing models within your NetLicensing vendor account.',
  },
];

GuideChimp.extend(guideChimpPluginLicensing, { id: "INLIC" });

/*
if (typeof guideChimpPluginGoogleAnalytics !== "undefined") {
  GuideChimp.extend(guideChimpPluginGoogleAnalytics);
}
*/

var guideChimp = GuideChimp(tourChangelog, {
  position: 'left',
  scrollPadding: 50
});

/*
if (typeof guideChimpPluginGoogleAnalytics !== "undefined") {
  // GuideChimp->GoogleAnalytics plugin - https://github.com/Labs64/GuideChimp/tree/master/plugins/googleAnalytics
  guideChimp.gaOn('onAfterChange', 'Changelog Tour', (to, from) => {
    return {
      event_category: 'guidechimp_tour',
      event_label: 'Step: ' + to.title,
      value: to.step
    };
  });
}
*/

document.getElementById('startTour').onclick = function() {
  guideChimp.start();
};
