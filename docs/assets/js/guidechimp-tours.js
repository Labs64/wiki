// Tour steps point at changelog headings (kramdown ids generated from the entry title in _data/changelog.yml).
// Keep the tour to ~10-15 customer-facing features, newest first; re-check anchors when titles change.
var rel = 'h3#netlicensing-v21010--stronger-security-smarter-pricing-tables ~ ul > li:nth-child';

var tourChangelog = [
  {
    element: 'h3#netlicensing-mcp-server-for-agentic-license-management ~ p.change-description',
    title: 'MCP Server for AI-Assisted Licensing',
    description: 'Manage products, customers, licenses, entitlements, renewals and audits from Claude, GitHub Copilot, VS Code or any MCP-compatible AI assistant, using natural language instead of API calls.',
  },
  {
    element: rel + '(9)',
    title: 'Discount Licensing Model',
    description: 'Run promotions with the new Discount licensing model, including promo codes, in the Shop and Customer View.',
  },
  {
    element: rel + '(1)',
    title: 'Two-Factor Authentication',
    description: 'Protect your vendor account with an extra layer of security using two-factor authentication (2FA).',
  },
  {
    element: rel + '(2)',
    title: 'Pricing Tables',
    description: 'Maintain Pricing Tables & Membership Plans for your SaaS products, attach custom properties to plans, and export them as HTML with the columns you choose.',
  },
  {
    element: 'h3#management-console-modernization ~ p.change-description',
    title: 'Modernized Management Console',
    description: 'A faster, cleaner and responsive Management Console with revised tables, edit views, bundles and licensing model views.',
  },
  {
    element: 'h3#enhanced-payment-integrations-stripe-recurring-payments-paypal-fixes-and-more ~ p.change-description',
    title: 'Stripe Recurring Payments',
    description: 'Sell subscriptions through the NetLicensing Shop with Stripe recurring payments, also for license bundles, and track them in the Recurring Payments tab of the customer profile.',
  },
  {
    element: 'h3#netlicensing-2821 ~ p.change-description',
    title: 'License Bundles',
    description: 'Group licensing models and packages into a single license bundle and sell it through the Shop, including bundle Shop tokens.',
  },
  {
    element: 'h3#netlicensing-notifications ~ p.change-description',
    title: 'Notifications (Webhooks)',
    description: 'Send instant notifications to your webhook endpoints when events such as customer or license creation, transactions or warning level changes occur.',
  },
  {
    element: 'h3#netlicensing-2101 ~ p.change-description',
    title: 'Customer Warning Level',
    description: 'Get an instant view of customer status through an intuitive traffic light on the customers list and detail view, with configurable warning level rules.',
  },
  {
    element: 'h3#offline-license-file-support-for-netlicensing-c-client ~ p.change-description',
    title: 'Offline License Files',
    description: 'Provide seamless activation for your users, whether they are online or offline, using signed offline license files.',
  },
  {
    element: 'h3#customer-aliases ~ p.change-description',
    title: 'Customer Aliases',
    description: 'Specify alternative unique aliases for your customers or provide a list of the aliases, such as course participants, students, team members, etc. and use these for the validation calls.',
  },
  {
    element: 'h3#new-customer-portal-released ~ p.change-description',
    title: 'Customer Portal',
    description: 'Easily create, customize and embed a white-label Customer Portal, and offer your customers a comprehensive view of all their licenses.',
  },
  {
    element: 'h3#instant-validate-api-access ~ p.change-description',
    title: 'API Examples',
    description: 'Get instant access to ready-to-copy examples of the essential NetLicensing RESTful API methods and see how to validate customers directly in the Management Console.',
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
  // tour steps may point at entries inside collapsed archive years
  if (typeof window.changelogReveal === 'function') {
    window.changelogReveal();
  }
  guideChimp.start();
};
