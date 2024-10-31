import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Divider from '@mui/material/Divider';


import "./index.css";

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;


export function PlumeCard({ plumeSourceName, plumeSourceId, imageUrl, tiffUrl, lon, lat, maxPlumeConcentration, concentrationUncertainity }) {
  return (
    <Card sx={{ display: 'flex', margin: '15px'}}>
        <div
            style={{display: "flex", alignItems: "center", justifyContent: "center"}}
        >
            <CardMedia
                component="img"
                sx={{ width: 100, height: 100 }}
                image={imageUrl}
                alt="Live from space album cover"
            />
        </div>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <HorizontalLayout>
                <div className="card-plume card-plume-source-name">
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Plume Source Name
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {plumeSourceName}
                    </Typography>

                </div>
                <div className='card-plume card-plume-id'>
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Plume Id
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {plumeSourceId}
                    </Typography>
                </div>
            </HorizontalLayout>
            <HorizontalLayout>
                <a href={tiffUrl}>
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Download the Tiff File
                    </Typography></a>
            </HorizontalLayout>
            <Divider></Divider>
            <HorizontalLayout>
                <div className="card-plume card-plume-concentration">
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Max Plume Concentration
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {maxPlumeConcentration}
                    </Typography>

                </div>
                <div className='card-plume card-plume-uncertainity'>
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Concentration Uncertainity
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {concentrationUncertainity}
                    </Typography>
                </div>
            </HorizontalLayout>
            <HorizontalLayout>
                <div className="card-plume card-plume-longitude">
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Longitude of max concentration
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {lon}
                    </Typography>

                </div>
                <div className='card-plume card-plume-uncertainity'>
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Longitude of max concentration
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {lat}
                    </Typography>
                </div>
            </HorizontalLayout>
        </CardContent>
      </Box>
    </Card>
  );
}
