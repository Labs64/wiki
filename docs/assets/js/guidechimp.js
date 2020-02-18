var tour = [
    {
        element: '#stay-up-to-date-with-netlicensing-platform-news',
        title: 'NetLicensing Platform News',
        description: 'Stay informed about the latest changes to NetLicensing platform directly in the management console.',
    },
    {
        element: '#extended-customer-data',
        title: 'Extended Customer Data',
        description: 'Improve customer profiles by adding and grouping customer information using Custom Properties in the UI.',
    },
    {
        element: '#pricing-table-licensing-model',
        title: 'Pricing Table Licensing Model',
        description: 'Easily maintain Pricing Table & Membership Plans for your SaaS products in the NetLicensing UI.',
    },
    {
        element: '#labs64-netlicensing-for-github-students',
        title: 'Labs64 NetLicensing for GitHub Students',
        description: 'Great news for all students - Labs64 NetLicensing partnered with GitHub and offers you NetLicensing Student (Basic) Plan for FREE while you are a student.',
    },
    {
        element: '#vendor-usage-page',
        title: 'Vendor Usage Page',
        description: 'Easily verify the limits (active products, customers) and available features and licensing models within your NetLicensing vendor account.',
    },
];

var guideChimp = new GuideChimp(tour);

document.getElementById('startTour').onclick = function () {
    guideChimp.start();
};