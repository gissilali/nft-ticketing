"use client";

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/shared/DatePicker";
import useAxios from "@/hooks/useAxios";
import { useEventsStore } from "@/store/events.store";

export const AddEventForm = ({ onSuccessfulSubmission }) => {
  const form = useForm({
    defaultValues: {
      ticketPrice: 0,
      maxTickets: 0,
      startDate: null,
    },
  });

  const addEvent = useEventsStore((state) => state.addEvent);

  const { axios } = useAxios();

  function onSubmit(values) {
    values.ticketPrice = Number(values.ticketPrice);
    values.maxTickets = Number(values.maxTickets);
    axios
      .post("/events", values)
      .then(({ data }) => {
        addEvent(data);
        onSuccessfulSubmission();
      })
      .catch((e) => {
        if (e.response && e.response.status === 400 && e.response.data) {
          for (const field in e.response.data) {
            form.setError(field, {
              type: "custom",
              message: e.response.data[field].at(0),
            });
          }
        }
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={"Name of your event"} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your event."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className={"flex space-x-4"}>
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <div className={"flex"}>
                    <Input
                      className={"rounded-e-none"}
                      type={"number"}
                      {...field}
                    />
                    <span className="flex items-center justify-center bg-slate-100 border rounded-s-none rounded-lg text-xs  px-2">
                      ETH
                    </span>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tickets</FormLabel>
                <FormControl>
                  <Input type={"number"} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => {
            console.log({ field }, "I put a spell on you");
            return (
              <FormItem>
                <FormLabel>Event Start Date</FormLabel>
                <FormControl>
                  <div>
                    <DatePicker date={field.value} onSelect={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            );
          }}
        />
        <Button type="submit">
          Submit {form.formState.isSubmitting.toString()}
        </Button>
      </form>
      {form.formState.isSubmitting && (
        <div
          className={
            "absolute -top-2 rounded-lg flex justify-center items-center right-0 left-0 h-full w-full bg-slate-300 opacity-45"
          }
        >
          <h2 className="">Submitting...</h2>
        </div>
      )}
    </Form>
  );
};
