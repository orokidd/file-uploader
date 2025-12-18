// const deleteModal = document.querySelector("#delete-modal")
// const confirmButton = document.querySelector(".confirm-btn")
// const cancelButton = document.querySelector(".cancel-btn")
// const deleteForm = document.querySelector("#post-delete-form")

// function openDeleteModal(actionLink) {
//     deleteModal.style.display = "flex"
//     deleteForm.action = actionLink

//     cancelButton.addEventListener("click", () => {
//         deleteModal.style.display = "none";
//     });

//     window.addEventListener("click", (e) => {
//         if (e.target === deleteModal) deleteModal.style.display = "none";
//     });
// }

const newFolderModal = document.querySelector(".new-folder-form-modal")
const deleteFileModal = document.querySelector(".file-delete-modal")

function openNewFolderModal() {
    newFolderModal.style.display = "flex"

    window.addEventListener("click", (e) => {
        if (e.target === newFolderModal) newFolderModal.style.display = "none";
    });
}

function openDeleteFileModal(fileId) {
    const deleteForm = document.querySelector("#file-delete-form");
    
    deleteFileModal.style.display = "flex"
    deleteForm.action = `/files/${fileId}/delete`;

    window.addEventListener("click", (e) => {
        if (e.target === deleteFileModal) deleteFileModal.style.display = "none";
    });
}