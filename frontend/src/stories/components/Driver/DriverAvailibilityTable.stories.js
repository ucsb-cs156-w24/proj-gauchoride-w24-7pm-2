import React from 'react';
import DriverAvailabilityTable from 'main/components/Driver/DriverAvailabilityTable';
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Driver/DriverAvailabilityTable',
    component: DriverAvailabilityTable
};

const Template = (args) => {
    return (
        <DriverAvailabilityTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    driverAvailabilities: []
};


export const DriverAvailabilityThreeSubjectsNoButtons = Template.bind({});

DriverAvailabilityThreeSubjectsNoButtons.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailability,
    currentUser: currentUserFixtures.adminUser
};


// export const RiderThreeSubjectsWithButtons = Template.bind({});
// RiderThreeSubjectsWithButtons.args = {
//     ride: rideFixtures.threeRidesTable,
//     currentUser: currentUserFixtures.userOnly
// };

// export const AdminThreeSubjectsWithButtons = Template.bind({});
// AdminThreeSubjectsWithButtons.args = {
//     ride: rideFixtures.threeRidesTable,
//     currentUser: currentUserFixtures.adminUser
// };
