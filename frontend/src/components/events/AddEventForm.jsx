"use client";

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
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
import { MAX_UINT, useWeb3 } from "@/hooks/useWeb3";
import useAuthStore from "@/store/auth.store";

export const AddEventForm = ({ onSuccessfulSubmission }) => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      ticketPrice: 0,
      maxTickets: 1,
      eventDuration: null,
      isUnlimited: false,
      maxTicketsPerAccount: 1,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEvent = useEventsStore((state) => state.addEvent);
  const isUnlimited = form.watch("isUnlimited");
  const maxTickets = form.watch("maxTickets");

  const { axios } = useAxios();
  const { createLock } = useWeb3();
  const { account } = useAuthStore();

  async function onSubmit(values) {
    console.log({ values });
    setIsSubmitting(true);
    values.ticketPrice = Number(values.ticketPrice);
    values.maxTickets = isUnlimited ? -1 : Number(values.maxTickets);
    values.startDate = values.eventDuration?.from;
    values.endDate = values.eventDuration?.to;

    // we create a lock on unlock protocol by passing event details and the wallet address of the current user
    const lock = await createLock(values, account);

    //on successful lock creation we send the event details to the backend to be stored in a database
    values.lockAddress = lock.address;
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
      <FormDescription>
        {isSubmitting ? "Please do not close this dialog" : ""}
      </FormDescription>
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
        <div className="flex space-x-4">
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
            name="maxTicketsPerAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tickets Per Account</FormLabel>
                <FormControl>
                  <Input
                    max={isUnlimited ? MAX_UINT : maxTickets}
                    disabled={isUnlimited}
                    type={"number"}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
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
