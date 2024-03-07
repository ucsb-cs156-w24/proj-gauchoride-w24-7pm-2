import OurTable, { ButtonColumn } from "main/components/OurTable";
import { hasRole } from "main/utils/currentUser";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/rideUtils";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";

export default function RideTable({
        ride,
        currentUser
    }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ride/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ride_request/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Student',
            accessor: 'student',
        },
        {
            Header: 'Driver',
            accessor: 'driver',
        },
        {
            Header: 'Course #',
            accessor: 'course',
        },
        {
            Header: 'Pick Up Time',
            accessor: 'startTime',
        },
        {
            Header: 'Drop Off Time',
            accessor: 'endTime',
        },
        {
            Header: 'Pick Up Building',
            accessor: 'pickupBuilding',
        },
        {
            Header: 'Pick Up Room',
            accessor: 'pickupRoom',
        },
        {
            Header: 'Drop Off Building',
            accessor: 'dropoffBuilding',
        },
        {
            Header: 'Drop Off Room',
            accessor: 'dropoffRoom',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    const columnsDriver = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Student',
            accessor: 'student',
        },
        {
            Header: 'Course #',
            accessor: 'course',
        },
        {
            Header: 'Pick Up Time',
            accessor: 'startTime',
        },
        {
            Header: 'Drop Off Time',
            accessor: 'endTime',
        },
        {
            Header: 'Pick Up Building',
            accessor: 'pickupBuilding',
        },
        {
            Header: 'Pick Up Room',
            accessor: 'pickupRoom',
        },
        {
            Header: 'Drop Off Building',
            accessor: 'dropoffBuilding',
        },
        {
            Header: 'Drop Off Room',
            accessor: 'dropoffRoom',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    const columnsRider = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Driver',
            accessor: 'driver',
        },
        {
            Header: 'Course #',
            accessor: 'course',
        },
        {
            Header: 'Pick Up Time',
            accessor: 'startTime',
        },
        {
            Header: 'Drop Off Time',
            accessor: 'endTime',
        },
        {
            Header: 'Pick Up Building',
            accessor: 'pickupBuilding',
        },
        {
            Header: 'Pick Up Room',
            accessor: 'pickupRoom',
        },
        {
            Header: 'Drop Off Building',
            accessor: 'dropoffBuilding',
        },
        {
            Header: 'Drop Off Room',
            accessor: 'dropoffRoom',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];


    const buttonColumnsRider = [
        ...columnsRider,
        ButtonColumn("Edit", "primary", editCallback, "RideTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "RideTable")
    ]

    const buttonColumnsAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "RideTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "RideTable")
    ]

   
    const columnsToDisplay = (hasRole(currentUser, "ROLE_ADMIN")) ? buttonColumnsAdmin : (hasRole(currentUser, "ROLE_DRIVER")) ? columnsDriver: buttonColumnsRider;
    
    
    return <OurTable
        data={ride}
        columns={columnsToDisplay}
        testid={"RideTable"}
    />;
};