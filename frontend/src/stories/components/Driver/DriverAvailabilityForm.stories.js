import React from 'react';
import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm"
import { driverFixtures } from 'fixtures/driverFixtures';

export default {
    title: 'components/Driver/DriverAvailabilityForm',
    component: DriverAvailabilityForm
};

const Template = (args) => {
    return (
        <DriverAvailabilityForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: driverFixtures.oneDriver[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};