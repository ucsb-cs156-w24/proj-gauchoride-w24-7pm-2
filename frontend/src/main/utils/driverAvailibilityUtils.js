import { toast } from "react-toastify";

export function onPutSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsCancelApplicationMember(cell) {
    return {
        url: "/api/driverAvailibility/cancel",
        method: "PUT",
        params: {
            id: cell.row.values.id
        }
    }
}