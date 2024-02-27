"use client";
import { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { EventGrid } from "@/components/shared/EventGrid";
import { TicketCard } from "@/components/ticketing/TicketCard";
import useAuthStore from "@/store/auth.store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Table>
          <TableCaption>A list of your recent sales.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">TX Hash</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <a
                      title={ticket.transactionHash}
                      className="hover:underline block"
                      href={`https://sepolia.etherscan.io/tx/${ticket.transactionHash}`}
                      target="_blank"
                    >
                      {ticket.transactionHash.substring(0, 15)}...
                      {ticket.transactionHash.slice(-4)}
                    </a>
                  </TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell className="text-right">
                    {ticket.ticketPrice} ETH
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className={"flex items-center justify-center h-96 w-full"}>
          <p>Tickets purchased by you will appear here</p>
        </div>
      )}
    </>
  );
};
