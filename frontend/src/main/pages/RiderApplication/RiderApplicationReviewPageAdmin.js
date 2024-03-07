import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationForm from "main/components/RiderApplication/RiderApplicationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";

import { toast } from "react-toastify";

export default function RiderApplicationEditPage() {
   let { id } = useParams();

   const { data: riderApplication, _error, _status } =
      useBackend(
         // Stryker disable next-line all : don't test internal caching of React Query
         [`/api/rider/admin?id=${id}`],
         {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/rider/admin`,
            params: {
               id
            }
         }
      );

   const objectToAxiosPutParams = (riderApplication) => {
      // Log the data property to the console
      console.log('Data being sent:', {
         status: riderApplication.status,
         notes: riderApplication.notes,
         id: riderApplication.id
      });

      return {
         url: "/api/rider/admin",
         method: "PUT",
         params: {
            id: riderApplication.id,
            status: riderApplication.status,
            notes: riderApplication.notes
         },
         data: {
            status: riderApplication.status,
            notes: riderApplication.notes
         }
      };
   };


   const onSuccess = (riderApplication) => {
      toast(`Application Updated - id: ${riderApplication.id}`);
   }

   const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/rider/admin?id=${id}`]
   );

   const { isSuccess } = mutation

   const onSubmit = async (data) => {
      mutation.mutate(data)
   }

   if (isSuccess) {
      return <Navigate to="/admin/applications/riders" />
   }

   return (
      <BasicLayout>
         <div className="pt-2">
            <h1>Review Rider Application</h1>
            {riderApplication &&
               <RiderApplicationForm initialContents={riderApplication} buttonLabel="review" disableBool={false} submitAction={onSubmit} />
            }
         </div>
      </BasicLayout>
   )
}