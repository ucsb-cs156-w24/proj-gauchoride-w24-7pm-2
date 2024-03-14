import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/driverAvailibilityUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function DriverAvailabilityTable({ driverAvailabilities, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/availability/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        [],
    );

    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    };


    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Driver ID',
            accessor: 'driverId',
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Start',
            accessor: 'startTime',
        },
        {
            Header: 'End',
            accessor: 'endTime',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "DriverAvailabilityTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "DriverAvailabilityTable"));
    } 

    return <OurTable
        data={driverAvailabilities}
        columns={columns}
        testid={"DriverAvailabilityTable"}
    />;
};