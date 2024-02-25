"use client";
import { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { EventGrid } from "@/components/shared/EventGrid";
import { TicketCard } from "@/components/ticketing/TicketCard";
import useAuthStore from "@/store/auth.store";

export const TicketSalesList = () => {
  const [tickets, setTickets] = useState([]);
  const { axios } = useAxios();
  const { userAccount } = useAuthStore();

  useEffect(() => {
    if (userAccount) {
      fetchTickets();
    }
  }, [userAccount]);

  const fetchTickets = () => {
    axios
      .get(`/orders`)
      .then(({ data }) => {
        setTickets(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      {tickets.length > 0 ? (
        <EventGrid>
          {tickets.map((ticket) => {
            return <TicketCard ticket={ticket} key={ticket.id} />;
          })}
        </EventGrid>
      ) : (
        <div className={"flex items-center justify-center h-96 w-full"}>
          <p>Tickets purchased by you will appear here</p>
        </div>
      )}
    </>
  );
};
