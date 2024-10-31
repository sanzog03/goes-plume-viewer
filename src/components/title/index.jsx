import { Paper, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import "./index.css";

const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 15px;
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
            <HorizontalLayout>
                <TextField id="outlined-basic" label="Search by Plume Name" variant="outlined" style={{width: "100%"}}/>
            </HorizontalLayout>
            <HorizontalLayout>
                <div style={{width: "45%", height: "90%"}} >
                    <DatePicker 
                        label="Start Date"
                        // defaultValue={dayjs('2022-04-17')} 
                    /> 
                </div>
                <div style={{width: "45%", height: "90%"}} >
                    <DatePicker 
                        label="End Date"
                        // defaultValue={dayjs('2022-04-20')} 
                    />
                </div>
            </HorizontalLayout>
        </Paper>
    )
}