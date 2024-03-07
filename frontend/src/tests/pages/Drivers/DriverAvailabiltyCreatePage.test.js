import { render, waitFor, fireEvent } from "@testing-library/react";
import DriverAvailabilityCreatePage from "main/pages/Drivers/DriverAvailabilityCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("DriverAvailabilityCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const availability = {
            id: 17,
            day: "Monday",
            startTime: "12:00AM",
            endTime: "2:00AM", 
            notes: ""
        };

        axiosMock.onPost("/api/driverAvailability/new").reply( 202, availability );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("DriverAvailabilityForm-day")).toBeInTheDocument();
        });

        const dayField = getByTestId("DriverAvailabilityForm-day");
        const startTimeField = getByTestId("DriverAvailabilityForm-start");
        const endTimeField = getByTestId("DriverAvailabilityForm-end");
        const notesField = getByTestId("DriverAvailabilityForm-notes");
        const submitButton = getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(dayField, { target: { value: 'Monday' } });
        fireEvent.change(startTimeField, { target: { value: '12:00AM' } });
        fireEvent.change(endTimeField, { target: { value: '2:00AM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });


        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "day": "Monday",
                "startTime": "12:00AM",
                "endTime": "4:30PM", 
                "notes" : "test"
        });

        expect(mockToast).toBeCalledWith("New Ride Created - id: 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/availability/" });
    });


});



