import { EventList } from "@/components/events/EventList";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Home() {
  return (
    <>
      <PageHeader title={"All Events"} />
      <EventList />
    </>
  );
}
