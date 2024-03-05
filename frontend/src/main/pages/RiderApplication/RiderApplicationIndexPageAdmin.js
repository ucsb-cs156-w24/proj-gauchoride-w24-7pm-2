import React from 'react';
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser } from 'main/utils/currentUser'
// import Button from 'react-bootstrap/Button';
// import { Link } from 'react-router-dom';
import RiderApplicationTable from "main/components/RiderApplication/RiderApplicationTable";

export default function RiderApplicationIndexPageAdmin() {

   const currentUser = useCurrentUser();
   // Stryker disable all
   const currentUserCopy = currentUser.data?.root?.rolesList
      ? {
         ...currentUser,
         data: {
            ...currentUser.data,
            root: {
               ...currentUser.data.root,
               rolesList: currentUser.data.root.rolesList
            }
         }
      }
      : { ...currentUser };
   // Stryker restore all 

   const { data: riderApplicationsAll, error: _error, status: _status } =
      useBackend(
         // Stryker disable all : hard to test for query caching
         ["/api/rider/admin/all"],
         { method: "GET", url: "/api/rider/admin/all" },
         []
         // Stryker restore all 
      );

   const { data: riderApplicationsPending, error: _error2, status: _status2 } =
      useBackend(
         // Stryker disable all : hard to test for query caching
         ["/api/rider/admin/pending"],
         { method: "GET", url: "/api/rider/admin/pending" },
         []
         // Stryker restore all 
      );

   return (
      <BasicLayout>
         <div className="pt-2">
            <h1>Pending Rider Applications</h1>
            <RiderApplicationTable riderApplications={riderApplicationsPending} currentUser={currentUserCopy} />
            <h1>All Rider Applications</h1>
            <RiderApplicationTable riderApplications={riderApplicationsAll} currentUser={currentUserCopy} />
         </div>
      </BasicLayout>
   );
}