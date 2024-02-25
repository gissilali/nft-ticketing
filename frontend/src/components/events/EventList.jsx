"use client";

import useAxios from "@/hooks/useAxios";
import { EventCard } from "@/components/events/EventCard";
import { useEffect } from "react";
import { EventGrid } from "@/components/shared/EventGrid";
import { useEventsStore } from "@/store/events.store";

export const EventList = () => {
  const { axios } = useAxios();

  const { events, updateEvents } = useEventsStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      updateEvents(response.data);
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <div>
      {events.length > 0 ? (
        <EventGrid>
          {events.map((event) => (
            <EventCard className={"col-span-1"} event={event} key={event.id} />
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
