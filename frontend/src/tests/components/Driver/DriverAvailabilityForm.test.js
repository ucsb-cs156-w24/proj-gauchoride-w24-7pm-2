import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm";
import { driverFixtures } from "fixtures/driverFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("DriverAvailabilityForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <DriverAvailabilityForm />
            </Router>
        );
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Driver", async () => {

        render(
            <Router  >
                <DriverAvailabilityForm initialContents={driverFixtures.oneDriver} />
            </Router>
        );
        expect(screen.getByText(/driverId/)).toBeInTheDocument();
        await screen.findByTestId(/DriverAvailabilityForm-driverId/);
        expect(screen.getByTestId(/DriverAvailabilityForm-driverId/)).toHaveValue("ISOXO");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <DriverAvailabilityForm />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-day");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startField = screen.getByTestId("DriverAvailabilityForm-start");
        const endField = screen.getByTestId("DriverAvailabilityForm-end");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(dayField, { target: { value: 'bad-input' } });
        fireEvent.change(startField, { target: { value: 'bad-input' } });
        fireEvent.change(endField,{ target: { value: 'bad-input' } });
        fireEvent.change(notesField,{ target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        expect(screen.queryByText(/day must be a string/)).not.toBeInTheDocument();
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
        
        await screen.findByText(/driverId is required./);
        expect(screen.getByText(/day is required./)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required./)).toBeInTheDocument();
        expect(screen.getByText(/start is required./)).toBeInTheDocument();

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

        fireEvent.change(driverIdField, { target: { value: 'ISOXO' } });
        fireEvent.change(dayField, { target: { value: '3/20' } });
        fireEvent.change(startField, { target: { value: '3/20' } });
        fireEvent.change(endField, { target: { value: '3/21'} });
        fireEvent.change(notesField, { target: { value: 'Will play music during ride' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/day must be a string/)).not.toBeInTheDocument();
        expect(screen.queryByText(/start must be a string/)).not.toBeInTheDocument();

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

