import { ChangeEvent, useState } from "react";

import { AppointmentModel } from "@/models/appointment.model";
import { useStyles } from "@/styles/home.styles";
import { DateUtils } from "@/utils/date/date.utils";
import {
  Box,
  Button,
  Container,
  Flex,
  Loader,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  DateRangePicker,
  DateRangePickerValue,
  TimeRangeInput,
} from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendar,
  IconClock,
  IconFileDescription,
  IconKey,
} from "@tabler/icons";
import Head from "next/head";

import { useCreateAppointmentMutation } from "@/hooks/home/use-create-appointment-mutation";
import { useGetCustomersQuery } from "@/hooks/home/use-get-customers-query";
import { useGetProjectsQuery } from "@/hooks/home/use-get-projects-query";
import { useGetUserQuery } from "@/hooks/home/use-get-user-query";
import { api } from "@/lib/axios";
import { JwtPayload, decode } from "jsonwebtoken";

export default function Home() {
  const [decodedToken, setDecodedToken] = useState<JwtPayload>({});

  const { getInputProps, onSubmit, values, isValid } = useForm({
    initialValues: {
      token: "",
      description: "",
      customer: "",
      project: "",
    },

    validate: {
      token: (value) => (value.length > 0 ? null : "Token is required"),
      description: (value) =>
        value.length > 0 ? null : "Description is required",
      customer: (value) => (value.length > 0 ? null : "Customer is required"),
      project: (value) => (value.length > 0 ? null : "Project is required"),
    },
  });

  const createAppointmentMutation = useCreateAppointmentMutation();
  const userQuery = useGetUserQuery({
    username: decodedToken.unique_name?.toLowerCase() || "",
  });
  const customersQuery = useGetCustomersQuery({
    company: userQuery.data?.company || "",
  });
  const projectsQuery = useGetProjectsQuery({
    customer: values.customer || "",
  });

  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerValue>([
    null,
    null,
  ]);

  const [timeRangeValue, setTimeRangeValue] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const handleSubmit = async () => {
    const workedDays = DateUtils.getIntervalDates(
      dateRangeValue[0]!,
      dateRangeValue[1]!
    );
    const startTime = timeRangeValue[0].toISOString();
    const endTime = timeRangeValue[1].toISOString();

    const appointments: AppointmentModel[] = workedDays.map((date) => {
      const dateString = date.toISOString();

      return AppointmentModel.factory({
        day: dateString,
        start: startTime,
        stop: endTime,
        task_description: values.description,
        user: userQuery.data?._id || "",
        project: values.project,
        customer: values.customer,
      });
    });

    for (const appointment of appointments) {
      await createAppointmentMutation.mutateAsync(appointment);
    }
  };

  function setTokenOnHttpClient(token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  function onTokenInputChange(e: ChangeEvent<HTMLInputElement>) {
    getInputProps("token").onChange(e);

    const value = e.target.value;
    if (!value) return;

    const decodedToken = decode(value);

    if (!decodedToken || typeof decodedToken === "string") return;

    setTokenOnHttpClient(value);
    setDecodedToken(decodedToken);
  }

  function validateForm() {
    const isValidDateRange = dateRangeValue[0] && dateRangeValue[1];
    const isValidTimeRange = timeRangeValue[0] && timeRangeValue[1];
    const isValidForm = isValid("token") && isValid("description");

    return !(!isValidDateRange || !isValidTimeRange || !isValidForm);
  }

  const {
    classes: { container, containerForm },
  } = useStyles();

  return (
    <div>
      <Head>
        <title>Next.js FCTeam Autocomplete</title>
        <meta
          name="description"
          content="Next.js app to autocomplete worked days in FCTeam platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className={container}>
        <Title size="h3">FCTeam worked days autocomplete</Title>

        <Box className={containerForm}>
          <form onSubmit={onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Enter JWT the auth token"
                withAsterisk
                description="This token will be used to authenticate in FCTeam API"
                icon={<IconKey size={14} />}
                rightSection={userQuery.isLoading ? <Loader size={14} /> : null}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                {...getInputProps("token")}
                onChange={onTokenInputChange}
              />

              <Flex sx={{ flex: 1 }} gap="md">
                <Select
                  sx={{ flex: 1 }}
                  disabled={!values.token}
                  data={
                    customersQuery.data?.map((customer) => ({
                      label: customer?.name,
                      value: customer?._id,
                    })) || []
                  }
                  rightSection={
                    customersQuery.isLoading ? <Loader size={14} /> : null
                  }
                  label="Choose customer"
                  withAsterisk
                  description="Choose the customer to autocomplete the worked days"
                  placeholder="Pick one"
                  {...getInputProps("customer")}
                />

                <Select
                  sx={{ flex: 1 }}
                  disabled={!values.customer}
                  data={
                    projectsQuery.data?.map((project) => ({
                      label: project?.name,
                      value: project?._id,
                    })) || []
                  }
                  rightSection={
                    projectsQuery.isLoading ? <Loader size={14} /> : null
                  }
                  label="Choose project"
                  withAsterisk
                  description="Choose the project to autocomplete the worked days"
                  placeholder="Pick one"
                  {...getInputProps("project")}
                />
              </Flex>

              <TextInput
                label="Enter the description of worked days"
                disabled={!values.project}
                withAsterisk
                description="This description will be used to autocomplete worked days in FCTeam"
                icon={<IconFileDescription size={14} />}
                placeholder="Ex.: Meeting with client, Worked on project, etc."
                {...getInputProps("description")}
              />

              <DateRangePicker
                label="Select the date range"
                disabled={!values.description}
                withAsterisk
                excludeDate={(date) =>
                  DateUtils.isWeekend(date) || DateUtils.isHoliday(date)
                }
                description="This date range will be used to autocomplete worked days in FCTeam, we will automatically remove the weekends and holidays"
                icon={<IconCalendar size={14} />}
                placeholder="Pick dates range"
                value={dateRangeValue}
                onChange={setDateRangeValue}
              />

              <TimeRangeInput
                label="Enter the worked hours"
                disabled={!dateRangeValue[0] || !dateRangeValue[1]}
                withAsterisk
                description="This time range will be used to autocomplete worked days in FCTeam"
                icon={<IconClock size={14} />}
                placeholder="Pick time range"
                value={timeRangeValue}
                onChange={setTimeRangeValue}
              />

              <Button
                disabled={!validateForm()}
                loading={createAppointmentMutation.isLoading}
                type="submit"
              >
                Create appointments
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </div>
  );
}
