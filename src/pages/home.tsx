import Head from "next/head";
import { Box, Button, Container, Stack, TextInput, Title } from "@mantine/core";
import { useStyles } from "@/styles/home.styles";
import {
  DateRangePicker,
  DateRangePickerValue,
  TimeRangeInput,
} from "@mantine/dates";
import { useState } from "react";
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

export default function Home() {
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
    },

    validate: {
      token: (value) => (value.length > 0 ? null : "Token is required"),
      description: (value) =>
        value.length > 0 ? null : "Description is required",
    },
  });

  const {
    classes: { container, containerForm },
  } = useStyles();

  const handleSubmit = async () => {
    api.defaults.headers.common["Authorization"] = `Bearer ${values.token}`;

    if (!dateRangeValue[0] || !dateRangeValue[1]) {
      console.error("Please select a date range");
      showNotification({
        title: "There's a problem",
        message: "Please select a date range",
        color: "red",
      });
      return;
    }

    const workedDays = getDates(dateRangeValue[0], dateRangeValue[1]);

    const appointments: AppointmentModel[] = workedDays.map((date) => {
      const dateString = date.toISOString();
      const startTime = timeRangeValue[0].toISOString();
      const endTime = timeRangeValue[1].toISOString();

      return AppointmentModel.factory({
        day: dateString,
        start: startTime,
        stop: endTime,
        task_description: values.description,
        user: "61c29da8d35ccb08a067ef37",
        project: "590c95d9a81d20002ff3570e",
        customer: "590c95d8a81d20002ff3570d",
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

        const response = await AppointmentService.createAppointment(
          appointment
        );

        if (response.status === 200) {
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
        }
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
        }
      }
    }
  };

  const isValidForm = (() => {
    const isValidDateRange = dateRangeValue[0] && dateRangeValue[1];
    const isValidTimeRange = timeRangeValue[0] && timeRangeValue[1];
    const isValidForm = isValid("token") && isValid("description");

    return !(!isValidDateRange || !isValidTimeRange || !isValidForm);
  })();

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
              />

              <TextInput
                label="Enter the description of worked days"
                withAsterisk
                description="This description will be used to autocomplete worked days in FCTeam"
                icon={<IconFileDescription size={14} />}
                placeholder="Ex.: Meeting with client, Worked on project, etc."
                {...getInputProps("description")}
              />

              <DateRangePicker
                label="Select the date range"
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
                withAsterisk
                description="This time range will be used to autocomplete worked days in FCTeam"
                icon={<IconClock size={14} />}
                placeholder="Pick time range"
                value={timeRangeValue}
                onChange={setTimeRangeValue}
              />

              <Button disabled={!isValidForm} type="submit">
                Create appointments
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </div>
  );
}
