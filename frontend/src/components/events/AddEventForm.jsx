"use client";

import { useForm } from "react-hook-form";
import {
  FormControl,
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
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Checkbox } from "@/components/ui/checkbox";

export const AddEventForm = ({ onSuccessfulSubmission }) => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      ticketPrice: 0,
      maxTickets: 0,
      eventDuration: null,
      isUnlimited: true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEvent = useEventsStore((state) => state.addEvent);
  const isUnlimited = form.watch("isUnlimited");

  const { axios } = useAxios();

  function onSubmit(values) {
    console.log({ values });
    setIsSubmitting(true);
    values.ticketPrice = Number(values.ticketPrice);
    values.maxTickets = isUnlimited ? -1 : Number(values.maxTickets);
    values.startDate = values.eventDuration?.from;
    values.endDate = values.eventDuration?.to;
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
      })
      .finally(() => {
        setIsSubmitting(false);
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
                <Input disabled={isUnlimited} type={"number"} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isUnlimited"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="isUnlimited"
                  />
                  <label
                    htmlFor="isUnlimited"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unlimited
                  </label>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDuration"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Event Duration</FormLabel>
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
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </form>
    </Form>
  );
};
