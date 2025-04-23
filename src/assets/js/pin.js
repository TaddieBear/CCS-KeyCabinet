document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById('roleSelect');
    const pinCodeContainer = document.getElementById('pinCodeContainer');
  
    roleSelect.addEventListener('change', function () {
      if (roleSelect.value === 'Technician') {
        pinCodeContainer.classList.remove('hidden');
      } else {
        pinCodeContainer.classList.add('hidden');
      }
    });

});