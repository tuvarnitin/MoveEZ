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