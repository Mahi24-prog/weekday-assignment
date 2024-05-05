import * as React from "react";
import { Box, Button, Card as MuiCard } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { LocationOn, BusinessCenter, Scale } from "@mui/icons-material";
import { toUpperCase } from "../../utils/functions";

export default function Card({ data }) {
  const {
    companyName,
    logoUrl,
    jobRole,
    jdLink,
    jobDetailsFromCompany,
    location,
    minExp,
    maxExp,
    minJdSalary,
    maxJdSalary,
  } = data;

  const getSalary = (min, max) => {
    if(min && max){
      return `Estimate Salary: ${min} - ${max} LPA`
    }else if(min){
      return `Minumum Salary: ${min} LPA`
    }else if(max){
      return `Maximum Salary: ${max} LPA`
    }else{
      'Not Disclosed'
    }
  }

  const getExp = (min, max) => {
    if(min && max){
      return `${min} - ${max} years`
    }else if(min){
      return `Minimun ${min} years`
    }else if(max){
      return `Maximum ${max} years`
    }else{
      return 'Not Mention'
    }
  }

  return (
    <MuiCard sx={{ maxWidth: 345, "&:hover": {transform: 'scale(1.03)', transition: '0.5s all ease-in-out'}}}>
      <CardHeader
        avatar={<img src={logoUrl} height={50} width={50} alt="logo" />}
        title={
          <Box>
            <Typography fontSize={16}>{companyName}</Typography>
            {jobRole && <Typography fontSize={14} color="grey">{toUpperCase(jobRole)}</Typography>}
          </Box>
        }
        subheader={
          <Box sx={{ mt: 1 }} flexDirection="column">
            <Box display="flex" gap={1}>
              <LocationOn fontSize="small" />
              <Typography variant="body2" component="span">
                {toUpperCase(location)}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <BusinessCenter fontSize="small" />
              <Typography
                variant="body2"
                component="span"
              >{`${getExp(minExp, maxExp)}`}</Typography>
            </Box>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ pb: 1, pt: 1 }}>
          <Typography variant="body2" color="GrayText">
            {getSalary(minJdSalary, maxJdSalary)}
          </Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight={600} color="GrayText">
          About Company:
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          About Us
        </Typography>
        <Box maxHeight={200} overflow="auto">
          <Typography variant="body2">{jobDetailsFromCompany}</Typography>
        </Box>
      </CardContent>
      <Box sx={{ mt: 2, boxShadow: "rgba(0, 0, 0, 0.1) 0px -10px 10px"}} p={2}>
          <Button variant="contained" fullWidth href={jdLink} target="_blank">
            Apply
          </Button>
        </Box>
    </MuiCard>
  );
}
