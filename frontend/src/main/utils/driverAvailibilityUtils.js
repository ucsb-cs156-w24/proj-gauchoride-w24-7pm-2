import { toast } from "react-toastify";

export function onPutSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/driverAvailability",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}