var tourChangelog = [
  {
    element: 'h3#ho-ho-ho-netlicensing-christmas-edition-released ~ p.change-description',
    title: 'Multi-currency support in NetLicensing Shops',
    description: 'Offer your products in different regions and local currencies. NetLicensing Shop now supports multiple currencies.',
  },
  {
    element: 'h3#instant-validate-api-access ~ p.change-description',
    title: 'Instant validate API access',
    description: 'Get instant access the essential NetLicensing RESTful API methods and see how to validate customer directly in the Management Console.',
  },
  {
    element: 'h3#labs64-netlicensing-for-github-teacher-toolbox ~ p.change-description',
    title: 'Labs64 NetLicensing for GitHub Teacher Toolbox',
    description: 'Great news for all teachers - Labs64 NetLicensing partnered with GitHub and offers NetLicensing Teacher (Basic) Plan for FREE all GitHub Teacher Toolbox users.',
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
    element: 'h3#labs64-netlicensing-for-github-students ~ p.change-description',
    title: 'Labs64 NetLicensing for GitHub Students',
    description: 'Great news for all students - Labs64 NetLicensing partnered with GitHub and offers you NetLicensing Student (Basic) Plan for FREE while you are a student.',
  },
  {
    element: 'h3#vendor-usage-page ~ p.change-description',
    title: 'Vendor Usage Page',
    description: 'Easily verify the limits (active products, customers) and available features and licensing models within your NetLicensing vendor account.',
  },
];

if (typeof guideChimpPluginGoogleAnalytics !== "undefined") {
  GuideChimp.extend(guideChimpPluginGoogleAnalytics);
}

var guideChimp = GuideChimp(tourChangelog, {
  position: 'left',
  scrollPadding: 50
});

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

document.getElementById('startTour').onclick = function() {
  guideChimp.start();
};
