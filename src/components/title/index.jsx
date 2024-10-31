import { Paper, Typography } from "@mui/material";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styled from "styled-components";
import "./index.css";

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

export const Title = () => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                sx={{ color: 'text.secondary' }}
                align="center"
                style={{ borderBottom: "2px solid #082A64" }}
            >
                Methane Plume - Data Portal
            </Typography>
            {/* <HorizontalLayout>
                <DatePicker 
                    label="Start Date"
                    defaultValue={'2022-04-17'} 
                /> 
                <DatePicker 
                    label="End Date"
                    defaultValue={'2022-04-20'} 
                /> 
            </HorizontalLayout> */}
        </Paper>
    )
}