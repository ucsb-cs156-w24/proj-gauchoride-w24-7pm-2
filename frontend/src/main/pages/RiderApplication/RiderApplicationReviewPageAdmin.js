import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationForm from "main/components/RiderApplication/RiderApplicationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { hasRole, useCurrentUser } from "main/utils/currentUser";

import { toast } from "react-toastify";

export default function RiderApplicationEditPage() {
   let { id } = useParams();

   const { data: currentUser } = useCurrentUser();

   const { data: riderApplication, _error, _status } =
      useBackend(
         // Stryker disable next-line all : don't test internal caching of React Query
         [`/api/riderApplication?id=${id}`],
         {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/riderApplication`,
            params: {
               id
            }
         }
      );

   const objectToAxiosPutParamsAdmin = (riderApplication) => ({
      url: "/api/riderApplication",
      method: "PUT",
      params: {
         id: riderApplication.id,
      },
      data: {
         status: riderApplication.status,
         notes: riderApplication.notes
      }
   });

   const onSuccess = (riderApplication) => {
      toast(`Application Updated - id: ${riderApplication.id}`);
   }

   const mutationAdmin = useBackendMutation(
      objectToAxiosPutParamsAdmin,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/rider/admin?id=${id}`]
   );

   const { isSuccess } = mutationAdmin 

   const onSubmit = async (data) => {
      mutation.mutateAdmin(data)
   }

   if (isSuccess) {
      return <Navigate to="/admin/applications/riders" />
   }

   return (
      <BasicLayout>
         <div className="pt-2">
            <h1>Review Rider Application</h1>
            {riderApplication &&
               <RiderApplicationForm initialContents={riderApplication} submitAction={onSubmit} buttonLabel="Edit" />
            }
         </div>
      </BasicLayout>
   )
}