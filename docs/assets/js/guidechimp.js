var tourChangelog = [
    {
        element: 'section#stay-up-to-date-with-netlicensing-platform-news p.change-description',
        title: 'NetLicensing Platform News',
        description: 'Stay informed about the latest changes to NetLicensing platform directly in the management console.',
        position: 'top',
    },
    {
        element: 'section#extended-customer-data p.change-description',
        title: 'Extended Customer Data',
        description: 'Improve customer profiles by adding and grouping customer information using Custom Properties in the UI.',
        position: 'top',
    },
    {
        element: 'section#pricing-table-licensing-model p.change-description',
        title: 'Pricing Table Licensing Model',
        description: 'Easily maintain Pricing Table & Membership Plans for your SaaS products in the NetLicensing UI.',
        position: 'top',
    },
    {
        element: 'section#labs64-netlicensing-for-github-students p.change-description',
        title: 'Labs64 NetLicensing for GitHub Students',
        description: 'Great news for all students - Labs64 NetLicensing partnered with GitHub and offers you NetLicensing Student (Basic) Plan for FREE while you are a student.',
        position: 'top',
    },
    {
        element: 'section#vendor-usage-page p.change-description',
        title: 'Vendor Usage Page',
        description: 'Easily verify the limits (active products, customers) and available features and licensing models within your NetLicensing vendor account.',
        position: 'top',
    },
];

var guideChimp = new GuideChimp(tourChangelog);
document.getElementById('startTour').onclick = function () {
    guideChimp.start();
};
