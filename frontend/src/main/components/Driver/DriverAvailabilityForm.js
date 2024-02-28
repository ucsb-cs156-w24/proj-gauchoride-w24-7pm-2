import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function DriverAvailabilityForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "DriverAvailabilityForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="id">id</Form.Label>
                <Form.Control
                    data-testid={testidPrefix + "-id"}
                    id="id"
                    type="text"
                    isInvalid={Boolean(errors.id)}
                    {...register("id", {
                        required: "id is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.id?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="driverId">driverId</Form.Label>
                <Form.Control
                    data-testdriverId={testdriverIdPrefix + "-driverId"}
                    driverId="driverId"
                    type="text"
                    isInvaldriverId={Boolean(errors.driverId)}
                    {...register("driverId", {
                        required: "driverId is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.driverId?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="day">day</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-day"}
                    id="day"
                    type="text"
                    isInvalid={Boolean(errors.day)}
                    {...register("day", {
                        required: "day is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.day?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="start">start</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-start"}
                    id="start"
                    type="text"
                    isInvalid={Boolean(errors.start)}
                    {...register("start", {
                        required: "start is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.start?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="end">end</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-end"}
                    id="end"
                    type="text"
                    isInvalid={Boolean(errors.end)}
                    {...register("end", {
                        required: "end is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.end?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="notes">end</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-notes"}
                    id="notes"
                    type="text"
                    isInvalid={Boolean(errors.notes)}
                    {...register("notes", {
                        required: "notes is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.notes?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default DriverAvailabilityForm;