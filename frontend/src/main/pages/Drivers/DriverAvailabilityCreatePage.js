import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DriverAvailabilityCreatePage() {

    const objectToAxiosParams = (driverAvailability) => ({
        url: "/api/driverAvailability/new",
        method: "POST",
        params: {
            driverId: driverAvailability.driverId,
            day: driverAvailability.day,
            startTime: driverAvailability.start,
            endTime: driverAvailability.end,
            notes: driverAvailability.notes
        }
    });

    const onSuccess = (driverAvailability) => {
        toast(`New Driver Availability Created - id: ${driverAvailability.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/driverAvailability/all"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/availability/" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Submit New Driver Availability</h1>
            <DriverAvailabilityForm submitAction={onSubmit} />
        </div>
        </BasicLayout>
    )
}