import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm"
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DriverAvailabilityForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Driver Id", "Day", "Start Time", "End Time", "Notes"];
    const testId = "DriverAvailabilityForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders id field correctly with initialContents", async () => {
        const initialContents = {
            id: "123", driverId: "ISOXO", day: "Monday", start: "09:00PM",end: "10:00PM", notes: "Available"
        };
    
        render(
            <Router>
                <DriverAvailabilityForm initialContents={initialContents} />
            </Router>
        );
        const idField = await screen.findByTestId("DriverAvailabilityForm-id");
        expect(idField).toBeInTheDocument();
        expect(idField).toBeDisabled();
        expect(idField).toHaveValue(initialContents.id);
    });
    

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm initialContents={driverAvailabilityFixtures.oneAvailability} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
        expect(await screen.findByTestId(`${testId}-driverId`)).toBeInTheDocument();
        expect(screen.getByText(`Driver Id`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByText(`Day`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-start`)).toBeInTheDocument();
        expect(screen.getByText(`Start Time`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-end`)).toBeInTheDocument();
        expect(screen.getByText(`End Time`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-notes`)).toBeInTheDocument();
        expect(screen.getByText(`Notes`)).toBeInTheDocument();
    });

    test("Correct Errors on bad input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/driverId is required./);
        expect(screen.getByText(/day is required./)).toBeInTheDocument();
        expect(screen.getByText(/start is required./)).toBeInTheDocument();
        expect(screen.getByText(/end is required./)).toBeInTheDocument();
        expect(screen.getByText(/notes is required./)).toBeInTheDocument();

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <DriverAvailabilityForm />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-submit");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.click(submitButton);
        
        await screen.findByText(/Id is required./);
        expect(screen.getByText(/driverId is required./)).toBeInTheDocument();
        expect(screen.getByText(/day is required./)).toBeInTheDocument();
        expect(screen.getByText(/start is required./)).toBeInTheDocument();
        expect(screen.getByText(/end is required./)).toBeInTheDocument();
        expect(screen.getByText(/notes is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startField = screen.getByTestId("DriverAvailabilityForm-start");
        const endField = screen.getByTestId("DriverAvailabilityForm-end");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: 'test' } });
        fireEvent.change(dayField, { target: { value: 'test' } });
        fireEvent.change(startField, { target: { value: 'test' } });
        fireEvent.change(endField, { target: { value: 'test' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/driverId is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/day is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/start is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/end is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/notes is required./)).not.toBeInTheDocument();


    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <DriverAvailabilityForm />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-cancel");
        const cancelButton = screen.getByTestId("DriverAvailabilityForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });


});