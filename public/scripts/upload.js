const uploadFileForm = document.getElementById('upload-file-form');
const fileInput = document.querySelector('#upload-file-input')

fileInput.addEventListener('change', () => {
    uploadFileForm.submit();
});