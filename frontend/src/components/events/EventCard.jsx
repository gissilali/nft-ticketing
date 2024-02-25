import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddEventForm } from "@/components/events/AddEventForm";
import { useEffect, useState } from "react";
import { ContractDetailsCard } from "@/components/events/ContractDetailsCard";
import useAxios from "@/hooks/useAxios";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";

export const EventCard = ({ event }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contract, setContractDetails] = useState(null);
  const [isProcessingTicket, setIsProcessingTicket] = useState(false);

  const { axios } = useAxios();
  const router = useRouter();

  useEffect(() => {
    fetchContractDetails();
  }, []);
  const fetchContractDetails = () => {
    axios
      .get(`/events/${event.lockAddress}/contract`)
      .then(({ data }) => {
        setContractDetails(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const attemptTicketPurchase = () => {
    setIsProcessingTicket(true);
    axios
      .post(`/orders/${event.id}/tickets`)
      .then(({ data }) => {
        console.log(data);
        router.push("/tickets");
      })
      .catch((e) => {
        console.log(e);
        alert("Ticket purchase failed, try again later");
      })
      .finally(() => {
        setIsProcessingTicket(false);
      });
  };

  return (
    <Card className={"flex flex-col"}>
      <CardHeader className={"flex-1"}>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild onClick={() => setIsDialogOpen(!isDialogOpen)}>
            <Button className={"w-full"} variant={"outline"}>
              Buy Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>{event.description}</DialogDescription>
              <div className={"pt-4"}>
                <ContractDetailsCard contract={contract} />
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={attemptTicketPurchase}
                disabled={
                  (contract &&
                    contract?.maxNumberOfKeys - contract?.numberOfOwners ===
                      0) ||
                  isProcessingTicket
                }
                className={"w-full space"}
              >
                {isProcessingTicket ? (
                  <>
                    <LoadingSpinner />
                    <span>Processing Ticket...</span>
                  </>
                ) : (
                  <span>Pay with Crypto</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
