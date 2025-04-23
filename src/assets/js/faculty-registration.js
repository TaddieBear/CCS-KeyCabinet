const facultyForm = document.getElementById('facultyForm');
const submitButton = facultyForm.querySelector('button[type="submit"]');

facultyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const facultyId = document.getElementById('facultyId').value;
    const rfidUid = document.getElementById('rfidInput').value;
    const roleType = document.getElementById('roleSelect').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const suffix = document.getElementById('suffix').value;
    const pinCode = document.getElementById('pinCode').value;

    try {
        // Show SweetAlert loading indicator
        Swal.fire({
            title: 'Please wait...',
            text: 'Submitting faculty information...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await axios.get('https://keycabinet.cspc.edu.ph/api/faculty', {
            params: {
                faculty_id: facultyId,
                rfid_uid: rfidUid,
                role_type: roleType,
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                suffix: suffix,
                ...(pinCode && pinCode.trim() !== '' && { pin_code: pinCode.toString() })
            },
            headers: {
                'X-API-KEY': 'keycab.api.key',
                'Accept': 'application/json',
                'User-Agent': 'ElectronApp',
                'Origin': 'https://keycabinet.cspc.edu.ph'
            }
        });

        if (response.data.exists) {
            await Swal.fire({
                icon: 'warning',
                title: 'Already Registered!',
                text: 'This faculty is already in the system.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Got it!'
            });
        } else {
            const facultyData = {
                faculty_id: facultyId,
                rfid_uid: rfidUid,
                role_type: roleType,
                fname: firstName,
                mname: middleName,
                lname: lastName,
                suffix: suffix,
                admin_id: 1,
                status: "Enabled"
            };

            if (pinCode && pinCode.trim() !== '') {
                facultyData.pin_code = pinCode;
            }

            const storeResponse = await axios.post('https://keycabinet.cspc.edu.ph/faculty/store', facultyData, {
                headers: {
                    'X-API-KEY': 'keycab.api.key',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'ElectronApp',
                    'Origin': 'https://keycabinet.cspc.edu.ph'
                }
            });

            if (storeResponse.status >= 200 && storeResponse.status < 300) {
                await Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Faculty registered successfully!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                facultyForm.reset();
                resetFormInputs();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Registered locally but failed to sync with server.',
                    confirmButtonColor: '#d33'
                });
            }
        }
    } catch (error) {
        console.error('Error details:', error);
        if (error.response) {
            await Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: error.response.data.message || error.response.statusText,
                confirmButtonColor: '#d33'
            });
        } else if (error.request) {
            await Swal.fire({
                icon: 'error',
                title: 'No Response',
                text: 'Server did not respond. Check your connection.',
                confirmButtonColor: '#d33'
            });
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
    } finally {
        // Just re-enable button (no spinner logic now)
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
    }
});

function resetFormInputs() {
    const formElements = facultyForm.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.disabled = false;
        if (element.type === 'text' || element.type === 'password') {
            element.readOnly = false;
        }
    });
}
