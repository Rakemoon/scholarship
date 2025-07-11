import { useGetPrograms } from "@/features/scholarship/hooks/get-programs";
import { Button } from "@/components/Button";
import { ExperimentalInjection } from "../context/experimental-context";

function AddressGroup() {
  // hooks
  const { programs } = useGetPrograms();

  const { setter, ref } = ExperimentalInjection.use();

  return (
    <div className="flex flex-row gap-2">
      {programs?.map(({ contractAddress, id }, i) => {
        return (
          <div key={i} className="w-fit mb-4">
            <Button
              onClick={() => {
                ref.id.current = id;
                setter.setAddress(contractAddress as `0x`);
              }}
              label={`${contractAddress.slice(0, 10)}.....`}
              size="small"
            />
          </div>
        );
      })}
    </div>
  );
}

export default AddressGroup;
