import { CiWallet, FaCar, FaTruck, GiBanknote, GrBike } from "../assets/icons/index.js";

export const VEHICLES_METAS = {
    bike: {
        label: "Bike",
        Icon: GrBike,
    },
    auto: {
        label: "Auto",
        Icon: FaCar,
    },
    car: {
        label: "Car",
        Icon: FaCar,
    },
    loading: {
        label: "Loading",
        Icon: FaTruck,
    },
    truck: {
        label: "Truck",
        Icon: FaTruck,
    },
};

export const PAYMENT_METHODS = [
    {
        id: "cash",
        Icon: GiBanknote,
        title: "Cash",
        sub: "Pay driver after ride",
    },
    {
        id: "online",
        Icon: CiWallet,
        title: "Online Payment",
        sub: "UPI · Card · Netbanking",
    },
];

export const VEHICLES = [
    {
        id: "bike",
        label: "Bike",
        Icon: GrBike,
        desc: "Quick & affordable",
    },
    {
        id: "auto",
        label: "Auto",
        Icon: FaCar,
        desc: "Everyday rides",
    },
    {
        id: "car",
        label: "Car",
        Icon: FaCar,
        desc: "Comfort rides",
    },
    {
        id: "loading",
        label: "Loading",
        Icon: FaTruck,
        desc: "Small cargo",
    },
    {
        id: "truck",
        label: "Truck",
        Icon: FaTruck,
        desc: "Heavy transport",
    },
];

export const STATUS_LABEL = {
  idle: { label: "Awaiting Confirmation", sublabel: "Booking is being processed", dot: "bg-amber-400" },
  requested: { label: "Awaiting Confirmation", sublabel: "Booking is being processed", dot: "bg-amber-400" },
  awaiting_payment: { label: "Payment Pending", sublabel: "Customer payment is pending", dot: "bg-purple-400" },
  confirmed: { label: "Heading to Pickup", sublabel: "Drive to the pickup location", dot: "bg-amber-400" },
  started: { label: "Ride in Progress", sublabel: "Heading to drop location", dot: "bg-emerald-400" },
  completed: { label: "Ride Completed", sublabel: "Trip has ended successfully", dot: "bg-zinc-400" },
  cancelled: { label: "Ride Cancelled", sublabel: "This ride was cancelled", dot: "bg-red-400" },
  rejected: { label: "Ride Rejected", sublabel: "Ride was rejected", dot: "bg-red-400" },
  expired: { label: "Request Expired", sublabel: "Booking timed out", dot: "bg-orange-400" },
};

export const PAYMENT_BADGE = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    started: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
    paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
    confirmed: { label: "Paid", cls: "bg-emerald-100 text-emerald-700" },
    cash: { label: "Cash", cls: "bg-zinc-100 text-zinc-700" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};