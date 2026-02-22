import { useState, useEffect } from "react";
import Select from "react-select";
import { getContracts, getContractDetails, createJob } from "../../api/job";

export default function JobForm() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  const [location, setLocation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [service, setService] = useState(null);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    const data = await getContracts();
    setContracts(
      data.map((c: any) => ({
        value: c.id,
        label: `${c.contractLocationName} - ${c.contractServiceName}`,
      }))
    );
  };

  const handleContractChange = async (option: any) => {
    setSelectedContract(option);

    const details = await getContractDetails(option.value);

    setLocation(details.location);
    setCustomer(details.customer);
    setService(details.service);
    setPrice(details.price);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await createJob({
      jobcontractId: selectedContract.value,
      jobLocationName: location.id,
      jobCustomer: customer.id,
      jobServiceName: service.id,
      jobPrice: price,
    });

    alert("Job created successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* Contract Select2-like */}
      <label>Contract</label>
      <Select
        options={contracts}
        value={selectedContract}
        onChange={handleContractChange}
        isSearchable
      />

      {/* Auto-filled fields */}
      <label>Location</label>
      <input value={location?.name || ""} disabled />

      <label>Customer</label>
      <input value={customer?.name || ""} disabled />

      <label>Service</label>
      <input value={service?.name || ""} disabled />

      <label>Price</label>
      <input value={price} disabled />

      <button type="submit">Save Job</button>
    </form>
  );
}
