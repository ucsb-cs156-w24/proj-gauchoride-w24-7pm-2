import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RiderApplicationReviewPageAdmin from "main/pages/RiderApplication/RiderApplicationReviewPageAdmin";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
      useParams: () => ({
         id: 17
      }),
      Navigate: (x) => { mockNavigate(x); return null; }
   };
});

describe("RiderApplicationReviewPage tests", () => {

   describe("when the backend doesn't return a todo", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
         axiosMock.reset();
         axiosMock.resetHistory();
         axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
         axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
         axiosMock.onGet("/api/rider/admin", { params: { id: 17 } }).timeout();
      });

      const queryClient = new QueryClient();
      test("renders header but table is not present", async () => {

         const restoreConsole = mockConsole();

         const { queryByTestId, findByText } = render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RiderApplicationReviewPageAdmin />
               </MemoryRouter>
            </QueryClientProvider>
         );
         await findByText("Review Rider Application");
         expect(queryByTestId("RiderApplicationForm-id")).not.toBeInTheDocument();
         restoreConsole();
      });
   });

   describe("tests where backend is working normally", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
         axiosMock.reset();
         axiosMock.resetHistory();
         axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
         axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
         axiosMock.onGet("/api/rider/admin", { params: { id: 17 } }).reply(200, {
            id: 17,
            perm_number: "7654321",
            status: "pending",
            email: "random@example.org",
            created_date: "2023-04-17",
            updated_date: "2023-08-25",
            cancelled_date: "",
            description: "My leg is broken",
            notes: ""
         });
         axiosMock.onPut('/api/rider/admin').reply(200, {
            id: 17,
            perm_number: "7654321",
            status: "accepted",
            email: "random@example.org",
            created_date: "2023-04-17",
            updated_date: "2023-08-25",
            cancelled_date: "",
            description: "My leg is broken",
            notes: "notes inserted"
         });
      });

      const queryClient = new QueryClient();
      test("renders without crashing", () => {
         render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RiderApplicationReviewPageAdmin />
               </MemoryRouter>
            </QueryClientProvider>
         );
      });

      test("Is populated with the data provided", async () => {

         const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RiderApplicationReviewPageAdmin />
               </MemoryRouter>
            </QueryClientProvider>
         );

         await findByTestId("RiderApplicationForm-id");

         const statusField = getByTestId("RiderApplicationForm-status");
         const permNumberField = getByTestId("RiderApplicationForm-perm_number");
         const emailField = getByTestId("RiderApplicationForm-email");
         const createdDateField = getByTestId("RiderApplicationForm-created_date");
         const updatedDateField = getByTestId("RiderApplicationForm-updated_date");
         const cancelledDateField = getByTestId("RiderApplicationForm-cancelled_date");
         const descriptionField = getByTestId("RiderApplicationForm-description");
         const notesField = getByTestId("RiderApplicationForm-notes");

         expect(statusField).toHaveValue("pending");
         expect(permNumberField).toHaveValue("7654321");
         expect(emailField).toHaveValue("random@example.org");
         expect(createdDateField).toHaveValue("2023-04-17");
         expect(updatedDateField).toHaveValue("2023-08-25");
         expect(cancelledDateField).toHaveValue("");
         expect(descriptionField).toHaveValue("My leg is broken");
         expect(notesField).toHaveValue("");

      });

      test("Changes when you click Review", async () => {

         const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RiderApplicationReviewPageAdmin />
               </MemoryRouter>
            </QueryClientProvider>
         );

         await findByTestId("RiderApplicationForm-appid");

         const statusField = getByTestId("RiderApplicationForm-status");
         const permNumberField = getByTestId("RiderApplicationForm-perm_number");
         const emailField = getByTestId("RiderApplicationForm-email");
         const createdDateField = getByTestId("RiderApplicationForm-created_date");
         const updatedDateField = getByTestId("RiderApplicationForm-updated_date");
         const cancelledDateField = getByTestId("RiderApplicationForm-cancelled_date");
         const descriptionField = getByTestId("RiderApplicationForm-description");
         const notesField = getByTestId("RiderApplicationForm-notes");
         const submitButton = getByTestId("RiderApplicationForm-submit")

         expect(statusField).toHaveValue("pending");
         expect(permNumberField).toHaveValue("7654321");
         expect(emailField).toHaveValue("random@example.org");
         expect(createdDateField).toHaveValue("2023-04-17");
         expect(updatedDateField).toHaveValue("2023-08-25");
         expect(cancelledDateField).toHaveValue("");
         expect(descriptionField).toHaveValue("My leg is broken");
         expect(notesField).toHaveValue("");

         expect(submitButton).toBeInTheDocument();

         fireEvent.change(notesField, { target: { value: "notes inserted" } });
         fireEvent.change(statusField, { target: { value: "accepted" } });

         fireEvent.click(submitButton);


         await waitFor(() => expect(mockToast).toHaveBeenCalled());
         expect(mockToast).toBeCalledWith("Application Updated - id: 17");
         expect(mockNavigate).toBeCalledWith({ "to": "/admin/applications/riders" });

         expect(axiosMock.history.put.length).toBe(1); // times called
         expect(axiosMock.history.put[0].params).toEqual({
            id: 17,
            notes: "notes inserted",
            status: "accepted"
         });      
      });
   });
});