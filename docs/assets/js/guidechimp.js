var tour = [
    {
        element: '.navigation-list',
        title: 'Try & Buy',
        description: 'This licensing model is useful in case you want to distribute secure trial or demo version of your product. Trial licenses are granted for a short time and allow customers to try the product before buying it.',
        buttons: [
            {
                title: 'See more',
                class: 'tour-button',
                onClick: function () {
                    alert("Step button click");
                }
            }
        ]
    },
    {
        element: '#main-content',
        title: 'Subscription',
        description: 'Subscription licensing model allows user to enable product for a specific period of time, with the possibility of the subscription renewal.',
        buttons: [
            {
                title: 'See more',
                class: 'tour-button',
                onClick: function () {
                    alert("Step button click");
                }
            }
        ]
    },
];

var guideChimp = new GuideChimp(tour);

document.getElementById('startTour').onclick = function () {
    guideChimp.start();
};
