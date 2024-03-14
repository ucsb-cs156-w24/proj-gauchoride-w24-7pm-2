import React from 'react';

import DriverAvailabilityEditPage from 'main/pages/Drivers/DriverAvailabilityEditPage';
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

export default {
    title: 'pages/Drivers/DriverAvailabilityEditPage',
    component: DriverAvailabilityEditPage
};

const Template = () => <DriverAvailabilityEditPage />;

export const Default = Template.bind({});

Default.args = {
    initialContents: driverAvailabilityFixtures.oneDriverAvailability
};




