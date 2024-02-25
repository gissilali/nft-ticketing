import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddEventForm } from "@/components/events/AddEventForm";

export const AddEventButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        onClick={() => setIsDialogOpen(!isDialogOpen)}
        className={
          "inline-flex justify-center items-center space-x-4 rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700"
        }
      >
        New Event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <AddEventForm onSuccessfulSubmission={() => setIsDialogOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
