import { useCallback, useEffect, useState, useRef } from "react";
import Card from "../../components/Card/card";
import {
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Divider,
  Skeleton,
  Typography,
  Button,
} from "@mui/material";
import { minBasePayOptions, minExpOptions, workModeOptions } from "./data";

export default function JobSearch() {
  const iniTialFilters = {
    minExp: "",
    companyName: "",
    minPay: "",
    role: "",
    location: "",
    workMode: "",
  };

  /* States */
  const initialized = useRef(false);
  const isFetch = useRef(true);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(iniTialFilters);

  /* functions */

  const onFilterClear = () => {
    setFilters(iniTialFilters);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilters((filter) => ({ ...filter, [name]: value }));
  };

  const onFilters = useCallback(() => {
    const updatedJobs = jobs.filter((job) => {
      return (
        // Filter by minimum experience if filters.minExp is provided
        (filters.minExp === "" ||
          (job.minExp !== null && job.minExp <= filters.minExp)) &&
        // Filter by company name
        job.companyName.includes(filters.companyName) &&
        // Filter by minimum pay if filters.minPay is provided
        (filters.minPay === "" ||
          (job.minJdSalary !== null && job.minJdSalary >= filters.minPay)) &&
        // Filter by work mode
        (filters.workMode === "" ||
          (filters.workMode === "remote"
            ? job.location === "remote"
            : job.location !== "remote")) &&
        // Filter by job role
        job.jobRole.includes(filters.role) &&
        // Filter by location
        job.location.includes(filters.location)
      );
    });

    setFilteredJobs(updatedJobs);
  }, [filters, jobs]);

  // API
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
  };

  // This functions will fetch the data
  const fetchData = useCallback(async () => {
    if (!isFetch.current) return;

    setIsLoading(true);
    isFetch.current = false;

    const body = JSON.stringify({
      limit: 10,
      offset: jobs.length,
    });

    try {
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        { ...requestOptions, body }
      );
      const data = await response.json();
      setJobs((prev) => [...prev, ...data.jdList]);
    } catch (err) {
      const errorMessage = "Error: " + err.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
      isFetch.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    onFilters();
  }, [filters, jobs]);

  // UseEffect added to call fetch data function
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchData();
    }
  }, []);

  return (
    <>
      <Container sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            sx={{ p: 1 }}
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent="center"
          >
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="minExp">Min Experience</InputLabel>
              <Select
                name="minExp"
                labelId="minExp"
                id="minExp"
                value={filters.minExp}
                label="Min Experience"
                onChange={handleChange}
              >
                {minExpOptions.map((option) => (
                  <MenuItem value={option.vlue}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="minPay">Minimum Base Pay Salary</InputLabel>
              <Select
                name="minPay"
                labelId="minPay"
                id="minPay"
                value={filters.minPay}
                label="Minimum Base Pay Salary"
                onChange={handleChange}
              >
                {minBasePayOptions.map((option) => (
                  <MenuItem value={option.vlue}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="minPay">Remote/On-Site</InputLabel>
              <Select
                name="workMode"
                labelId="workMode"
                id="workMode"
                value={filters.workMode}
                label="Remote/On-Site"
                onChange={handleChange}
              >
                {workModeOptions.map((option) => (
                  <MenuItem value={option.vlue}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="companyName"
              variant="outlined"
              label="Company Name"
              name="companyName"
              value={filters.companyName}
              onChange={handleChange}
              size="small"
              sx={{ maxWidth: 200 }}
            />
            <TextField
              id="role"
              variant="outlined"
              label="Role"
              name="role"
              value={filters.role}
              onChange={handleChange}
              size="small"
              sx={{ maxWidth: 200 }}
            />
            <TextField
              id="location"
              variant="outlined"
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              size="small"
              sx={{ maxWidth: 200 }}
            />
            <Button onClick={onFilterClear}>Clear</Button>
          </Box>
          <Divider />
          <Box>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              justifyContent="center"
            >
              {filteredJobs.map((job) => (
                <Grid item>
                  <Card key={job.jdUid} data={job} />
                </Grid>
              ))}
              {isLoading &&
                [...Array(2)].map((e, i) => (
                  <Grid item>
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={500}
                      width={345}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
        {!filteredJobs.length && !isLoading && (
          <Box
            height={500}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h3">No Result Found</Typography>
          </Box>
        )}
        <Box></Box>
        <Box height={500} sx={{ backgroundColor: "transparent" }}></Box>
      </Container>
    </>
  );
}
