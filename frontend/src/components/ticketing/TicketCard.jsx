import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractDetailsCard } from "@/components/events/ContractDetailsCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const TicketCard = ({ ticket }) => {
  return (
    <>
      <Card className={"flex flex-col"}>
        <CardHeader className={"flex-1"}>
          <CardTitle className={"text-base leading-0"}>
            {ticket.event.title}
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};
