import { PageHeader } from "@/components/shared/PageHeader";
import { TicketSalesList } from "@/components/ticketing/TicketSalesList";

export default function Sales() {
  return (
    <>
      <PageHeader title={"My Sales"} />
      <TicketSalesList />
    </>
  );
}
