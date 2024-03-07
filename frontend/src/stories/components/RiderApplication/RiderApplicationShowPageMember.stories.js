import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import RiderApplicationShowPage from 'main/pages/RiderApplication/RiderApplicationShowPageMember';
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';

export default {
    title: 'pages/RiderApplication/RiderApplicationShowPageMember',
    component: RiderApplicationShowPage
};

const Template = () => <RiderApplicationShowPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/riderApplication', (_req, res, ctx) => {
            return res(ctx.json(riderApplicationFixtures.threeRiderApplications[0]));
        }),
        // rest.get('/api/riderApplication/get', (req, res, ctx) => {
        //     window.alert("GET: " + JSON.stringify(req.url));
        //     return res(ctx.status(200),ctx.json({}));
        // })
    ]
}
