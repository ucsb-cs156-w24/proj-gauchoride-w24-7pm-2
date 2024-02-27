import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/driverAvailibilityUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function DriverAvailibilityTable({ driverAvailibilities, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/driverAvailibility/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/driverAvailibility/all"]
    );
    
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id',
        },
        {
            Header: 'Driver ID',
            accessor: 'driverId',
        },
        {
            Header: 'TeamId',
            accessor: 'day',
        },
        {
            Header: 'Start',
            accessor: 'start',
        },
        {
            Header: 'End',
            accessor: 'end',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "DriverAvailibilityTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "DriverAvailibilityTable"));
    } 

    return <OurTable
        data={driverAvailibilities}
        columns={columns}
        testid={"DriverAvailibilityTable"}
    />;
};