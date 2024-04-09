"use client";

import Describe from "./describe";
import Sign from "../sign";
import { useAppContext } from "@/contexts/app";
import { useState } from "react";

export default function () {
  const { user } = useAppContext();
  const [step, setStep] = useState("describe");

  return <>{user ? <div>coming soon...</div> : <Sign />}</>;
}
