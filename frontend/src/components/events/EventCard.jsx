import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const EventCard = ({ event }) => {
  return (
    <Card className={"flex flex-col"}>
      <CardHeader className={"flex-1"}>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className={"w-full"} variant={"outline"}>
          Buy Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};
