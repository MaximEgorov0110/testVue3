import { useStaffStore } from "./modules/staff";

export const useStore = () => ({
  staff: useStaffStore()
});