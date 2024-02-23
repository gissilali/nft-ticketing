"use client";

import useAxios from "@/hooks/useAxios";
import { EventCard } from "@/components/events/EventCard";
import { useEffect, useState } from "react";
import { EventGrid } from "@/components/events/EventGrid";
import { useEventsStore } from "@/store/events.store";

export const EventList = () => {
  const { axios } = useAxios();

  const { events, updateEvents } = useEventsStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get("/events");

      updateEvents(response.data);

    console.log({ events });
  };

  return (
    <div className={"pt-8"}>
      <h1
        className={"font-semibold mt-3 text-3xl  tracking-tight text-slate-900"}
      >
        All Events
      </h1>
      <hr className={"my-4"} />
      {events.length > 0 ? (
        <EventGrid>
          {events.map((event) => (
            <EventCard className={'col-span-1'} event={event} key={event.id} />
          ))}
        </EventGrid>
      ) : (
        <div className={"flex items-center justify-center h-96 w-full"}>
          <p>No Events Yet</p>
        </div>
      )}
    </div>
  );
};
