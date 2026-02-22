import api from "./core/api";

export const getContracts = async () => {
  const res = await api.get("/contracts/");
  return res.data;
};

export const getContractDetails = async (id: number) => {
  const res = await api.get(`/contracts/${id}/details/`);
  return res.data;
};

export const createJob = async (payload: any) => {
  const res = await api.post("/jobs/", payload);
  return res.data;
};
