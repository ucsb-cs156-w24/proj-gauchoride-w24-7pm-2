import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import '@testing-library/jest-dom';
import { rideFixtures } from "fixtures/rideFixtures";
import RideForm from "main/components/Ride/RideForm";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RideForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Day of Week", "Pick Up Time", "Drop Off Time", "Pick Up Building", "Drop Off Building", "Room Number for Dropoff", "Course Number"];
    const testId = "RideForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm initialContents={rideFixtures.oneRide} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });


    test('pick up time description appears after hover delay', async () => {
        render(<RideForm />);
      
        const pickUpTimeField = screen.getByTestId('RideForm-start');
        fireEvent.mouseEnter(pickUpTimeField);
      
        expect(await screen.findByText('This is when you would like to be picked up')).toBeInTheDocument();

        fireEvent.mouseLeave(pickUpTimeField);
        expect(await screen.queryByText('This is when you would like to be picked up')).toBeNull();
    });

    
    test('drop off time description appears after hover delay', async () => {
        render(<RideForm />);
      
        const dropOffTimeField = screen.getByTestId('RideForm-end');
        fireEvent.mouseEnter(dropOffTimeField);
      
        expect(await screen.findByText('This is the latest you would like to arrive by')).toBeInTheDocument();

        fireEvent.mouseLeave(dropOffTimeField);
        expect(await screen.queryByText('This is the latest you would like to arrive by')).toBeNull();
    });

});