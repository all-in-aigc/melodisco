"use client";

import { useEffect, useState } from "react";

import Describe from "./describe";
import Info from "./info";
import Preview from "./preview";
import Sign from "../sign";
import Steps from "./steps";
import { useAppContext } from "@/contexts/app";
import { useSearchParams } from "next/navigation";

export default function () {
  const searchParams = useSearchParams();
  const { user } = useAppContext();
  const {
    songTaskStep: step,
    setSongTaskStep: setStep,
    setSongTask,
  } = useAppContext();

  const fetchTask = async function (taskid: string) {
    try {
      const params = {
        task_uuid: taskid,
      };
      const resp = await fetch("/api/get-song-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { code, message, data } = await resp.json();
      if (data) {
        setSongTask(data);
        if (data.song_uuids) {
          setStep(3);
        } else if (data.lyrics) {
          setStep(2);
        } else {
          setStep(1);
        }
      }
    } catch (e) {
      console.log("fetch task failed:", e);
    }
  };

  useEffect(() => {
    const taskid = searchParams.get("taskid") as string;
    if (taskid) {
      fetchTask(taskid);
    }
  }, [searchParams]);

  return (
    <>
      {user ? (
        <div className="mt-8">
          <Steps />

          <div className="max-w-xl mt-8">
            {step === 1 && <Describe />}
            {step === 2 && <Info />}
            {step === 3 && <Preview />}
          </div>
        </div>
      ) : (
        <Sign />
      )}
    </>
  );
}
