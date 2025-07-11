import { scholarshipProgramAbi } from "@/repo/abi";
import { api } from "@/repo/api";
import { useQuery } from "@tanstack/react-query";
import { useReadContracts } from "wagmi";

export function useGetPrograms() {
  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const result = await api.v1.program.all.get();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  return { programs };
}

export function useGetProgram(programId: string | undefined) {
  const { data: programs } = useQuery({
    queryKey: ["program", programId],
    queryFn: async () => {
      const result = await api.v1.program.id({ id: programId! }).get();
      if (result.error) throw result.error;
      return result.data;
    },
    enabled: programId !== undefined,
  });

  return { programs };
}

export function useGetProgramContract(address: `0x${string}`) {
  const { data, ...queryStatus } = useReadContracts({
    contracts: [
      {
        abi: scholarshipProgramAbi,
        address,
        functionName: "getApplicantSize",
        args: [],
      },
      {
        abi: scholarshipProgramAbi,
        address,
        functionName: "getAppStatus",
        args: [],
      },
      {
        abi: scholarshipProgramAbi,
        address,
        functionName: "stackedToken",
        args: [],
      },
      {
        abi: scholarshipProgramAbi,
        address,
        functionName: "appBatch",
        args: [],
      },
      {
        abi: scholarshipProgramAbi,
        address,
        functionName: "getNextMilestone",
        args: [],
      },
    ],
  });

  const [applicantSize, appStatus, stackedToken, appBatch, nextMilestone] =
    data ?? [];

  return {
    applicantSize,
    appStatus,
    stackedToken,
    queryStatus,
    appBatch,
    nextMilestone,
  };
}
