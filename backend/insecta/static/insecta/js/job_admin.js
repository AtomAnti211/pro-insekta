document.addEventListener("DOMContentLoaded", function () {
    const contractField = document.getElementById("id_jobcontractId");
    const locationField = document.getElementById("id_jobLocationName");
    const customerField = document.getElementById("id_jobCustomer");
    const serviceField = document.getElementById("id_jobServiceName");
    const priceField = document.getElementById("id_jobPrice");

    if (!contractField) return;

    contractField.addEventListener("change", function () {
        const contractId = this.value;
        if (!contractId) return;

        fetch(`/admin/ajax/contract/${contractId}/`)
            .then(response => response.json())
            .then(data => {
                locationField.value = data.location_id;
                customerField.value = data.customer_id;
                serviceField.value = data.service_id;
                priceField.value = data.price;
            });
    });
});