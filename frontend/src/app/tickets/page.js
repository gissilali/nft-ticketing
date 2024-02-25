import { TicketList } from "@/components/ticketing/TicketList";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = {
  title: "My Tickets",
  description: "nft event ticketing",
};
export default function Tickets() {
  return (
    <>
      <PageHeader title={"My Tickets"} />
      <TicketList />
    </>
  );
}
