import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Flex,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useStyles } from "@/styles/home.styles";
import {
  DateRangePicker,
  DateRangePickerValue,
  TimeRangeInput,
} from "@mantine/dates";
import { ChangeEvent, useState } from "react";
import { useForm } from "@mantine/form";
import { getDates, isHoliday, isWeekend } from "@/utils/date/date.utils";
import { AppointmentModel } from "@/models/appointment.model";
import { showNotification, updateNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { AppointmentService } from "@/services/appointment.service";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconFileDescription,
  IconKey,
} from "@tabler/icons";
import { api } from "@/lib/axios";
import { UserService } from "@/services/user.service";
import { decode } from "jsonwebtoken";
import { CustomerService } from "@/services/customer.service";
import { ProjectService } from "@/services/project.service";

export default function Home() {
  const [user, setUser] = useState<{
    company: string;
    name: string;
    _id: string;
  } | null>(null);

  const [customers, setCustomers] = useState<
    { name: string; company: string }[]
  >([]);

  const [projects, setProjects] = useState<
    { name: string; _id: string }[] | never[]
  >([]);

  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerValue>([
    null,
    null,
  ]);
  const [timeRangeValue, setTimeRangeValue] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

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

  const {
    classes: { container, containerForm },
  } = useStyles();

  const handleSubmit = async () => {
    console.log(values);

    const workedDays = getDates(dateRangeValue[0]!, dateRangeValue[1]!);

    const appointments: AppointmentModel[] = workedDays.map((date) => {
      const dateString = date.toISOString();
      const startTime = timeRangeValue[0].toISOString();
      const endTime = timeRangeValue[1].toISOString();

      return AppointmentModel.factory({
        day: dateString,
        start: startTime,
        stop: endTime,
        task_description: values.description,
        user: user?._id || "",
        project: values.project,
        customer: values.customer,
        source: "manual",
        toDo: false,
        track_option: "start_and_end",
      });
    });

    for (const appointment of appointments) {
      try {
        showNotification({
          id: appointment.day,
          title: "Creating appointment",
          message:
            'Creating appointment for date "' +
            dayjs(appointment.day).format("DD/MM/YYYY") +
            '"',
          loading: true,
          disallowClose: true,
          autoClose: false,
        });

        await AppointmentService.createAppointment(appointment);

        updateNotification({
          id: appointment.day,
          title: "Appointment created",
          color: "teal",
          message:
            'Appointment for date "' +
            dayjs(appointment.day).format("DD/MM/YYYY") +
            '" created',
          icon: <IconCheck size={16} />,
          autoClose: false,
        });
      } catch (e: any) {
        console.error(e);

        if (e?.response?.status === 401) {
          updateNotification({
            id: appointment.day,
            title: "There's a problem",
            message: "Invalid token",
            color: "red",
            autoClose: false,
          });

          return;
        }

        updateNotification({
          id: appointment.day,
          title: "There's a problem",
          message: "Something went wrong",
          color: "red",
        });
      }
    }
  };

  const handleTokenChange = async (e: ChangeEvent<HTMLInputElement>) => {
    getInputProps("token").onChange(e);

    const value = e.target.value;

    if (value) {
      api.defaults.headers.common["Authorization"] = `Bearer ${value}`;
      const returnedUser = await getUserInfo(value);

      if (returnedUser) {
        const returnedCustomers = await getCustomers(returnedUser.company);

        for (const customer of returnedCustomers) {
          const returnedProjects = await getProjects(customer.id);

          setProjects((prevProjects) => [...prevProjects, ...returnedProjects]);
        }
      }
    }
  };

  const getUserInfo = async (value: string) => {
    try {
      showNotification({
        id: "loading-user",
        title: "Identifying user",
        message: "Loading user information",
        loading: true,
      });

      const decodedToken = decode(value);

      if (typeof decodedToken !== "string") {
        const username = String(decodedToken?.unique_name).toLowerCase();

        const getUserResponse = await UserService.getUser(username);

        setUser(getUserResponse.data[0]);

        updateNotification({
          id: "loading-user",
          title: "User identified",
          message: `User: ${getUserResponse.data[0].name} identified`,
          color: "teal",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        return getUserResponse.data[0];
      }
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-user",
        title: "There's a problem",
        message: "We can't identify the user of this token",
        color: "red",
        autoClose: 3000,
      });

      setUser(null);
      return null;
    }
  };

  const getCustomers = async (company: string) => {
    try {
      showNotification({
        id: "loading-customers",
        title: "Loading customers",
        message: "Loading customers information",
        loading: true,
      });

      const getCustomersResponse = await CustomerService.getCustomer(company);

      setCustomers(getCustomersResponse.data);

      updateNotification({
        id: "loading-customers",
        title: "Customers loaded",
        message: `${getCustomersResponse.data.length} customers loaded`,
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });

      return getCustomersResponse.data;
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-customers",
        title: "There's a problem",
        message: "We can't load the customers",
        color: "red",
        autoClose: 3000,
      });

      return [];
    }
  };

  const getProjects = async (customer: string) => {
    try {
      showNotification({
        id: "loading-projects",
        title: "Loading projects",
        message: "Loading projects information",
        loading: true,
      });

      const getProjectsResponse = await ProjectService.getProject(customer);

      updateNotification({
        id: "loading-projects",
        title: "Projects loaded",
        message: `${getProjectsResponse.data.length} projects loaded`,
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });

      return getProjectsResponse.data;
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-projects",
        title: "There's a problem",
        message: "We can't load the projects",
        color: "red",
        autoClose: 3000,
      });

      return [];
    }
  };

  const isValidForm = () => {
    const isValidDateRange = dateRangeValue[0] && dateRangeValue[1];
    const isValidTimeRange = timeRangeValue[0] && timeRangeValue[1];
    const isValidForm = isValid("token") && isValid("description");

    return !(!isValidDateRange || !isValidTimeRange || !isValidForm);
  };

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
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                {...getInputProps("token")}
                onChange={handleTokenChange}
              />

              <Flex sx={{ flex: 1 }} gap="md">
                <Select
                  sx={{ flex: 1 }}
                  disabled={!values.token}
                  data={customers.map((customer) => ({
                    label: customer?.name,
                    value: customer?.company,
                  }))}
                  label="Choose customer"
                  withAsterisk
                  description="Choose the customer to autocomplete the worked days"
                  placeholder="Pick one"
                  {...getInputProps("customer")}
                />

                <Select
                  sx={{ flex: 1 }}
                  disabled={!values.customer}
                  data={projects.map((customer) => ({
                    label: customer?.name,
                    value: customer?._id,
                  }))}
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
                excludeDate={(date) => isWeekend(date) || isHoliday(date)}
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

              <Button disabled={!isValidForm()} type="submit">
                Create appointments
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </div>
  );
}
