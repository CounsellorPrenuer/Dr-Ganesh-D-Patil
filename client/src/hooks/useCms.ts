import { useQuery } from "@tanstack/react-query";
import { fetchCms } from "@/lib/sanity";

export function useCms() {
  return useQuery({
    queryKey: ["cms"],
    queryFn: fetchCms,
    staleTime: 60_000,
    retry: 1,
  });
}
