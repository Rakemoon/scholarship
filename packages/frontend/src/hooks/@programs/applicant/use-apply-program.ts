import { useAccount, useConfig, useWriteContract } from "wagmi";
import { scholarshipProgramAbi } from "@/repo/abi";
import { useMutation } from "@tanstack/react-query";
import { type Address } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { api } from "@/repo/api";

export function useApplyProgram(props: {
  address: Address;
  programId: bigint;
  applicantSize: bigint;
  appBatch: bigint;
  nextMilestoneId: bigint;
}) {
  const queryWrite = useWriteContract();
  const applicant = useAccount();
  const config = useConfig();
  /**
   * @function useMakeDonation
   * @description Starts a new donation.
   * @returns {Function} make some donation to contract.
   */
  const queryMut = useMutation({
    mutationFn: async (mut: {
      name: string;
      milestones: {
        mType: number;
        price: bigint;
        templateId: bigint;
        metadata: string;
        title: string;
        description: string;
      }[];
    }) => {

      const milestoneResults = await Promise.all(
        mut.milestones.map(async (x) => {

          let url = "";
          if (x?.templateId !== BigInt(0)) {
            const result = await api.v1.program.gen.post({
              title: x.title,
              description: x.description,
            });
            if (result.error) throw result.error;
            url = result.data.url;
          }

          return {
            mType: x.mType,
            price: x.price,
            templateId: x.templateId,
            metadata: url,
          };
        })
      );
      console.log("contract", props.address);

      const tx = await queryWrite.writeContractAsync({
        abi: scholarshipProgramAbi,
        address: props.address || "0x",
        functionName: "applyProgramContract",
        args: [milestoneResults],
      });

      await waitForTransactionReceipt(config, { hash: tx });
      await api.v1.applicant.new.post({
        applicant: {
          applicantAddress: applicant.address ?? "",
          id: `${props.programId}_${props.appBatch}_${props.applicantSize + 1n}`,
          batch: Number(props.appBatch),
          bio: "",
          introducingVideo: "",
          name: mut.name,
          programId: props.programId + "",
        },
        contractId: props.programId + "",
        milestones: mut.milestones.map((m) => ({
          batch: Number(props.appBatch),
          metadata: m.metadata,
          price: "" + m.price,
          title: m.title,
          type: (["TEMPLATE", "CUSTOM"] as const)[m.mType as 0 | 1],
        })),
        nextMilestoneId: Number(props.nextMilestoneId),
      });
    },
    mutationKey: [
      "applyProgram",
      props.address,
      props.appBatch + "",
      props.applicantSize + "",
      props.nextMilestoneId + "",
      props.programId + "",
      applicant.address,
    ],
  });

  return [queryMut, queryWrite] as const;
}
